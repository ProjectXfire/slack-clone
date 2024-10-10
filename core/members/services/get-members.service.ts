import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useGetMembers(workspaceId: string) {
  const response = useQuery(api.members.get, { workspaceId });

  return { response };
}
