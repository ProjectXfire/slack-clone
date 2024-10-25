import type { IResponse } from "../shared/interfaces";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createOrGet = mutation({
  args: {
    workspaceId: v.string(),
    memberId: v.string(),
  },
  handler: async (ctx, args): Promise<IResponse<{ result: string; isNew: boolean } | null>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: null };
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return { isError: true, message: "Invalid workspace ID", data: null };
      const memberId = ctx.db.normalizeId("members", args.memberId);
      if (!memberId) return { isError: true, message: "Invalid member ID", data: null };
      const currentMember = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
      const otherMember = await ctx.db.get(memberId);
      if (!currentMember || !otherMember)
        return { isError: true, message: "Member not found", data: null };
      const existConversation = await ctx.db
        .query("conversations")
        .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
        .filter((q) =>
          q.or(
            q.and(
              q.eq(q.field("memberOneId"), currentMember._id),
              q.eq(q.field("memberTwoId"), otherMember._id)
            ),
            q.and(
              q.eq(q.field("memberOneId"), otherMember._id),
              q.eq(q.field("memberTwoId"), currentMember._id)
            )
          )
        )
        .unique();
      if (!existConversation) {
        const conversationId = await ctx.db.insert("conversations", {
          memberOneId: currentMember._id,
          memberTwoId: otherMember._id,
          workspaceId,
        });
        const conversation = await ctx.db.get(conversationId);
        if (!conversation) return { isError: true, message: "Conversation not found", data: null };
        return {
          isError: false,
          message: "Conversation successfully created",
          data: {
            result: conversation._id,
            isNew: true,
          },
        };
      }
      return {
        isError: false,
        message: "Conversation successfully loaded",
        data: {
          result: existConversation._id,
          isNew: false,
        },
      };
    } catch {
      return { isError: true, message: "Failed to create or get conversation", data: null };
    }
  },
});
