import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: { workspaceId: v.string() },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return "User ID not found";
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return "Invalid workspace ID";
      const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
      if (!member) return "Invalid member";
      const channels = await ctx.db
        .query("channels")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
        .collect();
      return channels;
    } catch {
      return "Failed to load the data";
    }
  },
});
