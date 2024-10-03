"use client";

import React, { useEffect, useState } from "react";
import CreateWorkspace from "./CreateWorkspace";
import WorkspacePreference from "../workspace-preference/WorkspacePreference";
import CreateChannel from "./CreateChannel";

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
    </>
  );
}
export default DialogContainer;
