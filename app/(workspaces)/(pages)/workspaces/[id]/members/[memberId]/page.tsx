"use client";

import { useEffect } from "react";
import { useCreateOrGetConversation } from "@/core/messages/services";
import { useGetMember } from "@/core/members/services";
import { useMemberId, useWorkspaceId } from "@/app/(workspaces)/_hooks";
import { useToast } from "@/shared/hooks";
import {
  ChatInput,
  Conversation,
  ConversationHeader,
  MessagesContent,
  StartingLoader,
  WorkspaceContentError,
} from "@/app/(workspaces)/_components";

function MemberPage() {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const { toast } = useToast();

  const { mutate, isPending, data, error } = useCreateOrGetConversation();
  const { response } = useGetMember(memberId);

  useEffect(() => {
    mutate(
      { memberId, workspaceId },
      {
        onSuccess: ({ data, message }) => {
          if (data.isNew)
            toast({
              title: "Conversation",
              description: message,
              duration: 3000,
            });
        },
      }
    );
  }, [memberId, mutate, toast, workspaceId]);

  if (isPending || response === undefined) return <StartingLoader reduceHeightIn={50} />;

  if (!data || !response.data)
    return <WorkspaceContentError description={error! || response.message} reduceHeightIn={50} />;

  return (
    <MessagesContent>
      <ConversationHeader
        name={response.data.user.name}
        image={response.data.user.image}
        onClick={() => {}}
      />
      <Conversation conversationId={data} member={response.data} />
      <ChatInput placeholder={`Message ${response.data.user.name}`} conversationId={data} />
    </MessagesContent>
  );
}
export default MemberPage;
