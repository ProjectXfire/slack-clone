"use client";

import styles from "./Styles.module.css";
import { FaChevronDown } from "react-icons/fa";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Separator,
} from "@/shared/components";
import { Trash } from "lucide-react";
import { useChannelHeader } from "./useChannelHeader";

interface Props {
  title: string;
  channelId: string;
  workspaceId: string;
}

function ChannelHeader({ title, channelId, workspaceId }: Props): JSX.Element {
  const {
    response: member,
    isEditing,
    channelName,
    ConfirmComponent,
    isPendingRemove,
    isPendingUpdate,
    handleEditing,
    onChangeChannelName,
    onUpdateName,
    onDeleteChannel,
  } = useChannelHeader({ channelId, workspaceId, title });

  return (
    <>
      <ConfirmComponent />
      <div className={styles.container}>
        {member?.data?.role === "admin" ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className={styles["channel-button"]}
                type="button"
                name="channel"
                variant="ghost"
              >
                # {title} <FaChevronDown />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle># {title}</DialogTitle>
                <DialogDescription>Channel settings</DialogDescription>
              </DialogHeader>
              <div className={styles["dialog-channel-item"]}>
                <div className={styles["dialog-channel-item__block"]}>
                  <p>Channel name</p>
                  <p className={styles["dialog-channel-item__block-edit"]} onClick={handleEditing}>
                    {isEditing ? "Cancel" : "Edit"}
                  </p>
                </div>
                <div className={styles["dialog-channel-item__block"]}>
                  {isEditing ? (
                    <form className={styles["dialog-channel-item__block-form"]}>
                      <Input value={channelName} onChange={onChangeChannelName} />
                      <Button
                        type="button"
                        name="update-workspace"
                        disabled={isPendingUpdate || isPendingRemove}
                        onClick={onUpdateName}
                      >
                        Save
                      </Button>
                    </form>
                  ) : (
                    <p className={styles["dialog-channel-item__block--name"]}>{title}</p>
                  )}
                </div>
              </div>
              <Button
                className={styles["dialog-channel-remove"]}
                variant="destructive"
                type="button"
                name="delete-channel"
                disabled={isPendingUpdate || isPendingRemove}
                onClick={onDeleteChannel}
              >
                <Trash /> Delete workspace
              </Button>
            </DialogContent>
          </Dialog>
        ) : (
          <div className={styles["channel-title"]}># {title}</div>
        )}
      </div>
      <Separator />
    </>
  );
}
export default ChannelHeader;
