import styles from "./Container.module.css";
import Sidebar from "../sidebar/Sidebar";
import ResizableContent from "../resizable-content/ResizableContent";

interface Props {
  children: React.ReactNode;
}

function WorkspaceContent({ children }: Props): JSX.Element {
  return (
    <div className={styles["workspace-content"]}>
      <Sidebar />
      <ResizableContent>{children}</ResizableContent>
    </div>
  );
}
export default WorkspaceContent;
