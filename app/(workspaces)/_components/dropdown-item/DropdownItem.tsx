import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons/lib";
import styles from "./DropdownItem.module.css";

interface Props {
  avatarString?: string;
  icon?: LucideIcon | IconType;
  title: string;
  titleBold?: boolean;
  subtitle?: string;
}

function DropdownItem({
  avatarString = "Untitled",
  title,
  subtitle,
  icon: Icon,
  titleBold = true,
}: Props): JSX.Element {
  return (
    <div className={`${styles["dropdown-item"]}`}>
      {Icon ? (
        <Icon />
      ) : (
        <p className={`${styles["dropdown-item__icon"]} ${styles["dropdown-item__icon--ws"]}`}>
          {avatarString}
        </p>
      )}
      <div className="flex flex-col justify-center">
        <span
          className={`${styles["dropdown-item__name"]} ${!titleBold && styles["dropdown-item__name-nobold"]}`}
        >
          {title}
        </span>
        {subtitle && <span className={styles["dropdown-item__subname"]}>{title}</span>}
      </div>
    </div>
  );
}
export default DropdownItem;
