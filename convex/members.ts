import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
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

export const create = mutation({
  args: {
    joinCode: v.string(),
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User ID not found");
    const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
    if (!workspaceId) throw new Error("Invalid workspace ID");
    const workspace = await ctx.db.get(workspaceId);
    if (!workspace) throw new Error("Workspace not found");
    if (args.joinCode !== workspace.joinCode.toLowerCase()) throw new Error("Invalid join code");
    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();
    if (existingMember) return { workspaceId, isMember: true };
    await ctx.db.insert("members", { role: "member", userId, workspaceId });
    return { workspaceId, isMember: false };
  },
});

function pupulateUser(ctx: QueryCtx, id: Id<"users">) {
  return ctx.db.get(id);
}
