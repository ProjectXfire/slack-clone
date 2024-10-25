import { Id } from "@/convex/_generated/dataModel";

export interface Conversation {
  _id: Id<"conversations">;
  _creationTime: number;
  workspaceId: Id<"workspaces">;
  memberOneId: Id<"members">;
  memberTwoId: Id<"members">;
}
