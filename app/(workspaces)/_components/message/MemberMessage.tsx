"use client";

import type { Reactions, Thread } from "@/core/messages/models";
import dynamic from "next/dynamic";
import styles from "./Styles.module.css";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage, Hint, Thumbnail } from "@/shared/components";
import { formatFullTime, formatName } from "@/shared/utils";

interface Props {
  id: string;
  memberId: string;
  authorImage?: string;
  authorName?: string;
  reactions: Reactions[];
  thread: Thread;
  body: string;
  image?: string | null;
  createdAt: number;
  updatedAt?: number;
  setEditingId: () => void;
  isAuthor?: boolean;
  isEditing?: boolean;
  isCompact?: boolean;
  hideThreadButton?: boolean;
}

const RenderText = dynamic(() => import("../render-text/RenderText"), { ssr: false });

function MemberMessage({
  id,
  memberId,
  authorName,
  authorImage,
  body,
  createdAt,
  reactions,
  setEditingId,
  thread,
  hideThreadButton,
  image,
  isAuthor,
  isCompact,
  isEditing,
  updatedAt,
}: Props): JSX.Element {
  if (isCompact)
    return (
      <div className={styles.message}>
        <div className={styles["message-time"]}>
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className={styles["message-time-button"]} type="button" name="time">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          <div>
            <RenderText text={body} />
            {image && <Thumbnail url={image} />}
            {updatedAt && <span className={styles["message-edited"]}>(edited)</span>}
          </div>
        </div>
      </div>
    );

  return (
    <div className={styles.message}>
      <div className={styles["message-user"]}>
        <button type="button" name="message-user">
          <Avatar className={styles["message-user-avatar"]}>
            <AvatarImage src={authorImage} />
            <AvatarFallback>
              <p className={styles["message-user-fallback"]}>{formatName(authorName ?? "")}</p>
            </AvatarFallback>
          </Avatar>
        </button>
        <div className={styles["message-author"]}>
          <div className={styles["message-author-actions"]}>
            <button type="button">{authorName}</button>
            <span>&nbsp;&nbsp;</span>
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className={styles["message-author-actions-time"]} type="button">
                {format(new Date(createdAt), "h:mm a")}
              </button>
            </Hint>
          </div>
          <RenderText text={body} />
          {image && <Thumbnail url={image} />}
          {updatedAt && <span className={styles["message-edited"]}>(edited)</span>}
        </div>
      </div>
    </div>
  );
}
export default MemberMessage;
