import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";

interface Options {
  channelId?: string;
  conversationId?: string;
  parentMessageId?: string;
}

const BATCH_SIZE = 3;

export function useGetMessages({ channelId, conversationId, parentMessageId }: Options) {
  const { results, isLoading, loadMore, status } = usePaginatedQuery(
    api.messages.get,
    {
      channelId,
      conversationId,
      parentMessageId,
    },
    { initialNumItems: BATCH_SIZE }
  );

  return { results, isLoading, loadMore: () => loadMore(BATCH_SIZE), status };
}
