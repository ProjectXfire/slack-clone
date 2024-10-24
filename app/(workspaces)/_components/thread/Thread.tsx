"use client";

import dynamic from "next/dynamic";
import { useThread } from "./useThread";
import styles from "./Styles.module.css";
import { AlertCircle, X } from "lucide-react";
import { Button, CustomAlert, Separator } from "@/shared/components";
import MemberMessage from "../message/MemberMessage";
import StartingLoader from "../loader/StartingLoader";
import MessageList from "../message-list/MessageList";

interface Props {
  messageId: string;
  onClose: () => void;
}

const Editor = dynamic(() => import("@/shared/components/editor/Editor"), { ssr: false });

function Thread({ messageId, onClose }: Props): JSX.Element {
  const {
    editorKey,
    editorRef,
    message,
    member,
    isEditing,
    isLoading,
    threadMessages,
    status,
    channel,
    loadMore,
    handleEditing,
    handleSubmit,
  } = useThread(messageId);

  if (message === undefined || member === undefined) return <StartingLoader reduceHeightIn={40} />;

  if (message.isError)
    return (
      <div className={styles["container-error"]}>
        <CustomAlert
          title="Error"
          variant="destructive"
          description={message.message}
          icon={<AlertCircle />}
        />
        <Button
          className={styles["container-error__close"]}
          variant="ghost"
          type="button"
          name="close-thread"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles["thread-header"]}>
        <div className={styles["thread-header__content"]}>
          <p>Thread</p>
          <Button variant="ghost" type="button" name="close-thread" onClick={onClose}>
            <X />
          </Button>
        </div>
        <Separator />
      </div>
      <div className={styles["thread-body"]}>
        <div className={styles["thread-body__threads"]}>
          {status === "LoadingFirstPage" || channel === undefined ? (
            <StartingLoader />
          ) : (
            <>
              <MessageList
                channelName={channel.data!.name}
                channelCreationTime={channel.data!._creationTime}
                data={threadMessages}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
                variant="thread"
              />
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
            </>
          )}
        </div>
        <Editor
          key={editorKey}
          innerRef={editorRef}
          placeholder="Reply..."
          defaultValue={[]}
          disabled={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
export default Thread;
