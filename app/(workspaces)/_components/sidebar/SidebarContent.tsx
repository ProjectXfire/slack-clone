"use client";

import { useCurrentMember } from "@/core/members/services";
import { useWorkspaceId } from "../../_hooks";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import styles from "./Sidebar.module.css";
import { AlertTriangle } from "lucide-react";
import { CustomAlert, Loader } from "@/shared/components";
import SidebarContentHeader from "./SidebarContentHeader";

function SidebarContent(): JSX.Element {
  const workspaceId = useWorkspaceId();

  const { member, isLoading: isLoadingMember, error: errorMember } = useCurrentMember(workspaceId);
  const {
    workspace,
    isLoading: isLoadingWorkspace,
    error: errorWorkspace,
  } = useGetOneWorkspace(workspaceId);

  if (errorMember || errorWorkspace)
    return (
      <div className={styles["sidebar-content"]}>
        <div className={`${styles["sidebar-content-center"]}`}>
          <CustomAlert
            description={errorMember}
            title={"Error"}
            variant="destructive"
            icon={<AlertTriangle />}
          />
        </div>
      </div>
    );

  return (
    <div className={styles["sidebar-content"]}>
      {isLoadingMember || isLoadingWorkspace ? (
        <div className={styles["sidebar-content-center"]}>
          <Loader size={30} />
        </div>
      ) : (
        <SidebarContentHeader workspace={workspace!} isAdmin={member!.role === "admin"} />
      )}
    </div>
  );
}
export default SidebarContent;
