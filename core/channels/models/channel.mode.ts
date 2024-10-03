import type { Id } from "@/convex/_generated/dataModel";

export interface Channel {
  _id: Id<"channels">;
  _creationTime: number;
  name: string;
  workspaceId: Id<"workspaces">;
}
