"use client";

import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons/lib";
import NextLink from "next/link";
import { useWorkspaceId } from "../../_hooks";
import styles from "./Sidebar.module.css";
import { Button } from "@/shared/components";

interface Props {
  label?: string;
  icon: LucideIcon | IconType;
  id: string;
  isActive?: boolean;
}

function SidebarItem({ icon: Icon, id, label, isActive }: Props): JSX.Element {
  const workspaceId = useWorkspaceId();

  return (
    <Button className={styles["sidebar-item-container"]} size="sm" asChild variant="transparent">
      <NextLink
        className={`${styles["sidebar-item"]} ${isActive && styles["sidebar-item--active"]}`}
        href={`/workspaces/${workspaceId}/channels/${id}`}
      >
        <Icon />
        <span>{label}</span>
      </NextLink>
    </Button>
  );
}
export default SidebarItem;
