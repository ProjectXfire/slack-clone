"use client";

import { useRouter } from "next/navigation";
import { useGetOneWorkspace, useGetWorkspaces } from "../../_services";
import { useCreateWorkspaceModal } from "../../_stores";
import { useWorkspaceId } from "../../_hooks";
import { formatName } from "@/shared/utils";
import styles from "./WorkspaceSwitcher.module.css";
import { Plus } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Loader,
} from "@/shared/components";

function WorkspaceSwitcher(): JSX.Element {
  const workspaceId = useWorkspaceId();
  const { workspace, isLoading: workspaceIsLoading } = useGetOneWorkspace(workspaceId);
  const { workspaces, isLoading: workspacesIsLoading, error } = useGetWorkspaces();

  const [, setOpen] = useCreateWorkspaceModal();

  const router = useRouter();

  const navigateToWorkspace = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  const openCreateWorkspaceModal = () => {
    setOpen(true);
  };

  const filteredWorkspaces = () => {
    return workspaces?.filter((ws) => ws._id !== workspace?._id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={styles["ws-switcher-trigger"]}>
          {workspaceIsLoading ? <Loader /> : formatName(workspace?.name ?? "")}
        </Button>
      </DropdownMenuTrigger>
      {!workspacesIsLoading && (
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem
            className={styles["ws-switcher-active"]}
            onClick={() => navigateToWorkspace(workspace!._id)}
          >
            <p>{workspace?.name}</p>
            <p>Workspace active</p>
          </DropdownMenuItem>
          {!error &&
            filteredWorkspaces()?.map((ws) => (
              <DropdownMenuItem
                className={`${styles["ws-switcher-item"]}`}
                key={ws._id}
                onClick={() => navigateToWorkspace(ws!._id)}
              >
                <p
                  className={`${styles["ws-switcher-item__icon"]} ${styles["ws-switcher-item__icon--ws"]}`}
                >
                  {formatName(workspace?.name ?? "")}
                </p>
                <p className={styles["ws-switcher-item__name"]}>{ws.name}</p>
              </DropdownMenuItem>
            ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={styles["ws-switcher-item"]}
            onClick={openCreateWorkspaceModal}
          >
            <Plus
              className={`${styles["ws-switcher-item__icon"]} ${styles["ws-switcher-item__icon--create"]}`}
            />
            <p>Create a new workspace</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
export default WorkspaceSwitcher;
