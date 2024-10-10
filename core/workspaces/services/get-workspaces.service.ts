import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useGetWorkspaces() {
  const response = useQuery(api.workspaces.get);

  return { response };
}
