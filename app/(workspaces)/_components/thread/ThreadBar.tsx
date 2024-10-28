"use client";

import { formatDistanceToNow } from "date-fns";
import styles from "./Styles.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components";

interface Props {
  count: number;
  image?: string;
  timestamp: number;
  onClick: () => void;
}

function ThreadBar({ count, image, timestamp, onClick }: Props): JSX.Element {
  if (count === 0) return <></>;

  return (
    <button
      className={styles["thread-bar-container"]}
      type="button"
      name="message-has-thread"
      onClick={onClick}
    >
      <div className={styles["thread-bar"]}>
        <Avatar className={styles["thread-bar__avatar"]}>
          <AvatarImage src={image} />
          <AvatarFallback>
            <p className={styles["thread-bar__avatar"]}>M</p>
          </AvatarFallback>
        </Avatar>
        <div>
          <div className={styles["thread-bar__content"]}>
            <span className={styles["thread-bar__reply"]}>
              {count} {count > 1 ? "replies" : "reply"}
            </span>
            <span className={styles["thread-bar__time"]}>
              Last reply {formatDistanceToNow(timestamp, { addSuffix: true })}
            </span>
            <span className={styles["thread-bar__view"]}>View thread</span>
          </div>
        </div>
      </div>
    </button>
  );
}
export default ThreadBar;
