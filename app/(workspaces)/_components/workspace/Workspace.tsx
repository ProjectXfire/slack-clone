"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "../../_hooks";
import { useGetOneWorkspace } from "../../_services";
import StartingLoader from "../loader/StartingLoader";

function Workspace() {
  const workspaceId = useWorkspaceId();
  const { workspace, isLoading, error } = useGetOneWorkspace(workspaceId);

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (error) router.push("/error");
    if (!workspace) router.replace("/");
  }, [workspace, isLoading, router, error]);

  if (isLoading || !workspace) return <StartingLoader reduceHeightIn={50} />;

  return <div>Workspace {workspace.name}</div>;
}
export default Workspace;
