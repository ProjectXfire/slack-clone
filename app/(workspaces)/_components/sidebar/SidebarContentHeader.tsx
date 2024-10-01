import type { Workspace } from "@/core/workspaces/models";
import React from "react";
import { formatName } from "@/shared/utils";
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
              <DropdownMenuItem>
                <DropdownItem
                  icon={Users}
                  titleBold={false}
                  title={`Invite people to ${workspace.name}`}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
