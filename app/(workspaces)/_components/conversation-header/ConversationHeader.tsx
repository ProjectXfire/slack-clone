"use client";

import { formatName } from "@/shared/utils";
import styles from "./Styles.module.css";
import { Avatar, AvatarFallback, AvatarImage, Button, Separator } from "@/shared/components";
import { FaChevronDown } from "react-icons/fa6";

interface Props {
  name?: string;
  image?: string;
  onClick: () => void;
}

function ConversationHeader({ name = "No name", image, onClick }: Props): JSX.Element {
  return (
    <header className={styles.container}>
      <div className={styles["conversation-options"]}>
        <Button
          className={styles["conversation-option"]}
          type="button"
          variant="ghost"
          onClick={onClick}
        >
          <Avatar className={styles["conversation-options-avatar"]}>
            <AvatarImage
              className={styles["conversation-options__image"]}
              src={image}
              alt="member"
            />
            <AvatarFallback className={styles["conversation-options__image"]}>
              {formatName(name ?? "MB")}
            </AvatarFallback>
          </Avatar>
          <p className={styles["conversation-options__name"]}>{name}</p>
          <FaChevronDown className={styles["conversation-option__icon"]} />
        </Button>
      </div>
      <Separator />
    </header>
  );
}
export default ConversationHeader;
