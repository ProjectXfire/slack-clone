import type { Member } from "../models";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useGetMembers(workspaceId: string) {
  const data = useQuery(api.members.get, { workspaceId });
  const isLoading = data === undefined;

  const members = data as Member[];

  const error = typeof data === "string" ? data : null;

  return { members, isLoading, error };
}
