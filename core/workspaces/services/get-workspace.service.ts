import type { Workspace } from "../models";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGetOneWorkspace(workspaceId: string) {
  const data = useQuery(api.workspaces.getOne, { workspaceId });
  const isLoading = data === undefined;

  const workspace = data as Workspace | null;

  const error = typeof data === "string" ? data : "";

  return { workspace, isLoading, error };
}
