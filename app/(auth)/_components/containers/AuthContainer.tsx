import styles from "./Container.module.css";

interface Props {
  children: React.ReactNode;
}

function AuthContainer({ children }: Props): JSX.Element {
  return (
    <main className={styles["auth-container"]}>
      <div className={styles["auth-card"]}>{children}</div>
    </main>
  );
}
export default AuthContainer;
