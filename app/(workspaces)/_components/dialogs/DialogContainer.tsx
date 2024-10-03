"use client";

import React from "react";
import { useEffect, useState } from "react";
import CreateWorkspace from "./CreateWorkspace";
import WorkspacePreference from "../workspace-preference/WorkspacePreference";

function DialogContainer(): JSX.Element {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <>
      <CreateWorkspace />
      <WorkspacePreference />
    </>
  );
}
export default DialogContainer;
