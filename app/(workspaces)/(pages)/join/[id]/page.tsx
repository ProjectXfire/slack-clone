import NextImage from "next/image";
import Logo from "@/shared/assets/images/logo.png";
import { JoinContainer, WorkspaceJoin } from "@/app/(workspaces)/_components";

function JoinPage() {
  return (
    <JoinContainer>
      <NextImage src={Logo} alt="logo" width={60} height={60} priority />
      <WorkspaceJoin />
    </JoinContainer>
  );
}
export default JoinPage;
