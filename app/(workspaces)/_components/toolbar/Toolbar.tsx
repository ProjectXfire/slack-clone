"use client";

import NextLink from "next/link";
import { useWorkspaceId } from "../../_hooks";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import styles from "./Toolbar.module.css";
import { Info, Search } from "lucide-react";
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  DialogDescription,
  DialogTitle,
  Loader,
} from "@/shared/components";
import { useState } from "react";
import { useGetChannels } from "@/core/channels/services";
import { useGetMembers } from "@/core/members/services";

function Toolbar(): JSX.Element {
  const woskspaceId = useWorkspaceId();
  const [open, setOpen] = useState(false);

  const { response: workspace } = useGetOneWorkspace(woskspaceId);
  const { response: channels } = useGetChannels(woskspaceId);
  const { response: members } = useGetMembers(woskspaceId);

  const onOpenMenu = (): void => {
    setOpen(true);
  };

  const onCloseMenu = () => {
    setOpen(false);
  };

  if (workspace === undefined || channels === undefined || members === undefined)
    return (
      <header className={styles["container-loader"]}>
        <Loader size={30} />
      </header>
    );

  if (!workspace.isError && !workspace.data)
    return <header className={styles["container-loader"]}>{workspace.message}</header>;

  if (channels.isError && !channels.data)
    return <header className={styles["container-loader"]}>{channels.message}</header>;

  if (members.isError && !members.data)
    return <header className={styles["container-loader"]}>{members.message}</header>;

  return (
    <header className={styles.container}>
      <div className={styles.space} />
      <div className={styles.search}>
        <Button
          className={styles["search__button"]}
          type="button"
          name="search-workspace"
          onClick={onOpenMenu}
        >
          <Search />
          <span>Search {workspace.data?.name}</span>
        </Button>
      </div>
      <div className={styles.info}>
        <Button variant="transparent" type="button" name="search-workspace">
          <Info />
        </Button>
      </div>
      <CommandDialog open={open} onOpenChange={(value) => setOpen(value)}>
        <DialogTitle className={styles["search-hide-item"]}></DialogTitle>
        <DialogDescription className={styles["search-hide-item"]}></DialogDescription>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Channels">
            {channels.data.map((channel) => (
              <CommandItem key={channel._id} asChild>
                <NextLink
                  href={`/workspaces/${woskspaceId}/channels/${channel._id}`}
                  onClick={onCloseMenu}
                >
                  {channel.name}
                </NextLink>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Members">
            {members.data.map((member) => (
              <CommandItem key={member._id} asChild>
                <NextLink
                  href={`/workspaces/${woskspaceId}/members/${member._id}`}
                  onClick={onCloseMenu}
                >
                  {member.user.name}
                </NextLink>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
export default Toolbar;
