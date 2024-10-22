"use client";

import type { Message } from "@/core/messages/models";
import { differenceInMinutes } from "date-fns";
import styles from "./Styles.module.css";
import { messsagesByDate } from "@/core/messages/mappers";
import { formatDateLabel } from "@/shared/utils";
import { Loader, SeparatorLabel } from "@/shared/components";
import MemberMessage from "../message/MemberMessage";
import ChannelHero from "../channel-hero/ChannelHero";
import { useEffect, useState } from "react";
import { useCurrentMember } from "@/core/members/services";
import { useWorkspaceId } from "../../_hooks";
import { useInfiniteScrollObserver } from "@/shared/hooks";

interface Props {
  memberName?: string;
  memberImage?: string;
  channelName: string;
  channelCreationTime: number;
  data: Message[];
  loadMore: () => void;
  isLoadingMore?: boolean;
  canLoadMore?: boolean;
  variant?: "channel" | "thread" | "conversation";
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
}: Props): JSX.Element {
  const messagesGrouped = messsagesByDate(data);
  const [isEditing, setIsEditing] = useState<null | string>(null);
  const { refTarget, isIntersected } = useInfiniteScrollObserver();
  const workspaceId = useWorkspaceId();
  const { response } = useCurrentMember(workspaceId);

  const handleEditing = (id: string | null): void => {
    setIsEditing(id);
  };

  useEffect(() => {
    if (isIntersected && canLoadMore) loadMore();
  }, [isIntersected]);

  return (
    <ul className={styles.container}>
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
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
      <div ref={refTarget} />
      {isLoadingMore && (
        <div className={styles["loader-container"]}>
          <Loader size={25} />
        </div>
      )}
    </ul>
  );
}
export default MessageList;
