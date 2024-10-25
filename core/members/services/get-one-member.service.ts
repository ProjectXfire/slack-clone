import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function useGetMember(memberId: string) {
  const response = useQuery(api.members.getOne, { id: memberId });

  const isLoading = response === undefined;

  return { response, isLoading };
}
