"use client";

import { useState } from "react";
import { useChannelId, useWorkspaceId } from "../../_hooks";
import { useCurrentMember } from "@/core/members/services";
import { useGetMessage, useGetMessages } from "@/core/messages/services";
import StartingLoader from "../loader/StartingLoader";
import WorkspaceContentError from "../content-error/WorkspaceContentError";
import MessageList from "../message-list/MessageList";
import MemberMessage from "../message/MemberMessage";
import ChatInput from "../chat-input/ChatInput";

interface Props {
  messageId: string;
  conversationId: string;
}

function ThreadConversation({ messageId, conversationId }: Props): JSX.Element {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [isEditing, setIsEditing] = useState<null | string>(null);
  const { response: member } = useCurrentMember(workspaceId);
  const { response: message } = useGetMessage(messageId);
  const {
    results: threadMessages,
    status,
    loadMore,
  } = useGetMessages({ channelId, parentMessageId: messageId, conversationId });

  const handleEditing = (id: string | null): void => {
    setIsEditing(id);
  };

  if (message === undefined || member === undefined || status === "LoadingFirstPage")
    return <StartingLoader reduceHeightIn={40} />;

  if (message.isError || member.isError)
    return <WorkspaceContentError description="Something went wrong!" reduceHeightIn={50} />;

  return (
    <>
      <MessageList
        data={threadMessages}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        variant="thread"
        ThreadHeader={
          <MemberMessage
            id={message.data!._id}
            memberId={message.data!.memberId}
            authorImage={message.data!.member?.image}
            authorName={message.data!.member?.name}
            isAuthor={member.data!._id === message.data!.memberId}
            body={message.data!.body}
            image={message.data!.image}
            reactions={message.data!.reactions}
            createdAt={message.data!._creationTime}
            updatedAt={message.data!.updatedAt}
            hideThreadButton
            isEditing={isEditing === messageId}
            setEditingId={handleEditing}
          />
        }
      />
      <ChatInput
        placeholder="Reply..."
        conversationId={conversationId}
        parentMessageId={messageId}
      />
    </>
  );
}
export default ThreadConversation;
