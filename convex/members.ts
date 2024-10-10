import { IResponse } from "../shared/interfaces";
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";

type Member = Doc<"members"> & { user: Doc<"users"> };

export const get = query({
  args: { workspaceId: v.string() },
  handler: async (ctx, args): Promise<IResponse<Member[]>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: [] };
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return { isError: false, message: "Invalid workspace ID", data: [] };
      const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
      if (!member) return { isError: false, message: "Invalid member", data: [] };
      const members = await ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
        .collect();
      const membersWithUser = [];
      for (const item of members) {
        const user = await pupulateUser(ctx, item.userId);
        if (user) membersWithUser.push({ ...item, user });
      }
      return { isError: false, message: "Members successfully loaded", data: membersWithUser };
    } catch {
      return { isError: true, message: "Failed to load the data", data: [] };
    }
  },
});

export const current = query({
  args: { workspaceId: v.string() },
  handler: async (ctx, args): Promise<IResponse<Doc<"members"> | null>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: null };
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return { isError: false, message: "Invalid workspace ID", data: null };
      const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
      if (!member) return { isError: false, message: "You are not a member", data: null };
      return { isError: false, message: "Member successfully loaded", data: member };
    } catch {
      return { isError: true, message: "Failed to load the data", data: null };
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
