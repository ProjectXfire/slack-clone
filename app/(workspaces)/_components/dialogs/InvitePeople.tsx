"use client";

import React from "react";
import { Copy, RefreshCcw } from "lucide-react";
import { useToast } from "@/shared/hooks";
import { useInvitePeopleWorkspaceModal } from "../../_stores";
import styles from "./Dialog.module.css";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  useConfirm,
} from "@/shared/components";
import { useUpdateWorkspaceCode } from "@/core/workspaces/services";

function ConfirmAction(): JSX.Element {
  const { toast } = useToast();
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "This will deactive the current invite code and generate a new one",
  });
  const [state, setState] = useInvitePeopleWorkspaceModal();
  const { mutate, isPending } = useUpdateWorkspaceCode();

  const onOpenChange = (): void => {
    setState({ isOpen: false, joinCode: "", workspaceName: "", workspaceId: "" });
  };

  const onNewCode = async (): Promise<void> => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { workspaceId: state.workspaceId },
      {
        onError: () => {
          toast({
            variant: "destructive",
            description: "Failed to generate new code",
            duration: 2000,
            style: { fontWeight: "bold" },
          });
        },
        onSuccess: (data) => {
          setState((cv) => ({ ...cv, joinCode: data }));
          toast({
            description: "Invite code regenerated",
            duration: 2000,
            style: { fontWeight: "bold" },
          });
        },
      }
    );
  };

  const handleCopy = (): void => {
    const inviteLink = `${window.location.origin}/join/${state.workspaceId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast({
        variant: "default",
        description: "Link copied",
        duration: 2000,
      });
    });
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={state.isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to {state.workspaceName}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className={styles["dialog-invite-people-code"]}>
            <p>{state.joinCode}</p>
            <Button
              type="button"
              name="copy-code"
              variant="ghost"
              disabled={isPending}
              onClick={handleCopy}
            >
              Copy link <Copy />
            </Button>
          </div>
          <div className={styles["dialog-invite-people-actions"]}>
            <Button
              variant="outline"
              type="button"
              name="new-code"
              disabled={isPending}
              onClick={onNewCode}
            >
              New code
              <RefreshCcw />
            </Button>
            <Button type="button" name="close-invite" disabled={isPending} onClick={onOpenChange}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default ConfirmAction;
