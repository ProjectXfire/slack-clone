"use client";

import dynamic from "next/dynamic";
import styles from "./Styles.module.css";
import { useRef } from "react";
import Quill from "quill";
import { FlexSpacer } from "@/shared/components";

const Editor = dynamic(() => import("@/shared/components/editor/Editor"), { ssr: false });

interface Props {
  placeholder: string;
}

function ChatInput({ placeholder }: Props): JSX.Element {
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className={styles.container}>
      <FlexSpacer />
      <Editor placeholder={placeholder} onSubmit={() => {}} disabled={false} innerRef={editorRef} />
    </div>
  );
}
export default ChatInput;
