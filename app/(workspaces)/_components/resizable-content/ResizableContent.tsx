import styles from "./ResizableContent.module.css";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/shared/components";
import SidebarContent from "../sidebar/SidebarContent";

interface Props {
  children: React.ReactNode;
}

function ResizableContent({ children }: Props): JSX.Element {
  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="channel-panel">
      <ResizablePanel className={styles["channel-panel"]} minSize={11} defaultSize={20}>
        <SidebarContent />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80} minSize={20}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default ResizableContent;
