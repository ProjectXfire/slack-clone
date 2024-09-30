import styles from "./Loader.module.css";
import { Loader as LucideLoader } from "lucide-react";

interface Props {
  size?: number;
}

function Loader({ size = 20 }: Props): JSX.Element {
  return (
    <div className={styles.container} style={{ width: size * 2, height: size * 2 }}>
      <LucideLoader className={styles.loader} style={{ width: size, height: size }} />
    </div>
  );
}
export default Loader;
