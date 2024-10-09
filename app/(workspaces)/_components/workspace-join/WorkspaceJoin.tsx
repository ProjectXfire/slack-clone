"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useCreateMember } from "@/core/members/services";
import { useWorkspaceId } from "../../_hooks";
import styles from "./Styles.module.css";
import VerificationInput from "react-verification-input";
import { Button, Loader } from "@/shared/components";
import { useGetWorkspaceInfo } from "@/core/workspaces/services";
import { useToast } from "@/shared/hooks";

function WorkspaceJoin(): JSX.Element {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { toast } = useToast();

  const { workspaceInfo, isLoading, error } = useGetWorkspaceInfo(workspaceId);
  const { isPending, mutate } = useCreateMember();

  const [value, setValue] = useState("");

  const onComplete = (): void => {
    if (value.length < 6) return;
    mutate(
      { joinCode: value, workspaceId },
      {
        onError: () => {
          toast({
            variant: "destructive",
            description: "Failed to join workspace",
            duration: 2000,
          });
        },
        onSuccess: (data) => {
          if (data.isMember) {
            toast({
              variant: "destructive",
              description: "You are alraedy joined to this workspace",
              duration: 2000,
            });
            router.replace(`/workspaces/${data.workspaceId}`);
          } else {
            toast({ description: "Workspace joined", duration: 2000 });
            router.replace(`/workspaces/${data.workspaceId}`);
          }
        },
      }
    );
  };

  const onBack = (): void => {
    router.replace("/");
  };

  if (isLoading) return <Loader size={50} />;

  if (error) redirect("/");

  return (
    <div className={styles.container}>
      <div>
        <p>Join to {workspaceInfo?.name}</p>
        <p>Enter the workspace code to join</p>
      </div>
      <VerificationInput
        classNames={{
          container: `${isPending && styles["code-block-container"]}`,
          character: styles["code-block"],
          characterSelected: styles["code-block--active"],
          characterInactive: styles["code-block--inactive"],
        }}
        autoFocus
        length={6}
        value={value}
        onChange={setValue}
      />
      <div className={styles.actions}>
        <Button disabled={isPending} onClick={onBack}>
          Back home
        </Button>
        <Button variant="outline" disabled={isPending} onClick={onComplete}>
          Send code
        </Button>
      </div>
    </div>
  );
}
export default WorkspaceJoin;
