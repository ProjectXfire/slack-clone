import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useGetChannels(workspaceId: string) {
  const response = useQuery(api.channels.get, { workspaceId });

  return { response };
}
