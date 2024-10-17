import type { IResponse } from "../shared/interfaces";
import type { Message } from "./types/message";
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { populateMember } from "./members";
import { pupulateUser } from "./users";
import { paginationOptsValidator, PaginationResult } from "convex/server";

export const get = query({
  args: {
    channelId: v.optional(v.string()),
    conversationId: v.optional(v.string()),
    parentMessageId: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args): Promise<PaginationResult<Message>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("Unauthorized");
      let channelId = undefined;
      if (args.channelId) {
        channelId = ctx.db.normalizeId("channels", args.channelId);
        if (!channelId) throw new Error("Invalid channel ID");
      }
      let conversationId = undefined;
      if (args.conversationId) {
        conversationId = ctx.db.normalizeId("conversations", args.conversationId);
        if (!conversationId) throw new Error("Invalid conversation ID");
      }
      let parentMessageId = undefined;
      if (args.parentMessageId) {
        parentMessageId = ctx.db.normalizeId("messages", args.parentMessageId);
        if (!parentMessageId) throw new Error("Invalid parent message ID");
      }
      if (conversationId && !channelId && parentMessageId) {
        const parentMessage = await ctx.db.get(parentMessageId);
        if (!parentMessage) throw new Error("Parent message not found");
        conversationId = parentMessage.conversationId;
      }
      const results = await ctx.db
        .query("messages")
        .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
          q
            .eq("channelId", channelId)
            .eq("parentMessageId", parentMessageId)
            .eq("conversationId", conversationId)
        )
        .order("desc")
        .paginate(args.paginationOpts);
      const messages = [];
      for (const message of results.page) {
        const member = await populateMember(ctx, message.memberId);
        const user = member ? await pupulateUser(ctx, member.userId) : null;
        const reactions = await populateReactions(ctx, message._id);
        const thread = await populateThread(ctx, message._id);
        const image = message.image ? await ctx.storage.getUrl(message.image) : undefined;
        const countReactions = handleCountReactions(reactions);
        messages.push({ ...message, member: user, image, reactions: countReactions, thread });
      }
      return { ...results, page: messages };
    } catch {
      throw new Error("Failed to load the data");
    }
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.string(),
    channelId: v.optional(v.string()),
    conversationId: v.optional(v.string()),
    parentMessageId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<IResponse<string | null>> => {
    try {
      const { body, image } = args;
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: null };
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return { isError: true, message: "Invalid workspace ID", data: null };
      const member = await getMember(ctx, workspaceId, userId);
      if (!member) return { isError: true, message: "Member not found", data: null };
      let channelId = undefined;
      if (args.channelId) {
        channelId = ctx.db.normalizeId("channels", args.channelId);
        if (!channelId) return { isError: true, message: "Invalid channel ID", data: null };
      }
      let parentMessageId = undefined;
      if (args.parentMessageId) {
        parentMessageId = ctx.db.normalizeId("messages", args.parentMessageId);
        if (!parentMessageId)
          return { isError: true, message: "Invalid parent message ID", data: null };
      }
      let conversationId = undefined;
      if (args.conversationId) {
        conversationId = ctx.db.normalizeId("conversations", args.conversationId);
        if (!conversationId)
          return { isError: true, message: "Invalid conversation ID", data: null };
      }
      // Only possible if we are replying in a 1 to 1 conversation thread
      if (!conversationId && !channelId && parentMessageId) {
        const parentMessage = await ctx.db.get(parentMessageId);
        if (!parentMessage)
          return { isError: true, message: "Parent message ID not found", data: null };
        conversationId = parentMessage.conversationId;
      }
      const messageId = await ctx.db.insert("messages", {
        workspaceId,
        body,
        image,
        memberId: member._id,
        channelId,
        parentMessageId,
        conversationId,
      });
      return { isError: false, message: "Message created successfully", data: messageId };
    } catch {
      return { isError: true, message: "Failed to create the data", data: null };
    }
  },
});

function getMember(
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
): Promise<Doc<"members"> | null> {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
}

async function populateThread(
  ctx: QueryCtx,
  id: Id<"messages">
): Promise<{ count: number; image?: string; timestamp: number }> {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", id))
    .collect();
  if (messages.length === 0) return { count: 0, image: undefined, timestamp: 0 };
  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);
  if (!lastMessageMember) return { count: messages.length, image: undefined, timestamp: 0 };
  const lastMessageUser = await pupulateUser(ctx, lastMessageMember.userId);
  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
  };
}

function populateReactions(ctx: QueryCtx, id: Id<"messages">) {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", id))
    .collect();
}

function handleCountReactions(reactions: Doc<"reactions">[]) {
  const reactionsObj: Record<string, { count: number; reactions: Id<"members">[] }> = {};
  const reactionsArray: Array<{ value: string; count: number; reactions: Id<"members">[] }> = [];
  for (let i = 0; i < reactions.length; i++) {
    if (!reactionsObj[reactions[i].value]) {
      reactionsObj[reactions[i].value].count = 1;
      reactionsObj[reactions[i].value].reactions = [reactions[i].memberId];
    } else {
      reactionsObj[reactions[i].value].count++;
      reactionsObj[reactions[i].value].reactions = [
        ...reactionsObj[reactions[i].value].reactions,
        reactions[i].memberId,
      ];
    }
  }
  for (const key in reactionsObj) {
    const newReactionObj = {
      value: key,
      count: reactionsObj[key].count,
      reactions: reactionsObj[key].reactions,
    };
    reactionsArray.push(newReactionObj);
  }
  return reactionsArray;
}
