"use client";

import type { Member } from "@/core/members/models";
import { useGetMessages } from "@/core/messages/services";
import MessageList from "../message-list/MessageList";
import StartingLoader from "../loader/StartingLoader";

interface Props {
  conversationId: string;
  member: Member;
}

function Conversation({ conversationId, member }: Props): JSX.Element {
  const { results, status, loadMore } = useGetMessages({ conversationId });

  if (status === "LoadingFirstPage") return <StartingLoader reduceHeightIn={100} />;

  return (
    <MessageList
      memberName={member.user?.name}
      memberImage={member.user?.image}
      data={results}
      loadMore={loadMore}
      isLoadingMore={status === "LoadingMore"}
      canLoadMore={status === "CanLoadMore"}
      variant="conversation"
      conversationId={conversationId}
    />
  );
}
export default Conversation;
