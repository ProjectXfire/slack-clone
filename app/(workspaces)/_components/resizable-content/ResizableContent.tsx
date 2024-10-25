"use client";

import styles from "./ResizableContent.module.css";
import { usePanel } from "../../_hooks";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/shared/components";
import SidebarContent from "../sidebar/SidebarContent";
import Thread from "../thread/Thread";
import { useConversationId } from "../../_stores";

interface Props {
  children: React.ReactNode;
}

function ResizableContent({ children }: Props): JSX.Element {
  const { parentMessageId, onClose } = usePanel();
  const [conversationId, setConversationId] = useConversationId();

  const showPanel = !!parentMessageId;

  const closeThread = () => {
    onClose();
    setConversationId("");
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
            <Thread
              messageId={parentMessageId}
              conversationId={conversationId}
              onClose={closeThread}
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
export default ResizableContent;
