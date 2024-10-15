import { useCallback, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

type RequestType = {
  body: string;
  image?: Id<"_storage">;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  conversationId?: string;
};
type ResponseType = { message: string; data: string };

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (err: string) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export function useCreateMessage() {
  const [isPending, setIsPending] = useState(false);

  const mutation = useMutation(api.messages.create);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      const { onError, onSuccess, onSettled, throwError } = options;
      setIsPending(true);
      const { data, isError, message } = await mutation(values);
      if (throwError) {
        setIsPending(false);
        return { data, isError, message };
      }
      if (isError) onError?.(message);
      if (data) onSuccess?.({ data, message });
      setIsPending(false);
      onSettled?.();
    },
    [mutation]
  );
  return { mutate, isPending };
}
