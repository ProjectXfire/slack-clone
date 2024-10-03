import { atom, useAtom } from "jotai";

type ChannelModalState = { workspaceId: string; isOpen: boolean };

const workspaceModalState = atom<boolean>(false);
const channelModalState = atom<ChannelModalState>({ workspaceId: "", isOpen: false });

export const useCreateWorkspaceModal = () => {
  return useAtom(workspaceModalState);
};

export const useCreateChannelModal = () => {
  return useAtom(channelModalState);
};
