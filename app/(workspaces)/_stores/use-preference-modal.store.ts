import { Id } from "@/convex/_generated/dataModel";
import { atom, useAtom } from "jotai";

type WorkspacePrederenceState = {
  isOpen: boolean;
  initValue: string;
  workspaceId?: Id<"workspaces">;
};

const preferenceWorkspaceModalState = atom<WorkspacePrederenceState>({
  isOpen: false,
  initValue: "",
});

export const usePreferenceWorkspaceModal = () => {
  return useAtom(preferenceWorkspaceModalState);
};
