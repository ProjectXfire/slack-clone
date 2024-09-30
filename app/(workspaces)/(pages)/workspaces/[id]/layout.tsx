import { Toolbar } from "@/app/(workspaces)/_components";

interface Props {
  children: React.ReactNode;
}

function WorkSpaceLayout({ children }: Props) {
  return (
    <main>
      <Toolbar />
      {children}
    </main>
  );
}
export default WorkSpaceLayout;
