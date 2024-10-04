"use client";

import React, { useEffect, useState } from "react";
import CreateWorkspace from "./CreateWorkspace";
import WorkspacePreference from "../workspace-preference/WorkspacePreference";
import CreateChannel from "./CreateChannel";
import InvitePeople from "./InvitePeople";

function DialogContainer(): JSX.Element {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <>
      <CreateWorkspace />
      <CreateChannel />
      <WorkspacePreference />
      <InvitePeople />
    </>
  );
}
export default DialogContainer;
