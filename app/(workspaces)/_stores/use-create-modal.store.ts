import { atom, useAtom } from "jotai";

const workspaceModalState = atom(false);

export const useCreateWorkspaceModal = () => {
  return useAtom(workspaceModalState);
};
