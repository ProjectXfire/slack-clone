import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useGetMessage(id: string) {
  const response = useQuery(api.messages.getOne, { id });

  const isLoading = response === undefined;

  return { response, isLoading };
}
