"use client";

import { Button } from "@/shared/components";
import styles from "./Toolbar.module.css";
import { Info, Search } from "lucide-react";
import { useWorkspaceId } from "../../_hooks";
import { useGetOneWorkspace } from "../../_services";

function Toolbar(): JSX.Element {
  const woskspaceId = useWorkspaceId();
  const { data, isLoading } = useGetOneWorkspace(woskspaceId);

  return (
    <header className={styles.container}>
      <div className={styles.space} />
      <div className={styles.search}>
        <Button className={styles["search__button"]} type="button" name="search-workspace">
          <Search />
          <span>Search {data?.name}</span>
        </Button>
      </div>
      <div className={styles.info}>
        <Button variant="ghost" type="button" name="search-workspace">
          <Info />
        </Button>
      </div>
    </header>
  );
}
export default Toolbar;
