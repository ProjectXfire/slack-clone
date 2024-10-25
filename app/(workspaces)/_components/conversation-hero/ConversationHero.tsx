"use client";

import { formatName } from "@/shared/utils";
import styles from "./Styles.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components";

interface Props {
  name: string;
  image?: string;
}

function MemberHero({ name, image }: Props): JSX.Element {
  return (
    <article className={styles.container}>
      <div className={styles.avatar}>
        <Avatar>
          <AvatarImage src={image} alt="member" />
          <AvatarFallback>{formatName(name ?? "MB")}</AvatarFallback>
        </Avatar>
        <span className={styles["avatar__name"]}>{name}</span>
      </div>
      <span className={styles.footer}>
        This conversation is just between you and <strong>{name}</strong>
      </span>
    </article>
  );
}
export default MemberHero;
