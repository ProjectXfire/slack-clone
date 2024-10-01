"use client";

import StartingLoader from "../loader/StartingLoader";
import { useEffect, useMemo } from "react";
import { redirect, useRouter } from "next/navigation";
import { useGetWorkspaces } from "@/core/workspaces/services";
import { useCreateWorkspaceModal } from "../../_stores";

function StartingWorkspaces(): JSX.Element {
  const { workspaces, isLoading, error } = useGetWorkspaces();
  const [openModal, setOpenModal] = useCreateWorkspaceModal();
  const router = useRouter();

  const workspaceId = useMemo(() => workspaces?.[0]?._id, [workspaces]);

  useEffect(() => {
    if (isLoading) return;
    if (error) redirect("/error");
    if (workspaceId) {
      router.replace(`/workspaces/${workspaceId}`);
    } else {
      if (!openModal) {
        setOpenModal(true);
      }
    }
  }, [setOpenModal, workspaceId, isLoading, openModal, router, error]);

  if (isLoading) return <StartingLoader />;

  return <StartingLoader />;
}
export default StartingWorkspaces;
