import type { Id } from "@/convex/_generated/dataModel";

export interface Members {
  _id: Id<"members">;
  _creationTime: number;
  userId: Id<"users">;
  workspaceId: Id<"workspaces">;
  role: "admin" | "member";
}
