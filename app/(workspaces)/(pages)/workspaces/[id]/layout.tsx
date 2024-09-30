import { Toolbar, WorkspaceContent } from "@/app/(workspaces)/_components";

interface Props {
  children: React.ReactNode;
}

function WorkSpaceLayout({ children }: Props) {
  return (
    <main>
      <Toolbar />
      <WorkspaceContent>{children}</WorkspaceContent>
    </main>
  );
}
export default WorkSpaceLayout;
