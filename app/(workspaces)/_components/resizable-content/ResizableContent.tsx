"use client";

import { useConversationId } from "../../_stores";
import { usePanel } from "../../_hooks";
import styles from "./ResizableContent.module.css";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/shared/components";
import SidebarContent from "../sidebar/SidebarContent";
import Thread from "../thread/Thread";
import Profile from "../profile/Profile";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

function ResizableContent({ children }: Props): JSX.Element {
  const router = useRouter();
  const { parentMessageId, profileMemberId, onClose } = usePanel();
  const [conversationId, setConversationId] = useConversationId();

  const showPanel = !!parentMessageId || !!profileMemberId;

  const closePanel = () => {
    onClose();
    setConversationId("");
  };

  const onDelete = () => {
    router.replace("/");
  };

  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="channel-panel">
      <ResizablePanel className={styles["channel-panel"]} order={1} minSize={11} defaultSize={20}>
        <SidebarContent />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel order={2} defaultSize={80} minSize={20}>
        {children}
      </ResizablePanel>
      {showPanel && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel id="thread-panel" order={3} defaultSize={20} minSize={20}>
            {parentMessageId && (
              <Thread
                messageId={parentMessageId}
                conversationId={conversationId}
                onClose={closePanel}
              />
            )}
            {profileMemberId && (
              <Profile memberId={profileMemberId} onClose={closePanel} onDelete={onDelete} />
            )}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
export default ResizableContent;
