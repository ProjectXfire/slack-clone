"use client";

import { useChannelId } from "../../_hooks";
import styles from "./Styles.module.css";
import { X } from "lucide-react";
import { Button, Separator } from "@/shared/components";
import ThreadChannel from "./ThreadChannel";
import ThreadConversation from "./ThreadConversation";
import MessagesContent from "../containers/MessagesContent";

interface Props {
  messageId: string;
  conversationId?: string;
  onClose: () => void;
}

function Thread({ messageId, conversationId, onClose }: Props): JSX.Element {
  const channelId = useChannelId();

  return (
    <MessagesContent>
      <div className={styles["thread-header"]}>
        <div className={styles["thread-header__content"]}>
          <p>Thread</p>
          <Button variant="ghost" type="button" name="close-thread" onClick={onClose}>
            <X />
          </Button>
        </div>
        <Separator />
      </div>
      {channelId ? (
        <ThreadChannel messageId={messageId} />
      ) : (
        <ThreadConversation messageId={messageId} conversationId={conversationId ?? ""} />
      )}
    </MessagesContent>
  );
}
export default Thread;
