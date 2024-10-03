import { z } from "zod";

export const createChannelSchema = z.object({
  name: z.string().min(3),
});
