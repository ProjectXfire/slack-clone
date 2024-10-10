import { ChangeEvent, useState } from "react";
import { useDeleteChannel, useUpdateChannel } from "@/core/channels/services";
import { useConfirm } from "@/shared/components";
import { useToast } from "@/shared/hooks";
import { useCurrentMember } from "@/core/members/services";

type HeaderProps = {
  channelId: string;
  workspaceId: string;
  title: string;
};

export function useChannelHeader({ channelId, workspaceId, title }: HeaderProps) {
  const [channelName, setChannelName] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [ConfirmComponent, confirm] = useConfirm({
    title: "Delete channel",
    message: "This action cannot be undo, are you sure?",
  });

  const { toast } = useToast();
  const { response } = useCurrentMember(workspaceId);
  const { mutate: updateChannel, isPending: isPendingUpdate } = useUpdateChannel();
  const { mutate: removeChannel, isPending: isPendingRemove } = useDeleteChannel();

  const onChangeChannelName = (e: ChangeEvent<HTMLInputElement>): void => {
    setChannelName(e.target.value);
  };

  const handleEditing = (): void => {
    if (response?.data?.role === "admin") setIsEditing((cv) => !cv);
  };

  const onUpdateName = (): void => {
    if (!channelName || channelName.length < 3) {
      toast({
        variant: "destructive",
        title: "Channel name",
        description: "Name is required an should have at least 3 characters",
        duration: 3000,
      });
      return;
    }
    updateChannel(
      { name: channelName, channelId, workspaceId },
      {
        onError: (message) => {
          toast({
            variant: "destructive",
            title: "Channel",
            description: message,
            duration: 3000,
          });
        },
        onSuccess: ({ message }) => {
          toast({
            title: "Channel",
            description: message,
            duration: 3000,
          });
          setIsEditing(false);
        },
      }
    );
  };

  const onDeleteChannel = async (): Promise<void> => {
    if (response?.data?.role !== "admin") return;
    const ok = await confirm();
    if (!ok) return;
    removeChannel(
      { channelId, workspaceId },
      {
        onError: (message) => {
          toast({
            variant: "destructive",
            title: "Channel",
            description: message,
            duration: 3000,
          });
        },
        onSuccess: ({ message }) => {
          toast({
            title: "Channel",
            description: message,
            duration: 3000,
          });
          setIsEditing(false);
        },
      }
    );
  };

  return {
    response,
    isEditing,
    channelName,
    ConfirmComponent,
    isPendingUpdate,
    isPendingRemove,
    handleEditing,
    onChangeChannelName,
    onUpdateName,
    onDeleteChannel,
  };
}
