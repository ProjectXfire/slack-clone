"use client";

import styles from "./Styles.module.css";

interface Props {
  label: string;
}

function SeparatorLabel({ label }: Props) {
  return (
    <div className={styles["separator"]}>
      <div />
      <span>{label}</span>
      <div />
    </div>
  );
}
export default SeparatorLabel;
