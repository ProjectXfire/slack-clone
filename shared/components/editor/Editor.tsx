"use client";

import { MutableRefObject } from "react";
import NextImage from "next/image";
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

export type EditorValue = {
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
  const {
    containerRef,
    disabledRef,
    inputImageRef,
    isEmpty,
    isToolbarVisible,
    image,
    toggleToolbar,
    onEmojiSelect,
    onSelectImage,
    onOpenImageSelection,
    onRemoveImage,
    handleSubmit,
  } = useEditor({
    onSubmit,
    defaultValue,
    disabled,
    innerRef,
    placeholder,
  });

  return (
    <div className={styles.container}>
      <form
        className={`${styles["editor-container"]} ${disabled && styles["editor-container--disable"]}`}
      >
        <div ref={containerRef} />
        {image && (
          <div className={styles["editor-image-container"]}>
            <NextImage
              className={styles["editor-image"]}
              src={URL.createObjectURL(image)}
              fill
              alt="image"
            />
            <Hint label="Remove image">
              <button
                className={styles["editor-image-close"]}
                type="button"
                name="remove-image"
                onClick={onRemoveImage}
              >
                <X />
              </button>
            </Hint>
          </div>
        )}
        <div className={styles["editor-actions"]}>
          <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
            <Button type="button" variant="ghost" disabled={disabled} onClick={toggleToolbar}>
              <PiTextAa />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect}>
            <Button type="button" variant="ghost" disabled={disabled}>
              <Smile />
            </Button>
          </EmojiPopover>
          {variant === "create" && (
            <>
              <input
                accept="image/*"
                ref={inputImageRef}
                className={styles["editor-input-hide"]}
                type="file"
                disabled={disabled}
                onChange={onSelectImage}
              />
              <Hint label="Image">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={disabled}
                  onClick={onOpenImageSelection}
                >
                  <ImageIcon />
                </Button>
              </Hint>
            </>
          )}
          <FlexSpacer />
          {variant === "update" && (
            <>
              <Button
                type="button"
                name="close-editor"
                variant="outline"
                disabled={disabled}
                onClick={onCancel}
              >
                <X />
              </Button>
              <Button
                type="button"
                name="update-editor"
                disabled={disabled || isEmpty}
                onClick={handleSubmit}
              >
                <Save />
              </Button>
            </>
          )}
          {variant === "create" && (
            <Button
              type="button"
              name="create-editor"
              disabled={disabledRef.current || isEmpty}
              onClick={handleSubmit}
            >
              <Send />
            </Button>
          )}
        </div>
      </form>
      <p className={`${styles["editor-footer"]} ${isEmpty && styles["editor-footer--hide"]}`}>
        <strong>Shift + Return</strong> to add a new line
      </p>
    </div>
  );
}
export default Editor;
