import { useCallback, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

type RequestType = { workspaceId: string };
type ResponseType = string;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (err: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export function useUpdateWorkspaceCode() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ResponseType | null>(null);
  const mutation = useMutation(api.workspaces.newJoinCode);

  const mutate = useCallback(
    async (values: RequestType, options: Options) => {
      const { onError, onSettled, onSuccess, throwError = false } = options;
      try {
        setIsPending(true);
        setError(null);
        setData(null);
        const response = await mutation(values);
        if (response === null) throw new Error("Failed to update workspace");
        setData(response);
        onSuccess?.(response);
      } catch (error) {
        if (throwError) throw error;
        const err = error as Error;
        setError(err);
        onError?.(err);
      } finally {
        onSettled?.();
        setIsPending(false);
      }
    },
    [mutation, setData]
  );
  return { mutate, isPending, data, error };
}
