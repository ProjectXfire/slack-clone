import { Alert, AlertDescription, AlertTitle } from "@/shared/components";

interface Props {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | null;
}

function CustomAlert({ title, description, icon, variant = "default" }: Props): JSX.Element {
  return (
    <Alert variant={variant}>
      {icon ?? icon}
      <AlertTitle className="ml-2">{title}</AlertTitle>
      <AlertDescription className="ml-2">{description}</AlertDescription>
    </Alert>
  );
}
export default CustomAlert;
