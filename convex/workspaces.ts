import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  handler: async (ctx) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return "User ID not found";
      const members = await ctx.db
        .query("members")
        .withIndex("by_user_id", (q) => q.eq("userId", userId))
        .collect();
      const workspaceIds = members.map((m) => m.workspaceId);
      const memberOfWorkspaces = [];
      for (const id of workspaceIds) {
        const workspace = await ctx.db.get(id);
        if (workspace) memberOfWorkspaces.push(workspace);
      }
      return memberOfWorkspaces;
    } catch {
      return "Failed to get workspaces";
    }
  },
});

export const getOne = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return "User ID not found";
      const workspace = await ctx.db
        .query("workspaces")
        .filter((q) =>
          q.and(q.eq(q.field("userId"), userId), q.eq(q.field("_id"), args.workspaceId))
        )
        .unique();
      return workspace;
    } catch {
      return "Failed to get workspace";
    }
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const joinCode = generateCode();
    if (!userId) return null;
    const workspaceId = await ctx.db.insert("workspaces", { userId, joinCode, name: args.name });
    await ctx.db.insert("members", { userId, workspaceId, role: "admin" });
    return workspaceId;
  },
});

function generateCode() {
  const code = Array.from({ length: 6 }, () => {
    return "012345689abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)];
  }).join("");
  return code;
}
