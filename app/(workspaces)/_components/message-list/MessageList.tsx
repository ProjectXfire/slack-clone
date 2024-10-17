"use client";

import type { Message } from "@/core/messages/models";
import styles from "./Styles.module.css";
import { messsagesByDate } from "@/core/messages/mappers";
import { formatDateLabel } from "@/shared/utils";
import { FlexSpacer, SeparatorLabel } from "@/shared/components";
import MemberMessage from "../message/MemberMessage";
import { differenceInMinutes } from "date-fns";

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
}: Props): JSX.Element {
  const messagesGrouped = messsagesByDate(data);

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
                authorName={msg.member?.name}
                authorImage={msg.member?.image}
                reactions={msg.reactions}
                thread={msg.thread}
                body={msg.body}
                image={msg.image}
                createdAt={msg._creationTime}
                updatedAt={msg.updatedAt}
                setEditingId={() => {}}
                isAuthor={false}
                isEditing={false}
                isCompact={isCompact}
                hideThreadButton={false}
              />
            );
          })}
        </li>
      ))}
    </ul>
  );
}
export default MessageList;
