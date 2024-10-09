"use client";

import { useToggle } from "react-use";
import styles from "./Container.module.css";
import { FaCaretDown } from "react-icons/fa";
import { Button, Hint } from "@/shared/components";
import { Plus } from "lucide-react";

interface Props {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
  hideOnNew?: boolean;
}

function WorkspaceSection({ children, hint, label, onNew, hideOnNew = false }: Props): JSX.Element {
  const [on, toggle] = useToggle(true);

  return (
    <div className={styles["workspace-section"]}>
      <div className={styles["workspace-section-header"]}>
        <Button
          className={styles["workspace-section-button"]}
          size="sm"
          variant="transparent"
          type="button"
          name="channels"
          onClick={toggle}
        >
          <FaCaretDown
            className={`${styles["workspace-section-arrow"]} ${on && styles["workspace-section-arrow--open"]}`}
          />
        </Button>
        <Button
          className={styles["workspace-section-button"]}
          size="sm"
          variant="transparent"
          type="button"
          onClick={toggle}
        >
          <span>{label}</span>
        </Button>
        <div className={styles["workspace-section-space"]} />
        {onNew && !hideOnNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              className={`${styles["workspace-section-button"]} ${styles["workspace-section-button--hide"]}`}
              variant="transparent"
              type="button"
              name="new channel"
              onClick={onNew}
            >
              <Plus />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
}
export default WorkspaceSection;
