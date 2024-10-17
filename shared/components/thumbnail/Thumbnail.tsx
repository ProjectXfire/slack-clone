"use client";

import NextImage from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/Dialog";
import styles from "./Styles.module.css";

interface Props {
  url: string;
}

function Thumbnail({ url }: Props): JSX.Element {
  return (
    <Dialog>
      <DialogTrigger>
        <div className={styles.image}>
          <NextImage src={url} alt="image" fill />
        </div>
      </DialogTrigger>
      <DialogContent className={styles["dialog-container"]}>
        <DialogTitle></DialogTitle>
        <div className={styles["dialog-image"]}>
          <NextImage src={url} alt="image" fill />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default Thumbnail;
