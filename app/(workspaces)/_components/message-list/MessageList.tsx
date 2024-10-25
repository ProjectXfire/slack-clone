"use client";

import type { Message } from "@/core/messages/models";
import { useEffect, useState } from "react";
import { differenceInMinutes } from "date-fns";
import MemberMessage from "../message/MemberMessage";
import { useCurrentMember } from "@/core/members/services";
import { messsagesByDate } from "@/core/messages/mappers";
import { useWorkspaceId } from "../../_hooks";
import { useInfiniteScrollObserver } from "@/shared/hooks";
import { formatDateLabel } from "@/shared/utils";
import styles from "./Styles.module.css";
import { Loader, SeparatorLabel } from "@/shared/components";
import ChannelHero from "../channel-hero/ChannelHero";
import ConversationHero from "../conversation-hero/ConversationHero";

interface Props {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  conversationId?: string;
  data: Message[];
  loadMore: () => void;
  isLoadingMore?: boolean;
  canLoadMore?: boolean;
  variant?: "channel" | "thread" | "conversation";
  ThreadHeader?: React.ReactNode;
}

const TIME_THRESHOLD = 5;

function MessageList({
  channelName,
  channelCreationTime,
  data,
  loadMore,
  isLoadingMore,
  variant = "channel",
  canLoadMore,
  memberImage,
  memberName,
  conversationId,
  ThreadHeader,
}: Props): JSX.Element {
  const [isEditing, setIsEditing] = useState<null | string>(null);
  const { refTarget, isIntersected } = useInfiniteScrollObserver();
  const messagesGrouped = messsagesByDate(data);
  const workspaceId = useWorkspaceId();
  const { response } = useCurrentMember(workspaceId);

  const handleEditing = (id: string | null): void => {
    setIsEditing(id);
  };

  useEffect(() => {
    if (isIntersected && canLoadMore) {
      loadMore();
    }
  }, [isIntersected, canLoadMore]);

  return (
    <ul className={styles.container}>
      {Object.entries(messagesGrouped).map(([key, messages]) => (
        <li key={key}>
          <SeparatorLabel label={formatDateLabel(key)} />
          {messages.map((msg, i) => {
            const prevMessage = messages[i - 1];
            const isCompact =
              prevMessage &&
              prevMessage.member?._id === msg.member?._id &&
              differenceInMinutes(
                new Date(msg._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;
            return (
              <MemberMessage
                key={msg._id}
                id={msg._id}
                memberId={msg.memberId}
                conversationId={conversationId}
                authorName={msg.member?.name}
                authorImage={msg.member?.image}
                reactions={msg.reactions}
                thread={msg.thread}
                body={msg.body}
                image={msg.image}
                createdAt={msg._creationTime}
                updatedAt={msg.updatedAt}
                setEditingId={handleEditing}
                isAuthor={msg.memberId === response?.data?._id}
                isEditing={isEditing === msg._id}
                isCompact={isCompact}
                hideThreadButton={variant === "thread"}
              />
            );
          })}
        </li>
      ))}
      {isLoadingMore && (
        <div className={styles["loader-container"]}>
          <Loader size={25} />
        </div>
      )}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
      {variant === "conversation" && memberName && (
        <ConversationHero name={memberName} image={memberImage} />
      )}
      {variant === "thread" && ThreadHeader && ThreadHeader}
      <div ref={refTarget} />
    </ul>
  );
}
export default MessageList;
