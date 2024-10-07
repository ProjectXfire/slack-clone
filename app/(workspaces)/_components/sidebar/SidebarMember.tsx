"use client";

import NextLink from "next/link";
import { formatName } from "@/shared/utils";
import { useWorkspaceId } from "../../_hooks";
import styles from "./Sidebar.module.css";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/shared/components";

interface Props {
  label?: string;
  image?: string;
  userId: string;
  isActive?: boolean;
}

function SidebarMember({ image, userId, isActive, label }: Props): JSX.Element {
  const workspaceId = useWorkspaceId();

  return (
    <Button className={styles["sidebar-member-container"]} asChild size="sm" variant="transparent">
      <NextLink
        className={`${styles["sidebar-member"]} ${isActive && styles["sidebar-member--active"]}`}
        href={`/workspaces/${workspaceId}/members/${userId}`}
      >
        <Avatar className={styles["sidebar-member__avatar"]}>
          <AvatarImage src={image} alt="member" />
          <AvatarFallback className={styles["sidebar-member__avatar-fallback"]}>
            {formatName(label ?? "MB")}
          </AvatarFallback>
        </Avatar>
        <span className={styles["sidebar-member__name"]}>{label}</span>
      </NextLink>
    </Button>
  );
}
export default SidebarMember;
