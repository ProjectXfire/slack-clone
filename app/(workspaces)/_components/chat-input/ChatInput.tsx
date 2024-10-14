"use client";

import type { EditorValue } from "@/shared/components/editor/Editor";
import { useRef, useState } from "react";
import Quill from "quill";
import dynamic from "next/dynamic";
import { useCreateMessage } from "@/core/messages/services";
import { useChannelId, useWorkspaceId } from "../../_hooks";
import { useToast } from "@/shared/hooks";
import styles from "./Styles.module.css";
import { FlexSpacer } from "@/shared/components";

const Editor = dynamic(() => import("@/shared/components/editor/Editor"), { ssr: false });

interface Props {
  placeholder: string;
}

function ChatInput({ placeholder }: Props): JSX.Element {
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const { toast } = useToast();

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useCreateMessage();

  const handleSubmit = async ({ image, body }: EditorValue): Promise<void> => {
    const resolve = await mutate({ body, workspaceId, channelId }, { throwError: true });
    if (!resolve) return;
    const { data, isError, message } = resolve;
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
        duration: 2000,
      });
    }
    if (data) {
      toast({
        title: "Message",
        description: message,
        duration: 2000,
      });
      setEditorKey((cv) => cv + 1);
    }
  };

  return (
    <div className={styles.container}>
      <FlexSpacer />
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
}
export default ChatInput;
