import type { Workspace } from "@/core/workspaces/models";
import React from "react";
import { formatName } from "@/shared/utils";
import { useInvitePeopleWorkspaceModal, usePreferenceWorkspaceModal } from "../../_stores";
import styles from "./Sidebar.module.css";
import { ChevronDown, Users, Settings, SquarePen, ListFilter } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Hint,
} from "@/shared/components";
import DropdownItem from "../dropdown-item/DropdownItem";

interface Props {
  workspace: Workspace;
  isAdmin?: boolean;
}

function SidebarContentHeader({ workspace, isAdmin }: Props): JSX.Element {
  const [, setPWState] = usePreferenceWorkspaceModal();
  const [, setIPWState] = useInvitePeopleWorkspaceModal();

  const onOpenPreferenceModal = (): void => {
    setPWState({ initValue: workspace.name, isOpen: true, workspaceId: workspace._id });
  };

  const onOpenInvitePeopleModal = (): void => {
    const { name, joinCode, _id } = workspace;
    setIPWState({ isOpen: true, workspaceName: name, joinCode, workspaceId: _id });
  };

  return (
    <div className={styles["sidebar-content-header"]}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="ring-0">
          <Button
            className={styles["sidebar-content-header-trigger"]}
            variant="transparent"
            size="sm"
          >
            <p>{workspace.name}</p>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem>
            <DropdownItem
              avatarString={formatName(workspace.name)}
              title={workspace.name}
              subtitle="Active Workspace"
            />
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onOpenInvitePeopleModal}>
                <DropdownItem
                  icon={Users}
                  titleBold={false}
                  title={`Invite people to ${workspace.name}`}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onOpenPreferenceModal}>
                <DropdownItem titleBold={false} icon={Settings} title="Preferences" />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className={styles["sidebar-content-header-actions"]}>
        <Hint label="Filter conversations" side="bottom">
          <Button
            className={styles["sidebar-content-header-actions__edit"]}
            type="button"
            variant="transparent"
          >
            <ListFilter />
          </Button>
        </Hint>
        <Hint label="New message" side="bottom">
          <Button
            className={styles["sidebar-content-header-actions__edit"]}
            type="button"
            variant="transparent"
          >
            <SquarePen />
          </Button>
        </Hint>
      </div>
    </div>
  );
}
export default SidebarContentHeader;
