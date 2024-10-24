import {
  useDeleteMessage,
  useToggleReactMessage,
  useUpdateMessage,
} from "@/core/messages/services";
import { useConfirm } from "@/shared/components";
import { useToast } from "@/shared/hooks";
import { usePanel } from "../../_hooks";

export function useMemberMessage(id: string, setEditingId: (id: string | null) => void) {
  const { toast } = useToast();
  const { onOpenMessage, onClose, parentMessageId } = usePanel();
  const { mutate: updateMessage, isPending: isPendingUpdateMessage } = useUpdateMessage();
  const { mutate: deleteMessage, isPending: isPendingDeleteMessage } = useDeleteMessage();
  const { mutate: toggleMessageReaction, isPending: isPendingReaction } = useToggleReactMessage();
  const [ConfirmComponent, confirm] = useConfirm({
    title: "Message",
    message: "Are you sure to delete it?, this action cannot be undone.",
  });

  const isPending = isPendingUpdateMessage || isPendingDeleteMessage || isPendingReaction;

  const handleUpdateMessage = (body: string): void => {
    updateMessage(
      { id, body },
      {
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Message",
            description: err,
            duration: 3000,
          });
        },
        onSuccess: ({ message }) => {
          toast({
            title: "Message",
            description: message,
            duration: 3000,
          });
          setEditingId(null);
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleMessageReaction(
      { value, messageId: id },
      {
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Message",
            description: err,
            duration: 3000,
          });
        },
      }
    );
  };

  const handleThread = (): void => {
    onOpenMessage(id);
  };

  const handleDeleteMessage = async (): Promise<void> => {
    const ok = await confirm();
    if (!ok) return;
    deleteMessage(
      { id },
      {
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Message",
            description: err,
            duration: 3000,
          });
        },
        onSuccess: ({ message, data }) => {
          toast({
            title: "Message",
            description: message,
            duration: 3000,
          });
          if (parentMessageId === data) onClose();
        },
      }
    );
  };

  return {
    isPending,
    ConfirmComponent,
    handleUpdateMessage,
    handleReaction,
    handleDeleteMessage,
    isPendingDeleteMessage,
    handleThread,
  };
}
