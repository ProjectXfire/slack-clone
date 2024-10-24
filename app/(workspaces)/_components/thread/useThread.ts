import type { EditorValue } from "@/shared/components/editor/Editor";
import type { CreateMessageDto } from "@/core/messages/dtos";
import { useRef, useState } from "react";
import Quill from "quill";
import { useToast } from "@/shared/hooks";
import { useCurrentMember } from "@/core/members/services";
import { useCreateMessage, useGetMessage, useGetMessages } from "@/core/messages/services";
import { useCreateUploadUrl } from "@/core/upload/services";
import { useChannelId, useWorkspaceId } from "../../_hooks";
import { useGetChannel } from "@/core/channels/services";

export function useThread(messageId: string) {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const [isEditing, setIsEditing] = useState<null | string>(null);
  const { response: message } = useGetMessage(messageId);
  const { response: member } = useCurrentMember(workspaceId);
  const {
    results: threadMessages,
    status,
    loadMore,
  } = useGetMessages({ channelId, parentMessageId: messageId });
  const { resp: channel } = useGetChannel(channelId);
  const { mutate: createUrl, isPending: isPendingUrl } = useCreateUploadUrl();
  const { mutate: mutateMessage, isPending: isPendingMessage } = useCreateMessage();

  const { toast } = useToast();

  const isLoading = isPendingUrl || isPendingMessage;

  const handleEditing = (id: string | null): void => {
    setIsEditing(id);
  };

  const handleSubmit = async (values: EditorValue) => {
    const { body, image } = values;
    const newThreadMessage: CreateMessageDto = {
      workspaceId,
      channelId,
      body,
      image: undefined,
      parentMessageId: messageId,
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
      newThreadMessage.image = storageId;
    }
    const response = await mutateMessage(newThreadMessage, { throwError: true });
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

  return {
    editorKey,
    isEditing,
    message,
    member,
    isLoading,
    editorRef,
    threadMessages,
    status,
    channel,
    loadMore,
    handleEditing,
    handleSubmit,
  };
}
