import { Id } from "./_generated/dataModel";
import { query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export function pupulateUser(ctx: QueryCtx, id: Id<"users">) {
  return ctx.db.get(id);
}
