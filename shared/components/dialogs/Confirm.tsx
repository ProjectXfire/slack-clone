"use client";

import { useState } from "react";
import styles from "./Dialogs.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { Button } from "../ui/Button";

type Options = {
  title: string;
  message: string;
};

export function useConfirm({
  title,
  message,
}: Options): [() => JSX.Element, () => Promise<unknown>] {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = (): Promise<unknown> =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = (): void => {
    setPromise(null);
  };

  const handleCancel = (): void => {
    promise?.resolve(false);
    handleClose();
  };

  const handleConfirm = (): void => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfirmDialog = (): JSX.Element => (
    <Dialog open={promise !== null} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className={styles["confirm-action-button"]}
            variant="outline"
            type="button"
            name="cancel"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className={styles["confirm-action-button"]}
            variant="destructive"
            type="button"
            name="confirm"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
}
