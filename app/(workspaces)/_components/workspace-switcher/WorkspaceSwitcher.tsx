"use client";

import { redirect, useRouter } from "next/navigation";
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
  const { response: responseWorkspace } = useGetOneWorkspace(workspaceId);
  const { response: responseWorkspaces } = useGetWorkspaces();

  const [, setOpen] = useCreateWorkspaceModal();

  const router = useRouter();

  const navigateToWorkspace = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  const openCreateWorkspaceModal = () => {
    setOpen(true);
  };

  const filteredWorkspaces = () => {
    return responseWorkspaces?.data.filter((ws) => ws._id !== responseWorkspace?.data?._id);
  };

  if (responseWorkspace?.isError || responseWorkspaces?.isError) redirect("/");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={styles["ws-switcher-trigger"]}>
          {responseWorkspace === undefined ? (
            <Loader />
          ) : (
            formatName(responseWorkspace?.data?.name ?? "")
          )}
        </Button>
      </DropdownMenuTrigger>
      {!(responseWorkspaces === undefined) && (
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem
            className={styles["ws-switcher-active"]}
            onClick={() => navigateToWorkspace(responseWorkspace!.data!._id)}
          >
            <p>{responseWorkspace?.data?.name}</p>
            <p>Workspace active</p>
          </DropdownMenuItem>
          {filteredWorkspaces()?.map((ws) => (
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
