"use client";

import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";
import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react";
import { UserButton } from "@/app/(auth)/_components";
import WorkspaceSwitcher from "../workspace-switcher/WorkspaceSwitcher";
import SidebarButton from "./SidebarButton";

function Sidebar(): JSX.Element {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <WorkspaceSwitcher />
      <SidebarButton icon={Home} label="Home" isActive />
      <SidebarButton icon={MessageSquare} label="Dms" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className={styles["sidebar-space"]} />
      <UserButton />
    </aside>
  );
}
export default Sidebar;
