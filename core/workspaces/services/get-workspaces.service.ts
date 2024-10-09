import type { Workspace } from "../models";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGetWorkspaces() {
  const data = useQuery(api.workspaces.get);
  const isLoading = data === undefined;

  const workspaces = data as Workspace[];

  const error = typeof data === "string" ? data : null;

  return { workspaces, isLoading, error };
}
