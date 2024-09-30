import styles from "./Loader.module.css";
import { Loader } from "@/shared/components";

interface Props {
  reduceHeightIn?: number;
}

function StartingLoader({ reduceHeightIn = 0 }: Props): JSX.Element {
  return (
    <div className={styles.container} style={{ height: `calc(100dvh - ${reduceHeightIn}px)` }}>
      <Loader size={40} />
    </div>
  );
}
export default StartingLoader;
