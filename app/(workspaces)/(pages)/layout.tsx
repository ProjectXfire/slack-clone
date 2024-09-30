import { DialogContainer } from "../_components";

interface Props {
  children: React.ReactNode;
}

function WorkspaceLayout({ children }: Props): JSX.Element {
  return (
    <main>
      <DialogContainer />
      {children}
    </main>
  );
}
export default WorkspaceLayout;
