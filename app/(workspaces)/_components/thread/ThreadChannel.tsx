"use client";

import { useGetChannel } from "@/core/channels/services";
import { useGetMessage, useGetMessages } from "@/core/messages/services";
import { useCurrentMember } from "@/core/members/services";
import { useChannelId, useWorkspaceId } from "../../_hooks";
import MessageList from "../message-list/MessageList";
import MemberMessage from "../message/MemberMessage";
import StartingLoader from "../loader/StartingLoader";
import { useState } from "react";
import ChatInput from "../chat-input/ChatInput";
import WorkspaceContentError from "../content-error/WorkspaceContentError";

interface Props {
  messageId: string;
}

function ThreadChannel({ messageId }: Props): JSX.Element {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [isEditing, setIsEditing] = useState<null | string>(null);
  const { resp: channel } = useGetChannel(channelId);
  const { response: member } = useCurrentMember(workspaceId);
  const { response: message } = useGetMessage(messageId);
  const {
    results: threadMessages,
    status,
    loadMore,
  } = useGetMessages({ channelId, parentMessageId: messageId });

  const handleEditing = (id: string | null): void => {
    setIsEditing(id);
  };

  if (
    message === undefined ||
    member === undefined ||
    status === "LoadingFirstPage" ||
    channel === undefined
  )
    return <StartingLoader reduceHeightIn={40} />;

  if (message.isError || member.isError || channel.isError)
    return <WorkspaceContentError description="Something went wrong!" reduceHeightIn={50} />;

  return (
    <>
      <MessageList
        channelName={channel.data!.name}
        channelCreationTime={channel.data!._creationTime}
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
      <ChatInput placeholder="Reply..." channelId={channelId} parentMessageId={messageId} />
    </>
  );
}
export default ThreadChannel;
