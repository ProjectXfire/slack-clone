"use client";

import { Button, EmojiPopover, Hint } from "@/shared/components";
import styles from "./Styles.module.css";
import { MessageSquareText, Pencil, Smile, Trash } from "lucide-react";

interface Props {
  isAuthor?: boolean;
  isPending?: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReactions: (value: string) => void;
  hideThreadButton?: boolean;
}

function MessageToolbar({
  isAuthor,
  isPending,
  handleDelete,
  handleEdit,
  handleReactions,
  handleThread,
  hideThreadButton,
}: Props): JSX.Element {
  return (
    <div className={styles.container}>
      <EmojiPopover hint="Add reaction" onEmojiSelect={handleReactions}>
        <Button
          className={styles["icon-button"]}
          variant="ghost"
          type="button"
          name="toolbar-smile"
          disabled={isPending}
          size="sm"
        >
          <Smile />
        </Button>
      </EmojiPopover>
      {!hideThreadButton && (
        <Hint label="Reply in thread">
          <Button
            className={styles["icon-button"]}
            variant="ghost"
            type="button"
            name="toolbar-thread"
            disabled={isPending}
            size="sm"
            onClick={handleThread}
          >
            <MessageSquareText />
          </Button>
        </Hint>
      )}
      {isAuthor && (
        <>
          <Hint label="Edit message">
            <Button
              className={styles["icon-button"]}
              variant="ghost"
              type="button"
              name="toolbar-edit"
              disabled={isPending}
              size="sm"
              onClick={handleEdit}
            >
              <Pencil />
            </Button>
          </Hint>
          <Hint label="Delete message">
            <Button
              className={styles["icon-button"]}
              variant="ghost"
              type="button"
              name="toolbar-trash"
              disabled={isPending}
              size="sm"
              onClick={handleDelete}
            >
              <Trash />
            </Button>
          </Hint>
        </>
      )}
    </div>
  );
}
export default MessageToolbar;
