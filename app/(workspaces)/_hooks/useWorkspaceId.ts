import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

type Params = { id: string };

export function useWorkspaceId() {
  const params = useParams<Params>();

  return params.id as Id<"workspaces">;
}
