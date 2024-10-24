import { Id } from "@/convex/_generated/dataModel";

export interface CreateMessageDto {
  workspaceId: string;
  channelId: string;
  body: string;
  image?: Id<"_storage">;
  parentMessageId?: string;
}
