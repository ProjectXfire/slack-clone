import { useCallback, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

type RequestType = { channelId: string; workspaceId: string; name: string };
type ResponseType = { message: string; data: string };

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (err: string) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export function useUpdateChannel() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResponseType | null>(null);
  const mutation = useMutation(api.channels.update);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      const { onError, onSuccess, onSettled } = options;
      setIsPending(true);
      setError(null);
      setData(null);
      const { data, isError, message } = await mutation(values);
      if (isError) {
        setError(message);
        onError?.(message);
      }
      if (data) {
        setData({ data, message });
        onSuccess?.({ data, message });
      }
      setIsPending(false);
      onSettled?.();
    },
    [mutation, setData]
  );
  return { mutate, isPending, data, error };
}
