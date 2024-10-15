import type { IResponse } from "../shared/interfaces";
import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

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
