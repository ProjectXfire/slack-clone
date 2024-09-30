import styles from "./Container.module.css";
import Sidebar from "../sidebar/Sidebar";

interface Props {
  children: React.ReactNode;
}

function WorkspaceContent({ children }: Props): JSX.Element {
  return (
    <div className={styles["workspace-content"]}>
      <Sidebar />
      {children}
    </div>
  );
}
export default WorkspaceContent;
