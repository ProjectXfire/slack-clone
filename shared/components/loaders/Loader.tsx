import styles from "./Loader.module.css";
import { Loader as LucideLoader } from "lucide-react";

function Loader(): JSX.Element {
  return (
    <div className={styles.container}>
      <LucideLoader className={styles.loader} />
    </div>
  );
}
export default Loader;
