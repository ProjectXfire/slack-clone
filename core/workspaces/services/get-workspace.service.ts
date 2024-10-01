import type { Workspace } from "../models";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useGetOneWorkspace(workspaceId: Id<"workspaces">) {
  const data = useQuery(api.workspaces.getOne, { workspaceId });
  const isLoading = data === undefined;

  const workspace = data as Workspace | null;

  const error = typeof data === "string" ? data : "";

  return { workspace, isLoading, error };
}
