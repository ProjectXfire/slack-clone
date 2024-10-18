"use client";

import NextImage from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription } from "../ui/Dialog";
import styles from "./Styles.module.css";

interface Props {
  url: string;
}

function Thumbnail({ url }: Props): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger>
        <div className={styles.image}>
          <NextImage
            priority
            src={url}
            alt="image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </DialogTrigger>
      <DialogContent className={styles["dialog-container"]}>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
        <div className={styles["dialog-image"]}>
          <NextImage
            priority
            src={url}
            alt="image"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default Thumbnail;
