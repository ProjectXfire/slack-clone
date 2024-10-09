"use client";

import React from "react";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "../../_stores";
import { useGetWorkspaces } from "@/core/workspaces/services";
import StartingLoader from "../loader/StartingLoader";

function StartingWorkspaces(): JSX.Element {
  const [openModal, setOpenModal] = useCreateWorkspaceModal();
  const router = useRouter();

  const { isLoading, error, workspaces } = useGetWorkspaces();

  const redirectToWorkspace = (workspaceId: string): void => {
    router.replace(`/workspaces/${workspaceId}`);
  };

  useEffect(() => {
    if (isLoading) return;
    if (workspaces && workspaces.length > 0) {
      redirectToWorkspace(workspaces[0]._id);
      return;
    }
    if (!openModal) {
      setOpenModal(true);
      return;
    }
    if (error) redirect("/error");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal, isLoading, error]);

  return <StartingLoader />;
}
export default StartingWorkspaces;
