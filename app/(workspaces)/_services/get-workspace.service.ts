import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGetOneWorkspace(workspaceId: string) {
  const data = useQuery(api.workspaces.getOne, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
}