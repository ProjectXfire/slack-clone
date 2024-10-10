import styles from "./Styles.module.css";
import { TriangleAlert } from "lucide-react";
import { CustomAlert } from "@/shared/components";

interface Props {
  description: string;
  reduceHeightIn?: number;
}

function WorkspaceContentError({ description, reduceHeightIn = 0 }: Props): JSX.Element {
  return (
    <div
      className={styles["workspace-content-error"]}
      style={{ height: `calc(100dvh - ${reduceHeightIn}px)` }}
    >
      <CustomAlert
        variant="destructive"
        icon={<TriangleAlert />}
        title="Error"
        description={description}
      />
    </div>
  );
}
export default WorkspaceContentError;
