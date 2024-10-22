"use client";

import type { Reactions, Thread } from "@/core/messages/models";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import {
  useDeleteMessage,
  useToggleReactMessage,
  useUpdateMessage,
} from "@/core/messages/services";
import { useToast } from "@/shared/hooks";
import { formatFullTime, formatName } from "@/shared/utils";
import styles from "./Styles.module.css";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Hint,
  Thumbnail,
  useConfirm,
} from "@/shared/components";
import MessageToolbar from "../message-toolbar/MessageToolbar";
import ReactedIcons from "../reacted-icons/ReactedIcons";

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
  setEditingId: (id: string | null) => void;
  isAuthor?: boolean;
  isEditing?: boolean;
  isCompact?: boolean;
  hideThreadButton?: boolean;
}

const RenderText = dynamic(() => import("../render-text/RenderText"), { ssr: false });
const Editor = dynamic(() => import("@/shared/components/editor/Editor"));

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
  const { toast } = useToast();
  const { mutate: updateMessage, isPending: isPendingUpdateMessage } = useUpdateMessage();
  const { mutate: deleteMessage, isPending: isPendingDeleteMessage } = useDeleteMessage();
  const { mutate: toggleMessageReaction, isPending: isPendingReaction } = useToggleReactMessage();
  const [ConfirmComponent, confirm] = useConfirm({
    title: "Message",
    message: "Are you sure to delete it?, this action cannot be undone.",
  });

  const isPending = isPendingUpdateMessage || isPendingDeleteMessage || isPendingReaction;

  const handleUpdateMessage = (body: string): void => {
    updateMessage(
      { id, body },
      {
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Message",
            description: err,
            duration: 3000,
          });
        },
        onSuccess: ({ message }) => {
          toast({
            title: "Message",
            description: message,
            duration: 3000,
          });
          setEditingId(null);
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleMessageReaction(
      { value, messageId: id },
      {
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Message",
            description: err,
            duration: 3000,
          });
        },
      }
    );
  };

  const handleDeleteMessage = async (): Promise<void> => {
    const ok = await confirm();
    if (!ok) return;
    deleteMessage(
      { id },
      {
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Message",
            description: err,
            duration: 3000,
          });
        },
        onSuccess: ({ message }) => {
          toast({
            title: "Message",
            description: message,
            duration: 3000,
          });
        },
      }
    );
  };

  if (isCompact)
    return (
      <div
        className={`${styles.message} ${isEditing ? styles["message-editing"] : styles["message-no-editing"]} ${isPendingDeleteMessage && styles["message-removing"]}`}
      >
        <div className={styles["message-time"]}>
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className={styles["message-time-button"]} type="button" name="time">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          {isEditing ? (
            <div className={styles["editor-container"]}>
              <Editor
                defaultValue={JSON.parse(body)}
                disabled={isPending}
                variant="update"
                onCancel={() => setEditingId(null)}
                onSubmit={(values) => handleUpdateMessage(values.body)}
              />
            </div>
          ) : (
            <div className={styles["message-text-block"]}>
              <RenderText text={body} />
              {image && <Thumbnail url={image} />}
              <ReactedIcons reactions={reactions} memberId={memberId} onChange={handleReaction} />
              {updatedAt && <span className={styles["message-edited"]}>(edited)</span>}
            </div>
          )}
        </div>
        <div className={styles["message-toolbar-container"]}>
          <ConfirmComponent />
          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isEditing}
              hideThreadButton={hideThreadButton}
              handleDelete={handleDeleteMessage}
              handleThread={() => {}}
              handleEdit={() => setEditingId(id)}
              handleReactions={handleReaction}
            />
          )}
        </div>
      </div>
    );

  return (
    <div
      className={`${styles.message} ${isEditing ? styles["message-editing"] : styles["message-no-editing"]} ${isPendingDeleteMessage && styles["message-removing"]}`}
    >
      <div className={styles["message-user"]}>
        <button className={styles["message-user-button"]} type="button" name="message-user">
          <Avatar className={styles["message-user-avatar"]}>
            <AvatarImage src={authorImage} />
            <AvatarFallback>
              <p className={styles["message-user-fallback"]}>{formatName(authorName ?? "")}</p>
            </AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className={styles["editor-container"]}>
            <Editor
              defaultValue={JSON.parse(body)}
              disabled={isPending}
              variant="update"
              onCancel={() => setEditingId(null)}
              onSubmit={(values) => handleUpdateMessage(values.body)}
            />
          </div>
        ) : (
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
            <div className={styles["message-text-block"]}>
              <RenderText text={body} />
              {image && <Thumbnail url={image} />}
              <ReactedIcons reactions={reactions} memberId={memberId} onChange={handleReaction} />
              {updatedAt && <span className={styles["message-edited"]}>(edited)</span>}
            </div>
          </div>
        )}
      </div>
      <div className={styles["message-toolbar-container"]}>
        <ConfirmComponent />
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isEditing}
            hideThreadButton={hideThreadButton}
            handleDelete={handleDeleteMessage}
            handleThread={() => {}}
            handleEdit={() => setEditingId(id)}
            handleReactions={handleReaction}
          />
        )}
      </div>
    </div>
  );
}
export default MemberMessage;
