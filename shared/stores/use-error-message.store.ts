import { atom, useAtom } from "jotai";

type ErrorMessageState = {
  isOpen: boolean;
  message: string;
};

const errorMessageModalState = atom<ErrorMessageState>({
  isOpen: false,
  message: "",
});

export const useErrorMessageModal = () => {
  return useAtom(errorMessageModalState);
};
