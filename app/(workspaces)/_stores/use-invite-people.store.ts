import { atom, useAtom } from "jotai";

type WorkspaceInvitePeopleState = {
  isOpen: boolean;
  workspaceName: string;
  workspaceId: string;
  joinCode: string;
};

const invitePeopleWorkspaceModalState = atom<WorkspaceInvitePeopleState>({
  isOpen: false,
  workspaceName: "",
  joinCode: "",
  workspaceId: "",
});

export const useInvitePeopleWorkspaceModal = () => {
  return useAtom(invitePeopleWorkspaceModalState);
};
