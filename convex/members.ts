import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

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
      const members = await ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
        .collect();
      const membersWithUser = [];
      for (const item of members) {
        const user = await pupulateUser(ctx, item.userId);
        if (user) membersWithUser.push({ ...item, user });
      }
      return membersWithUser;
    } catch {
      return "Failed to load the data";
    }
  },
});

export const current = query({
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
      return member;
    } catch {
      return "Failed to load the data";
    }
  },
});

function pupulateUser(ctx: QueryCtx, id: Id<"users">) {
  return ctx.db.get(id);
}
