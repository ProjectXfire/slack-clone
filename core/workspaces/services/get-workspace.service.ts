import type { Workspace } from "../models";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGetOneWorkspace(workspaceId: string) {
  const data = useQuery(api.workspaces.getOne, { workspaceId });
  const isLoading = data === undefined;

  const workspace = data as Workspace | null;

  const error = typeof data === "string" ? data : null;

  return { workspace, isLoading, error };
}

export function useGetWorkspaceInfo(workspaceId: string) {
  const data = useQuery(api.workspaces.getInfo, { workspaceId });
  const isLoading = data === undefined;

  const workspaceInfo = data as { name: string; isMember: boolean } | null;

  const error = typeof data === "string" ? data : null;

  return { workspaceInfo, isLoading, error };
}
