import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGetOneWorkspace(workspaceId: string) {
  const response = useQuery(api.workspaces.getOne, { workspaceId });
  return { response };
}

export function useGetWorkspaceInfo(workspaceId: string) {
  const data = useQuery(api.workspaces.getInfo, { workspaceId });
  const isLoading = data === undefined;

  const workspaceInfo = data as { name: string; isMember: boolean } | null;

  const error = typeof data === "string" ? data : null;

  return { workspaceInfo, isLoading, error };
}
