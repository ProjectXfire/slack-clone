"use client";

import type { QuillOptions } from "quill";
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { Delta, Op } from "quill/core";
import styles from "./Styles.module.css";
import { PiTextAa } from "react-icons/pi";
import { Button } from "../ui/Button";
import { ImageIcon, Send, Smile, Save, X } from "lucide-react";
import Hint from "../hint/Hint";
import FlexSpacer from "../spacer/FlexSpacer";
import { useEditor } from "./useEditor";
import EmojiPopover from "../emoji-popover/EmojiPopover";

type EditorValue = {
  image: File | null;
  body: string;
};

interface Props {
  variant?: "create" | "update";
  placeholder?: string;
  onCancel?: () => void;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  onSubmit: (values: EditorValue) => void;
}

function Editor({
  variant = "create",
  defaultValue = [],
  disabled = false,
  placeholder = "Write something...",
  innerRef,
  onSubmit,
  onCancel,
}: Props): JSX.Element {
  const { containerRef, disabledRef, isEmpty, isToolbarVisible, toggleToolbar, onEmojiSelect } =
    useEditor({
      onSubmit,
      defaultValue,
      disabled,
      innerRef,
      placeholder,
    });

  return (
    <div className={styles.container}>
      <div className={styles["editor-container"]}>
        <div ref={containerRef} />
        <div className={styles["editor-actions"]}>
          <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
            <Button type="button" variant="ghost" disabled={disabled} onClick={toggleToolbar}>
              <PiTextAa />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button type="button" variant="ghost">
              <Smile />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <Hint label="Image">
              <Button type="button" variant="ghost">
                <ImageIcon />
              </Button>
            </Hint>
          )}
          <FlexSpacer />
          {variant === "update" && (
            <>
              <Button type="button" name="close-editor" variant="outline" disabled={disabled}>
                <X />
              </Button>
              <Button type="button" name="update-editor" disabled={disabled || isEmpty}>
                <Save />
              </Button>
            </>
          )}
          {variant === "create" && (
            <Button type="button" name="create-editor" disabled={disabledRef.current || isEmpty}>
              <Send />
            </Button>
          )}
        </div>
      </div>
      <p className={`${styles["editor-footer"]} ${isEmpty && styles["editor-footer--hide"]}`}>
        <strong>Shift + Return</strong> to add a new line
      </p>
    </div>
  );
}
export default Editor;
