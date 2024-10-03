"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "../../_hooks";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import StartingLoader from "../loader/StartingLoader";

function Workspace() {
  return <div>Workspace</div>;
}
export default Workspace;

/* 
  const workspaceId = useWorkspaceId();
  const { workspace, isLoading } = useGetOneWorkspace(workspaceId);

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (workspace === null) router.replace("/");
  }, [workspace, isLoading, router]);

  if (isLoading || !workspace) return <StartingLoader reduceHeightIn={50} />;
*/
