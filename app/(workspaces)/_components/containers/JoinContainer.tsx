import styles from "./Container.module.css";

interface Props {
  children: React.ReactNode;
}

function JoinContainer({ children }: Props): JSX.Element {
  return <section className={styles["workspace-join"]}>{children}</section>;
}
export default JoinContainer;
