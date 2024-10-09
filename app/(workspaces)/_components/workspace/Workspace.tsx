"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import { useGetChannels } from "@/core/channels/services";
import { useWorkspaceId } from "../../_hooks";
import { useCreateChannelModal } from "../../_stores";
import StartingLoader from "../loader/StartingLoader";

function Workspace() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [state, setState] = useCreateChannelModal();

  const { workspace, isLoading: isLoadingWorkspace } = useGetOneWorkspace(workspaceId);
  const { channels, isLoading: isLoadingChannels } = useGetChannels(workspaceId);

  const createNewChannel = (workspaceId: string): void => {
    if (!state.isOpen) {
      setState({ isOpen: true, workspaceId: workspaceId });
    }
  };

  const redirectToChannel = (workspaceId: string, channelId: string): void => {
    router.replace(`/workspaces/${workspaceId}/channels/${channelId}`);
  };

  useEffect(() => {
    if (isLoadingWorkspace || isLoadingChannels) return;
    if (workspace && channels.length === 0) createNewChannel(workspace._id);
    if (workspace && channels.length > 0) redirectToChannel(workspace._id, channels[0]._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, isLoadingWorkspace, isLoadingChannels, workspace, state.isOpen]);

  return <StartingLoader />;
}
export default Workspace;
