import type { Members } from "../models";
import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useCurrentMember(workspaceId: Id<"workspaces">) {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;

  const member = data as Members | null;

  const error = typeof data === "string" ? data : "";

  return { member, isLoading, error };
}
