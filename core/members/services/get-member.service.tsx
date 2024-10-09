import type { Member } from "../models";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useCurrentMember(workspaceId: string) {
  const data = useQuery(api.members.current, { workspaceId });
  const isLoading = data === undefined;

  const member = data as Member | null;

  const error = typeof data === "string" ? data : null;

  return { member, isLoading, error };
}
