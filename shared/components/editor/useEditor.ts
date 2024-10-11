import { ChangeEvent, MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import Quill, { QuillOptions } from "quill";
import { Delta, Op } from "quill/core";

type EditorValue = {
  image: File | null;
  body: string;
};

type EditorProps = {
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  onSubmit: (values: EditorValue) => void;
};

export function useEditor({
  onSubmit,
  defaultValue = [],
  disabled,
  innerRef,
  placeholder,
}: EditorProps) {
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [image, setImage] = useState<File | null>(null);

  const inputImageRef = useRef<HTMLInputElement | null>(null);
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

  const onEmojiSelect = (emoji: string): void => {
    const quill = quillRef.current;
    quill?.insertText(quill.getSelection()?.index || 0, emoji);
  };

  const onOpenImageSelection = () => {
    inputImageRef.current?.click();
  };

  const onSelectImage = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    console.log(file);
    setImage(file);
  };

  const onRemoveImage = (): void => {
    setImage(null);
    inputImageRef.current!.value = "";
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

  return {
    isToolbarVisible,
    isEmpty,
    image,
    disabledRef,
    inputImageRef,
    containerRef,
    toggleToolbar,
    onEmojiSelect,
    onOpenImageSelection,
    onSelectImage,
    onRemoveImage,
  };
}
