import type { IResponse } from "../shared/interfaces";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getMember } from "./members";

export const toggle = mutation({
  args: {
    messageId: v.string(),
    value: v.string(),
  },
  handler: async (ctx, args): Promise<IResponse<string | null>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: null };
      const messageId = ctx.db.normalizeId("messages", args.messageId);
      if (!messageId) return { isError: true, message: "Invalid message ID", data: null };
      const message = await ctx.db.get(messageId);
      if (!message) return { isError: true, message: "Message not found", data: null };
      const member = await getMember(ctx, message.workspaceId, userId);
      if (!member) return { isError: true, message: "Unauthorized", data: null };
      const existMessageReactionFromUser = await ctx.db
        .query("reactions")
        .filter((q) =>
          q.and(
            q.eq(q.field("messageId"), messageId),
            q.eq(q.field("memberId"), member._id),
            q.eq(q.field("value"), args.value)
          )
        )
        .first();
      if (existMessageReactionFromUser) {
        await ctx.db.delete(existMessageReactionFromUser._id);
        return {
          isError: false,
          message: "Reaction removed",
          data: existMessageReactionFromUser._id,
        };
      }
      const reactionId = await ctx.db.insert("reactions", {
        memberId: member._id,
        messageId,
        value: args.value,
        workspaceId: message.workspaceId,
      });
      return { isError: false, message: "Reacted", data: reactionId };
    } catch {
      return { isError: true, message: "Failed to update reaction", data: null };
    }
  },
});

export function populateReactions(ctx: QueryCtx, id: Id<"messages">) {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", id))
    .collect();
}

export function handleCountReactions(reactions: Doc<"reactions">[]) {
  const reactionsObj: Record<string, { count: number; reactions: Id<"members">[] }> = {};
  const reactionsArray: Array<{ value: string; count: number; reactions: Id<"members">[] }> = [];
  for (let i = 0; i < reactions.length; i++) {
    if (!reactionsObj[reactions[i].value]) {
      reactionsObj[reactions[i].value] = { count: 1, reactions: [reactions[i].memberId] };
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
