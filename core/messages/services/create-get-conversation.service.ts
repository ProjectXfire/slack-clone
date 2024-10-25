import { useCallback, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

type RequestType = {
  workspaceId: string;
  memberId: string;
};
type ResponseType = { message: string; data: { result: string; isNew: boolean } };

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (err: string) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export function useCreateOrGetConversation() {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation(api.conversations.createOrGet);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      const { onError, onSuccess, onSettled, throwError } = options;
      setIsPending(true);
      const { data, isError, message } = await mutation(values);
      if (throwError) {
        setIsPending(false);
        return { data, isError, message };
      }
      if (isError) {
        onError?.(message);
        setError(message);
      }
      if (data) {
        setData(data.result);
        onSuccess?.({ data, message });
      }
      setIsPending(false);
      onSettled?.();
    },
    [mutation]
  );
  return { mutate, isPending, data, error };
}
