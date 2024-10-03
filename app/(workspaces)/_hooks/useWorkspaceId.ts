import { useParams } from "next/navigation";

type Params = { id: string };

export function useWorkspaceId() {
  const params = useParams<Params>();

  return params.id as string;
}
