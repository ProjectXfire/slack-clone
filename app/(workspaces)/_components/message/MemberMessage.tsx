"use client";

import type { Reactions, Thread } from "@/core/messages/models";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { formatFullTime, formatName } from "@/shared/utils";
import { useMemberMessage } from "./useMemberMessage";
import styles from "./Styles.module.css";
import { Avatar, AvatarFallback, AvatarImage, Hint, Thumbnail } from "@/shared/components";
import MessageToolbar from "../message-toolbar/MessageToolbar";
import ReactedIcons from "../reacted-icons/ReactedIcons";

interface Props {
  id: string;
  memberId: string;
  conversationId?: string;
  authorImage?: string;
  authorName?: string;
  reactions: Reactions[];
  thread?: Thread;
  body: string;
  image?: string | null;
  createdAt: number;
  updatedAt?: number;
  setEditingId: (id: string | null) => void;
  isAuthor?: boolean;
  isEditing?: boolean;
  isCompact?: boolean;
  hideThreadButton?: boolean;
}

const RenderText = dynamic(() => import("../render-text/RenderText"), { ssr: false });
const Editor = dynamic(() => import("@/shared/components/editor/Editor"), { ssr: false });

function MemberMessage({
  id,
  memberId,
  conversationId,
  authorName,
  authorImage,
  body,
  createdAt,
  reactions,
  setEditingId,
  hideThreadButton,
  image,
  isAuthor,
  isCompact,
  isEditing,
  updatedAt,
}: Props): JSX.Element {
  const {
    isPending,
    isPendingDeleteMessage,
    ConfirmComponent,
    handleDeleteMessage,
    handleReaction,
    handleUpdateMessage,
    handleThread,
  } = useMemberMessage({ id, setEditingId, conversationId });

  if (isCompact)
    return (
      <div
        className={`${styles.message} ${isEditing && styles["message--editing"]} ${isPendingDeleteMessage && styles["message--remove"]}`}
      >
        <div className={styles["message-compact"]}>
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className={styles["message-compact__time"]} type="button" name="time">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          <div className={styles["message-compact__content"]}>
            <div className={styles["message__max-content"]}>
              {isEditing ? (
                <Editor
                  defaultValue={JSON.parse(body)}
                  disabled={isPending}
                  variant="update"
                  onCancel={() => setEditingId(null)}
                  onSubmit={(values) => handleUpdateMessage(values.body)}
                />
              ) : (
                <div className={styles["message__text"]}>
                  <RenderText text={body} />
                  {image && <Thumbnail url={image} />}
                </div>
              )}
              <ReactedIcons reactions={reactions} memberId={memberId} onChange={handleReaction} />
              {updatedAt && <span className={styles["message__edit-message"]}>(edited)</span>}
            </div>
          </div>
        </div>
        <div className={styles["message-toolbar"]}>
          <ConfirmComponent />
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isEditing}
              hideThreadButton={hideThreadButton}
              handleDelete={handleDeleteMessage}
              handleThread={handleThread}
              handleEdit={() => setEditingId(id)}
              handleReactions={handleReaction}
            />
          )}
        </div>
      </div>
    );

  return (
    <div
      className={`${styles.message} ${isEditing && styles["message--editing"]} ${isPendingDeleteMessage && styles["message--remove"]}`}
    >
      <div className={styles["message-fullname"]}>
        <Avatar className={styles["message-fullname__avatar"]}>
          <AvatarImage src={authorImage} />
          <AvatarFallback>
            <p className={styles["message-fullname__avatar"]}>{formatName(authorName ?? "")}</p>
          </AvatarFallback>
        </Avatar>
        <div className={styles["message-fullname__content"]}>
          <div className={styles["message__max-content"]}>
            {isEditing ? (
              <Editor
                defaultValue={JSON.parse(body)}
                disabled={isPending}
                variant="update"
                onCancel={() => setEditingId(null)}
                onSubmit={(values) => handleUpdateMessage(values.body)}
              />
            ) : (
              <>
                <div className={styles["message-fullname-header"]}>
                  <button className={styles["message-fullname-header__name"]} type="button">
                    {authorName}
                  </button>
                  <Hint label={formatFullTime(new Date(createdAt))}>
                    <button className={styles["message-fullname-header__time"]} type="button">
                      {format(new Date(createdAt), "h:mm a")}
                    </button>
                  </Hint>
                </div>
                <div className={styles["message__text"]}>
                  <RenderText text={body} />
                  {image && <Thumbnail url={image} />}
                </div>
              </>
            )}
            <ReactedIcons reactions={reactions} memberId={memberId} onChange={handleReaction} />
            {updatedAt && <span className={styles["message__edit-message"]}>(edited)</span>}
          </div>
        </div>
      </div>
      <div className={styles["message-toolbar"]}>
        <ConfirmComponent />
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isEditing}
            hideThreadButton={hideThreadButton}
            handleDelete={handleDeleteMessage}
            handleThread={handleThread}
            handleEdit={() => setEditingId(id)}
            handleReactions={handleReaction}
          />
        )}
      </div>
    </div>
  );
}
export default MemberMessage;
