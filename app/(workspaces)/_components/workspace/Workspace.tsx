"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import { useGetChannels } from "@/core/channels/services";
import { useCurrentMember } from "@/core/members/services";
import { useWorkspaceId } from "../../_hooks";
import { useCreateChannelModal } from "../../_stores";
import styles from "./Styles.module.css";
import StartingLoader from "../loader/StartingLoader";
import { CustomAlert } from "@/shared/components";
import { TriangleAlert } from "lucide-react";

function Workspace() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [state, setState] = useCreateChannelModal();

  const { workspace, isLoading: isLoadingWorkspace } = useGetOneWorkspace(workspaceId);
  const { channels, isLoading: isLoadingChannels } = useGetChannels(workspaceId);
  const { member, isLoading: isLoadingMember } = useCurrentMember(workspaceId);

  const createNewChannel = (workspaceId: string): void => {
    if (!state.isOpen) {
      if (member?.role === "admin") setState({ isOpen: true, workspaceId: workspaceId });
    }
  };

  const redirectToChannel = (workspaceId: string, channelId: string): void => {
    router.replace(`/workspaces/${workspaceId}/channels/${channelId}`);
  };

  useEffect(() => {
    if (isLoadingWorkspace || isLoadingChannels || isLoadingMember) return;
    if (workspace && channels.length === 0) createNewChannel(workspace._id);
    if (workspace && channels.length > 0) redirectToChannel(workspace._id, channels[0]._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, isLoadingWorkspace, isLoadingChannels, workspace, state.isOpen]);

  if (isLoadingWorkspace || isLoadingChannels || isLoadingMember) return <StartingLoader />;

  return (
    <>
      {member?.role === "member" && (
        <div className={styles["container-message"]}>
          <CustomAlert
            variant="destructive"
            icon={<TriangleAlert />}
            title="Error"
            description="Channel does not exist"
          />
        </div>
      )}
    </>
  );
}
export default Workspace;
