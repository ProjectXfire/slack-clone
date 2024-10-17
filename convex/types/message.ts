import { Doc, Id } from "../_generated/dataModel";

type Reactions = {
  value: string;
  count: number;
  reactions: Id<"members">[];
};

type Thread = {
  count: number;
  image?: string;
  timestamp: number;
};

export interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  body: string;
  image?: string | null;
  memberId: Id<"members">;
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
  member: Doc<"users"> | null;
  reactions: Reactions[];
  thread: Thread;
}
