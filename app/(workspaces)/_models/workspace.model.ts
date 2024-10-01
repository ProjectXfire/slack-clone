import type { Id } from "@/convex/_generated/dataModel";

export interface Workspace {
  _id: Id<"workspaces">;
  _creationTime: number;
  name: string;
  userId: Id<"users">;
  joinCode: string;
}
