"use client";

import React from "react";
import { Trash } from "lucide-react";
import styles from "./Styles.module.css";
import {
  Button,
  ConfirmAction,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Separator,
} from "@/shared/components";
import { useWorkspacePreference } from "./useWorkspacePreference";

function WorkspacePreference(): JSX.Element {
  const {
    state,
    isPendingRemove,
    isPendingUpdate,
    openConfirmModal,
    isEditing,
    workspaceName,
    onOpenChange,
    handleEditing,
    setOpenConfirmModal,
    onOpenConfirm,
    onRemove,
    onUpdateName,
    onChangeWorkspaceName,
  } = useWorkspacePreference();

  return (
    <>
      <ConfirmAction
        isOpen={openConfirmModal}
        title="Delete workspace"
        description={`Are you sure to delete the workspace ${state.initValue}`}
        onOpenChange={(value) => setOpenConfirmModal(value)}
        disabled={isPendingUpdate || isPendingRemove}
        onClick={onRemove}
      />
      <Dialog open={state.isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{state.initValue}</DialogTitle>
            <DialogDescription>Workspace preferences</DialogDescription>
          </DialogHeader>
          <Separator />
          <div className={styles["dialog-preference-item"]}>
            <div className={styles["dialog-preference-item__block"]}>
              <p>Workspace name</p>
              <p className={styles["dialog-preference-item__block-edit"]} onClick={handleEditing}>
                {isEditing ? "Cancel" : "Edit"}
              </p>
            </div>
            <div className={styles["dialog-preference-item__block"]}>
              {isEditing ? (
                <form className={styles["dialog-preference-item__block-form"]}>
                  <Input value={workspaceName} onChange={onChangeWorkspaceName} />
                  <Button
                    type="button"
                    name="update-workspace"
                    onClick={onUpdateName}
                    disabled={isPendingUpdate || isPendingRemove}
                  >
                    Save
                  </Button>
                </form>
              ) : (
                <p className={styles["dialog-preference-item__block--name"]}>{state.initValue}</p>
              )}
            </div>
          </div>
          <Button
            className={styles["dialog-preference-remove"]}
            variant="destructive"
            type="button"
            name="delete-workspace"
            disabled={isPendingUpdate || isPendingRemove}
            onClick={onOpenConfirm}
          >
            <Trash /> Delete workspace
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default WorkspacePreference;
