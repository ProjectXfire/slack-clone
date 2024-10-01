import type { Workspace } from "../_models";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGetWorkspaces() {
  const data = useQuery(api.workspaces.get);
  const isLoading = data === undefined;

  const workspaces = data as Workspace[] | null;

  const error = typeof data === "string" ? data : "";

  return { workspaces, isLoading, error };
}
