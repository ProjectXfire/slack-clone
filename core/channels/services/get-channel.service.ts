import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useGetChannel(channelId: string) {
  const resp = useQuery(api.channels.getOne, { channelId });
  return { resp };
}
