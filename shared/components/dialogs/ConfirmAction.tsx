"use client";

import styles from "./Dialogs.module.css";
import { Trash } from "lucide-react";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Separator } from "../ui/Separator";

interface Props {
  title: string;
  description?: string;
  isOpen: boolean;
  disabled?: boolean;
  onOpenChange?: (value: boolean) => void;
  onClick?: () => void;
}

function ConfirmAction({
  isOpen,
  title,
  description,
  onOpenChange,
  disabled,
  onClick,
}: Props): JSX.Element {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Separator />
        <Button
          className={styles["confirm-action-button"]}
          variant="destructive"
          type="button"
          name="delete-workspace"
          disabled={disabled}
          onClick={onClick}
        >
          <Trash /> Confirm delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
export default ConfirmAction;
