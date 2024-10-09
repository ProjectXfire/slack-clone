import type { Channel } from "../models";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useGetChannels(workspaceId: string) {
  const data = useQuery(api.channels.get, { workspaceId });
  const isLoading = data === undefined;

  const channels = data as Channel[];

  const error = typeof data === "string" ? data : null;

  return { channels, isLoading, error };
}
