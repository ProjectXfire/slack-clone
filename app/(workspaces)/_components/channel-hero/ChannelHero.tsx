"use client";

import { format } from "date-fns";
import styles from "./Styles.module.css";

interface Props {
  name: string;
  creationTime: number;
}

function ChannelHero({ name, creationTime }: Props): JSX.Element {
  return (
    <div className={styles.container}>
      <p>#{name}</p>
      <p>
        This channel was created on {format(creationTime, "MMMM do, yyyy")}. This is the very
        beginning of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
}
export default ChannelHero;
