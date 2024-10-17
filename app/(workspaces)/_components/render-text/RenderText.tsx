"use client";

import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import styles from "./Styles.module.css";

interface Props {
  text: string;
}

function RenderText({ text }: Props): JSX.Element {
  const [isEmpty, setIsEmpty] = useState(false);
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!renderRef.current) return;
    const container = renderRef.current;
    const quill = new Quill(document.createElement("div"), { theme: "snow" });
    quill.enable(false);
    const contents = JSON.parse(text);
    quill.setContents(contents);
    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;
    setIsEmpty(isEmpty);
    container.innerHTML = quill.root.innerHTML;
    return () => {
      if (container) container.innerHTML = "";
    };
  }, [text]);

  if (isEmpty) return <></>;

  return <div className={styles.container} ref={renderRef} />;
}
export default RenderText;
