import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useCurrentMember(workspaceId: string) {
  const response = useQuery(api.members.current, { workspaceId });

  const isLoading = response === undefined;

  return { response, isLoading };
}
