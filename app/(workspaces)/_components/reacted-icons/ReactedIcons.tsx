"use client";

import type { Reactions } from "@/core/messages/models";
import styles from "./Styles.module.css";
import { EmojiPopover } from "@/shared/components";
import { SmilePlus } from "lucide-react";

interface Props {
  reactions: Reactions[];
  memberId: string;
  onChange: (value: string) => void;
}

function ReactedIcons({ reactions, onChange, memberId }: Props): JSX.Element {
  if (reactions.length === 0 || !memberId) return <></>;

  return (
    <ul className={styles.container}>
      {reactions.map((reaction) => (
        <li key={reaction.value}>
          <button
            className={`${styles.reaction} ${reaction.reactions.includes(memberId) && styles["reaction--own"]}`}
            type="button"
            name="reacted-icon"
            onClick={() => onChange(reaction.value)}
          >
            <p className={styles["reaction__icon"]}>{reaction.value}</p>
            <p className={styles["reaction__counter"]}>{reaction.count}</p>
          </button>
        </li>
      ))}
      <EmojiPopover hint="Add reaction" onEmojiSelect={(value) => onChange(value)}>
        <button className={styles["reaction__plus"]} type="button" name="add-reaction">
          <SmilePlus />
        </button>
      </EmojiPopover>
    </ul>
  );
}
export default ReactedIcons;
