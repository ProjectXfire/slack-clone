"use client";

import { useEffect } from "react";
import { useGetOneWorkspace } from "../../_services";
import StartingLoader from "../loader/StartingLoader";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "../../_hooks";

function Workspace() {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetOneWorkspace(workspaceId);

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!data) router.replace("/");
  }, [data, isLoading, router]);

  if (isLoading || !data) return <StartingLoader reduceHeightIn={50} />;

  return <div>Workspace {data.name}</div>;
}
export default Workspace;
