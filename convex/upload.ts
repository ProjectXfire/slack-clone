import { IResponse } from "../shared/interfaces";
import { mutation } from "./_generated/server";

export const generateUrl = mutation({
  args: {},
  handler: async (ctx): Promise<IResponse<string | null>> => {
    try {
      const data = await ctx.storage.generateUploadUrl();
      return { isError: false, message: "Upload URL created", data };
    } catch {
      return { isError: true, message: "Failed to create thee URL", data: null };
    }
  },
});
