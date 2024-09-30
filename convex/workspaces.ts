import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const workspaces = await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    return workspaces;
  },
});

export const getOne = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const workspace = await ctx.db
      .query("workspaces")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("_id"), args.workspaceId)))
      .first();
    return workspace;
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const joinCode = "123456"; // Todo: create a proper joincode
    if (!userId) return null;
    const newWorkspaceId = await ctx.db.insert("workspaces", { userId, joinCode, name: args.name });
    return newWorkspaceId;
  },
});
