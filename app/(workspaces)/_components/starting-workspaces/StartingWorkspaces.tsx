"use client";

import StartingLoader from "../loader/StartingLoader";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetWorkspaces } from "../../_services";
import { useCreateWorkspaceModal } from "../../_stores";

function StartingWorkspaces(): JSX.Element {
  const { data, isLoading } = useGetWorkspaces();
  const [openModal, setOpenModal] = useCreateWorkspaceModal();
  const router = useRouter();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspaces/${workspaceId}`);
    } else {
      if (!openModal) {
        setOpenModal(true);
      }
    }
  }, [setOpenModal, workspaceId, isLoading, openModal, router]);

  if (isLoading) return <StartingLoader />;

  return <StartingLoader />;
}
export default StartingWorkspaces;
