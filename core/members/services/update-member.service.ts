import { useCallback, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

type RequestType = {
  id: string;
  role: "admin" | "member";
};
type ResponseType = { message: string; data: string };

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (err: string) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export function useUpdateMember() {
  const [isPending, setIsPending] = useState(false);

  const mutation = useMutation(api.members.update);

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
