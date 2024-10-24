"use client";

import { useState } from "react";
import { useCurrentMember } from "@/core/members/services";
import { useGetMessage } from "@/core/messages/services";
import { useWorkspaceId } from "../../_hooks";
import styles from "./Styles.module.css";
import { AlertCircle, X } from "lucide-react";
import { Button, CustomAlert, Separator } from "@/shared/components";
import MemberMessage from "../message/MemberMessage";
import StartingLoader from "../loader/StartingLoader";

interface Props {
  messageId: string;
  onClose: () => void;
}

function Thread({ messageId, onClose }: Props): JSX.Element {
  const workspaceId = useWorkspaceId();
  const [isEditing, setIsEditing] = useState<null | string>(null);
  const { response: message } = useGetMessage(messageId);
  const { response: member } = useCurrentMember(workspaceId);

  const handleEditing = (id: string | null): void => {
    setIsEditing(id);
  };

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
      </div>
    </div>
  );
}
export default Thread;
