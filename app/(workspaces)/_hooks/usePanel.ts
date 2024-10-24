import { useParentMessageId } from "@/shared/hooks";

export function usePanel() {
  const [parentMessageId, setParentMessageId] = useParentMessageId();

  const onOpenMessage = (messageId: string): void => {
    setParentMessageId(messageId);
  };

  const onClose = (): void => {
    setParentMessageId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onClose,
  };
}
