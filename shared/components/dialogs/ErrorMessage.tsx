"use client";

import { useErrorMessageModal } from "@/shared/stores";
import styles from "./Dialogs.module.css";
import { Trash } from "lucide-react";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Separator } from "../ui/Separator";

function ErrorMessage() {
  const [state, setState] = useErrorMessageModal();

  const onOpenChange = (value: boolean): void => {
    setState({ isOpen: value, message: "" });
  };

  const onClick = (): void => {};

  return (
    <Dialog open={state.isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>{state.message}</DialogDescription>
        </DialogHeader>
        <Separator />
        <Button
          className={styles["confirm-action-button"]}
          variant="destructive"
          type="button"
          name="error"
          onClick={onClick}
        >
          <Trash />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
export default ErrorMessage;
