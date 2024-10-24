import type { Id } from "@/convex/_generated/dataModel";
import { User } from "@/core/auth/models";

export type Reactions = {
  value: string;
  count: number;
  reactions: string[];
};

export type Thread = {
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
  member: User | null;
  reactions: Reactions[];
  thread?: Thread;
  updatedAt?: number;
}
