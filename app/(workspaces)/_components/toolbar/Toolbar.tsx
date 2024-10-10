"use client";

import { useWorkspaceId } from "../../_hooks";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import styles from "./Toolbar.module.css";
import { Info, Search } from "lucide-react";
import { Button, Loader } from "@/shared/components";

function Toolbar(): JSX.Element {
  const woskspaceId = useWorkspaceId();
  const { response } = useGetOneWorkspace(woskspaceId);

  if (response === undefined)
    return (
      <header className={styles["container-loader"]}>
        <Loader size={30} />
      </header>
    );

  if (!response.isError && !response.data)
    return <header className={styles["container-loader"]}>{response.message}</header>;

  return (
    <header className={styles.container}>
      <div className={styles.space} />
      <div className={styles.search}>
        <Button className={styles["search__button"]} type="button" name="search-workspace">
          <Search />
          <span>Search {response.data?.name}</span>
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
