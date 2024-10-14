"use client";

import type { EditorValue } from "@/shared/components/editor/Editor";
import type { CreateMessageDto } from "@/core/messages/dtos";
import { useRef, useState } from "react";
import Quill from "quill";
import dynamic from "next/dynamic";
import { useCreateMessage } from "@/core/messages/services";
import { useChannelId, useWorkspaceId } from "../../_hooks";
import { useToast } from "@/shared/hooks";
import styles from "./Styles.module.css";
import { FlexSpacer } from "@/shared/components";
import { useCreateUploadUrl } from "@/core/upload/services";

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

  const { mutate: createUrl, isPending: isPendingUrl } = useCreateUploadUrl();
  const { mutate: mutateMessage, isPending: isPendingMessage } = useCreateMessage();

  const handleSubmit = async ({ image, body }: EditorValue): Promise<void> => {
    editorRef.current?.enable(false);
    const messageValues: CreateMessageDto = {
      workspaceId,
      channelId,
      body,
      image: undefined,
    };
    if (image) {
      const response = await createUrl({ throwError: true });
      if (!response) return;
      const { data, isError, message } = response;
      if (isError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
          duration: 2000,
        });
        return;
      }
      const result = await fetch(data!, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });
      if (!result.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save image",
          duration: 2000,
        });
        return;
      }
      const { storageId } = await result.json();
      messageValues.image = storageId;
    }
    const response = await mutateMessage(messageValues, { throwError: true });
    if (!response) return;
    const { data, isError, message } = response;
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
    editorRef.current?.enable(true);
  };

  return (
    <div className={styles.container}>
      <FlexSpacer />
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPendingMessage}
        innerRef={editorRef}
      />
    </div>
  );
}
export default ChatInput;
