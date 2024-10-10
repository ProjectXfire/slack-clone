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

  const { response } = useGetWorkspaces();

  useEffect(() => {
    if (response === undefined) return;
    const { data, isError } = response;
    if (isError) redirect("/error");
    if (data.length > 0) {
      router.replace(`/workspaces/${data[0]._id}`);
      return;
    }
    if (!openModal) {
      setOpenModal(true);
      return;
    }
  }, [openModal, response, router, setOpenModal]);

  return <StartingLoader />;
}
export default StartingWorkspaces;
