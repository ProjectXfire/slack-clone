import { useCallback, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

type ResponseType = {
  data: string;
  message: string;
};

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (err: string) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export function useCreateUploadUrl() {
  const [isPending, setIsPending] = useState(false);

  const mutation = useMutation(api.upload.generateUrl);

  const mutate = useCallback(
    async (options: Options) => {
      const { onError, onSuccess, onSettled, throwError } = options;
      setIsPending(true);
      const { data, isError, message } = await mutation();
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
