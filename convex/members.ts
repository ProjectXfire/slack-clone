import { IResponse } from "../shared/interfaces";
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { pupulateUser } from "./users";

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
      const membersWithoutMe = members.filter((m) => m._id !== member._id);
      const membersWithUser = [];
      for (const item of membersWithoutMe) {
        const user = await pupulateUser(ctx, item.userId);
        if (user) membersWithUser.push({ ...item, user });
      }
      return { isError: false, message: "Members successfully loaded", data: membersWithUser };
    } catch {
      return { isError: true, message: "Failed to load the data", data: [] };
    }
  },
});

export const getOne = query({
  args: { id: v.string() },
  handler: async (ctx, args): Promise<IResponse<Member | null>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: null };
      const memberId = ctx.db.normalizeId("members", args.id);
      if (!memberId) return { isError: true, message: "Invalid member ID", data: null };
      const member = await ctx.db.get(memberId);
      if (!member) return { isError: true, message: "Member not found", data: null };
      const currentMember = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", member.workspaceId).eq("userId", member.userId)
        )
        .unique();
      if (!currentMember) return { isError: true, message: "Invalid member", data: null };
      const user = await pupulateUser(ctx, member.userId);
      if (!user) return { isError: true, message: "User not found", data: null };
      return { isError: false, message: "Member successfully loaded", data: { ...member, user } };
    } catch {
      return { isError: true, message: "Failed to load the data", data: null };
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

export const update = mutation({
  args: {
    id: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args): Promise<IResponse<null | string>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("User ID not found");
      const memberId = ctx.db.normalizeId("members", args.id);
      if (!memberId) throw new Error("Invalid member ID");
      const member = await ctx.db.get(memberId);
      if (!member) return { isError: true, message: "Member not found", data: null };
      const currentMember = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", member.workspaceId).eq("userId", userId)
        )
        .unique();
      if (!currentMember) return { isError: true, message: "Unauthorized", data: null };
      await ctx.db.patch(memberId, { role: args.role });
      return { isError: false, message: "Member updated", data: memberId };
    } catch {
      return { isError: true, message: "Failed to update the data", data: null };
    }
  },
});

export const remove = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args): Promise<IResponse<null | string>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) throw new Error("User ID not found");
      const memberId = ctx.db.normalizeId("members", args.id);
      if (!memberId) throw new Error("Invalid member ID");
      const member = await ctx.db.get(memberId);
      if (!member) return { isError: true, message: "Member not found", data: null };
      const currentMember = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", member.workspaceId).eq("userId", userId)
        )
        .unique();
      if (!currentMember) return { isError: true, message: "Unauthorized", data: null };
      if (member.role === "admin")
        return { isError: true, message: "Admin cannot be removed", data: null };
      if (currentMember._id === memberId && currentMember.role === "admin")
        return { isError: true, message: "Cannot remove self if self is an admin", data: null };
      const [messages, reactions, conversations] = await Promise.all([
        ctx.db
          .query("messages")
          .withIndex("by_member_id", (q) => q.eq("memberId", memberId))
          .collect(),
        ctx.db
          .query("reactions")
          .withIndex("by_member_id", (q) => q.eq("memberId", memberId))
          .collect(),
        ctx.db
          .query("conversations")
          .filter((q) =>
            q.or(q.eq(q.field("memberOneId"), member._id), q.eq(q.field("memberTwoId"), member._id))
          )
          .collect(),
      ]);
      for (const msg of messages) {
        await ctx.db.delete(msg._id);
      }
      for (const rtc of reactions) {
        await ctx.db.delete(rtc._id);
      }
      for (const con of conversations) {
        await ctx.db.delete(con._id);
      }
      await ctx.db.delete(memberId);
      return { isError: false, message: "Member removed", data: memberId };
    } catch {
      return { isError: true, message: "Failed to remove the data", data: null };
    }
  },
});

export function populateMember(ctx: QueryCtx, id: Id<"members">) {
  return ctx.db.get(id);
}

export function getMember(
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
