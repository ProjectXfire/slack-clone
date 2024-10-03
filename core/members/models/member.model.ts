import type { Id } from "@/convex/_generated/dataModel";
import { User } from "@/core/auth/models";

export interface Member {
  _id: Id<"members">;
  _creationTime: number;
  userId: Id<"users">;
  workspaceId: Id<"workspaces">;
  role: "admin" | "member";
  user: User | null;
}
