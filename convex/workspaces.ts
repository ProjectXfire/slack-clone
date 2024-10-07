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
      return "Failed to load the data";
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
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return "Invalid workspace ID";
      const workspace = await ctx.db
        .query("workspaces")
        .filter((q) => q.eq(q.field("_id"), args.workspaceId))
        .unique();
      const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
      if (!member) return "Unauthorized";
      return workspace;
    } catch {
      return "Failed to load the data";
    }
  },
});

export const getInfo = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return "User ID not found";
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return "Invalid workspace ID";
      const workspace = await ctx.db
        .query("workspaces")
        .filter((q) => q.eq(q.field("_id"), args.workspaceId))
        .unique();
      if (!workspace) return "Workspace not found";
      const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
      return {
        name: workspace.name,
        isMember: !!member,
      };
    } catch {
      return "Failed to load the data";
    }
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const joinCode = generateCode();
    if (!userId) throw new Error("User ID not found");
    const workspaceId = await ctx.db.insert("workspaces", { userId, joinCode, name: args.name });
    await ctx.db.insert("members", { userId, workspaceId, role: "admin" });
    await ctx.db.insert("channels", { name: "general", workspaceId });
    return workspaceId;
  },
});

export const update = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User ID not found");
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member || member.role !== "admin") throw new Error("Unauthorized");
    await ctx.db.patch(args.workspaceId, { name: args.name });
    return args.workspaceId;
  },
});

export const remove = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User ID not found");
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member || member.role !== "admin") throw new Error("Unauthorized");
    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
        .collect(),
    ]);
    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    await ctx.db.delete(args.workspaceId);
    return args.workspaceId;
  },
});

export const newJoinCode = mutation({
  args: { workspaceId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User ID not found");
    const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
    if (!workspaceId) throw new Error("Invalid workspace ID");
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();
    if (!member || member.role !== "admin") throw new Error("Unauthorized");
    const joinCode = generateCode();
    await ctx.db.patch(workspaceId, { joinCode });
    const workspace = await ctx.db
      .query("workspaces")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("_id"), workspaceId)))
      .unique();
    if (!workspace) throw new Error("Workspace not found");
    return workspace.joinCode;
  },
});

function generateCode() {
  const code = Array.from({ length: 6 }, () => {
    return "012345689abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)];
  }).join("");
  return code;
}
