"use client";

import { useWorkspaceId } from "../../_hooks";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import styles from "./Toolbar.module.css";
import { Info, Search } from "lucide-react";
import { Button } from "@/shared/components";

function Toolbar(): JSX.Element {
  const woskspaceId = useWorkspaceId();
  const { workspace, isLoading } = useGetOneWorkspace(woskspaceId);

  return (
    <header className={styles.container}>
      <div className={styles.space} />
      <div className={styles.search}>
        <Button className={styles["search__button"]} type="button" name="search-workspace">
          <Search />
          <span>Search {isLoading ? "" : workspace?.name}</span>
        </Button>
      </div>
      <div className={styles.info}>
        <Button variant="transparent" type="button" name="search-workspace">
          <Info />
        </Button>
      </div>
    </header>
  );
}
export default Toolbar;
