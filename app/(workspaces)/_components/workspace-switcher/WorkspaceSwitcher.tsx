"use client";

import { useRouter } from "next/navigation";
import { useGetOneWorkspace, useGetWorkspaces } from "@/core/workspaces/services";
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
import DropdownItem from "../dropdown-item/DropdownItem";

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
              <DropdownMenuItem key={ws._id} onClick={() => navigateToWorkspace(ws!._id)}>
                <DropdownItem
                  avatarString={formatName(ws.name)}
                  title={ws.name}
                  subtitle="El pepe pequeño"
                />
              </DropdownMenuItem>
            ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openCreateWorkspaceModal}>
            <DropdownItem icon={Plus} title="Create a new workspace" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
export default WorkspaceSwitcher;
