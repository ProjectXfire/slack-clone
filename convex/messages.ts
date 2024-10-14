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
      /*let imageId = undefined;
      if (args.image) {
        imageId = ctx.db.normalizeId("_storage", args.image);
        if (!imageId) return { isError: true, message: "Invalid image ID", data: null };
      }*/
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

      // Todo: handle conversation

      const messageId = await ctx.db.insert("messages", {
        workspaceId,
        body,
        image,
        memberId: member._id,
        channelId,
        parentMessageId,
      });
      return { isError: false, message: "Message created successfully", data: messageId };
    } catch {
      return { isError: true, message: "Failed to load the data", data: null };
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
