import { useParentMessageId, useProfileMemberId } from "@/shared/hooks";

export function usePanel() {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOpenMessage = (messageId: string): void => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };

  const onOpenProfile = (memberId: string): void => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onClose = (): void => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    profileMemberId,
    onOpenMessage,
    onOpenProfile,
    onClose,
  };
}
