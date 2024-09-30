"use client";

import { useEffect, useState } from "react";
import CreateWorkspace from "./CreateWorkspace";

function DialogContainer(): JSX.Element {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <>
      <CreateWorkspace />
    </>
  );
}
export default DialogContainer;
