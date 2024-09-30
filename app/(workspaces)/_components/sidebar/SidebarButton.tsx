import type { IconType } from "react-icons/lib";
import type { LucideIcon } from "lucide-react";
import styles from "./Sidebar.module.css";
import { Button } from "@/shared/components";

interface Props {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

function SidebarButton({ icon: Icon, label, isActive }: Props): JSX.Element {
  return (
    <div className={styles["sidebar-button"]}>
      <Button
        className={`${styles["sidebar-button__button"]} ${isActive && styles["sidebar-button__button--active"]}`}
        variant="transparent"
      >
        <Icon />
      </Button>
      <span>{label}</span>
    </div>
  );
}
export default SidebarButton;
