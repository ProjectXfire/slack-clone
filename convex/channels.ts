import { IResponse } from "../shared/interfaces";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc } from "./_generated/dataModel";

export const get = query({
  args: { workspaceId: v.string() },
  handler: async (ctx, args): Promise<IResponse<Doc<"channels">[]>> => {
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
      const channels = await ctx.db
        .query("channels")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", workspaceId))
        .collect();
      return { isError: false, message: "Channels successfully loaded", data: channels };
    } catch {
      return { isError: true, message: "Failed to load the data", data: [] };
    }
  },
});

export const getOne = query({
  args: { channelId: v.string() },
  handler: async (ctx, args): Promise<IResponse<Doc<"channels"> | null>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: null };
      const channelId = ctx.db.normalizeId("channels", args.channelId);
      if (!channelId) return { isError: false, message: "Invalid channel ID", data: null };
      const channel = await ctx.db.get(channelId);
      if (!channel) return { isError: false, message: "Channel not found", data: null };
      const member = ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
        );
      if (!member) return { isError: false, message: "Invalid member", data: null };
      return { isError: false, message: "Channel successfully loaded", data: channel };
    } catch {
      return { isError: true, message: "Failed to load the data", data: null };
    }
  },
});

export const create = mutation({
  args: { workspaceId: v.string(), name: v.string() },
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
    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();
    const channel = await ctx.db.insert("channels", { name: parsedName, workspaceId });
    return channel;
  },
});

export const update = mutation({
  args: {
    channelId: v.string(),
    workspaceId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args): Promise<IResponse<string | null>> => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: null };
      const channelId = ctx.db.normalizeId("channels", args.channelId);
      if (!channelId) return { isError: true, message: "Invalid channel ID", data: null };
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return { isError: true, message: "Invalid workspace ID", data: null };
      const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
      if (!member || member.role !== "admin")
        return { isError: true, message: "Unauthorized", data: null };
      await ctx.db.patch(channelId, { name: args.name });
      return { isError: false, message: "Channel name updated", data: args.channelId };
    } catch {
      return { isError: true, message: "Failed to mutate the data", data: null };
    }
  },
});

export const remove = mutation({
  args: {
    channelId: v.string(),
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userId = await getAuthUserId(ctx);
      if (!userId) return { isError: true, message: "User ID not found", data: null };
      const channelId = ctx.db.normalizeId("channels", args.channelId);
      if (!channelId) return { isError: true, message: "Invalid channel ID", data: null };
      const workspaceId = ctx.db.normalizeId("workspaces", args.workspaceId);
      if (!workspaceId) return { isError: true, message: "Invalid workspace ID", data: null };
      const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", workspaceId).eq("userId", userId)
        )
        .unique();
      if (!member || member.role !== "admin")
        return { isError: true, message: "Unauthorized", data: null };
      await ctx.db.delete(channelId);
      return { isError: false, message: "Channel deleted", data: args.channelId };
    } catch {
      return { isError: true, message: "Failed to delete channel", data: null };
    }
  },
});
