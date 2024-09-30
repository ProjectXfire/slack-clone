import styles from "./Loader.module.css";
import { Loader } from "@/shared/components";

function StartingLoader(): JSX.Element {
  return (
    <div className={styles.container}>
      <Loader size={40} />
    </div>
  );
}
export default StartingLoader;
