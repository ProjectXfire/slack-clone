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

type EdtiorValue = {
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
  onSubmit: (values: EdtiorValue) => void;
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
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  const toggleToolbar = (): void => {
    setIsToolbarVisible((cv) => !cv);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) toolbarElement.classList.toggle("hidden");
  };

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(container.ownerDocument.createElement("div"));
    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                return;
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };
    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();
    if (innerRef) innerRef.current = quill;
    quill.setContents(defaultValueRef.current);
    setText(quill.getText());
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });
    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) container.innerHTML = "";
      if (quillRef.current) quillRef.current = null;
      if (innerRef) innerRef.current = null;
    };
  }, []);

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
          <Hint label="Emoji">
            <Button type="button" variant="ghost">
              <Smile />
            </Button>
          </Hint>
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
      <p className={styles["editor-footer"]}>
        <strong>Shift + Return</strong> to add a new line
      </p>
    </div>
  );
}
export default Editor;
