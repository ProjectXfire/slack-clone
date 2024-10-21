import { useParams } from "next/navigation";

type Params = { memberId: string };

export function useMemberId() {
  const params = useParams<Params>();

  return params.memberId as string;
}
