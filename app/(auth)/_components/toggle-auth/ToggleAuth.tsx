import styles from "./ToggleAuth.module.css";
import { Button } from "@/shared/components";

interface Props {
  text: string;
  actionText: string;
  onActionClick: () => void;
}

function ToggleAuth({ text, actionText, onActionClick }: Props): JSX.Element {
  return (
    <footer className={styles.container}>
      <p>{text}</p>
      <Button variant="link" onClick={onActionClick}>
        {actionText}
      </Button>
    </footer>
  );
}
export default ToggleAuth;
