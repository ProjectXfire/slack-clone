import type { IResponse } from "../shared/interfaces";
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx): Promise<IResponse<Doc<"workspaces">[]>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: [] };
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
      return {
        isError: false,
        message: "Workspaces successfully loaded",
        data: memberOfWorkspaces,
      };
    } catch {
      return { isError: true, message: "Failed to load the data", data: [] };
    }
  },
});

export const getOne = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args): Promise<IResponse<Doc<"workspaces"> | null>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: null };
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return { isError: false, message: "Invalid workspace ID", data: null };
      const workspace = await ctx.db
        .query("workspaces")
        .filter((q) => q.eq(q.field("_id"), args.workspaceId))
        .unique();
      if (!workspace) return { isError: false, message: "Workspace not found", data: null };
      const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
      if (!member) return { isError: false, message: "Unauthorized", data: null };
      return { isError: false, message: "Workspace successfully loaded", data: workspace };
    } catch {
      return { isError: true, message: "Failed to load the data", data: null };
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
    const [members, channels, messages, conversations, reactions] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
        .collect(),
      ctx.db
        .query("channels")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
        .collect(),
      ctx.db
        .query("messages")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
        .collect(),
      ctx.db
        .query("conversations")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
        .collect(),
    ]);
    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    for (const channel of channels) {
      await ctx.db.delete(channel._id);
    }
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }
    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
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
