"use client";

import { useCurrentMember } from "@/core/members/services";
import { useWorkspaceId } from "../../_hooks";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import styles from "./Sidebar.module.css";
import { AlertTriangle } from "lucide-react";
import { CustomAlert, Loader } from "@/shared/components";
import SidebarContentHeader from "./SidebarContentHeader";
import { redirect } from "next/navigation";

function SidebarContent(): JSX.Element {
  const workspaceId = useWorkspaceId();

  const { member, isLoading: isLoadingMember, error: memberError } = useCurrentMember(workspaceId);
  const {
    workspace,
    isLoading: isLoadingWorkspace,
    error: workspaceError,
  } = useGetOneWorkspace(workspaceId);

  if (memberError || workspaceError) redirect("/error");

  if (member === null || workspace === null)
    return (
      <div className={styles["sidebar-content"]}>
        <div className={`${styles["sidebar-content-center"]}`}>
          <CustomAlert
            description="Workspace not found"
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
