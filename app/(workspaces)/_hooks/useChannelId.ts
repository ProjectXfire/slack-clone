import { useParams } from "next/navigation";

type Params = { channelId: string };

export function useChannelId() {
  const params = useParams<Params>();

  return params.channelId as string;
}
