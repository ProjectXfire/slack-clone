import type { Id } from "@/convex/_generated/dataModel";

export interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  body: string;
  image?: string;
  memberId: Id<"members">;
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
  // Todo: conversation id
  parentMessageId?: Id<"messages">;
}
