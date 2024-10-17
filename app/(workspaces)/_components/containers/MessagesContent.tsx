"use client";

import styles from "./Container.module.css";

interface Props {
  children: React.ReactNode;
}

function MessagesContent({ children }: Props): JSX.Element {
  return <div className={styles["messages-content"]}>{children}</div>;
}
export default MessagesContent;
