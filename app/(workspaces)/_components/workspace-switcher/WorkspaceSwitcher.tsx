"use client";

import { useRouter } from "next/navigation";
import { useGetOneWorkspace, useGetWorkspaces } from "../../_services";
import { useCreateWorkspaceModal } from "../../_stores";
import { formatName } from "@/shared/utils";
import styles from "./WorkspaceSwitcher.module.css";
import { useWorkspaceId } from "../../_hooks";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Loader,
} from "@/shared/components";
import { Plus } from "lucide-react";

function WorkspaceSwitcher(): JSX.Element {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceIsLoading } = useGetOneWorkspace(workspaceId);
  const { data: workspaces, isLoading: workspacesIsLoading } = useGetWorkspaces();

  const [, setOpen] = useCreateWorkspaceModal();

  const router = useRouter();

  const filteredWorkspaces = workspaces?.filter((ws) => ws._id !== workspace?._id);

  const navigateToWorkspace = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  const openCreateWorkspaceModal = () => {
    setOpen(true);
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
          {filteredWorkspaces?.map((ws) => (
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
