import { atom, useAtom } from "jotai";

const conversationIdState = atom<string>("");

export const useConversationId = () => {
  return useAtom(conversationIdState);
};
