"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import { useGetChannels } from "@/core/channels/services";
import { useCurrentMember } from "@/core/members/services";
import { useWorkspaceId } from "../../_hooks";
import { useCreateChannelModal } from "../../_stores";
import StartingLoader from "../loader/StartingLoader";

function Workspace() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [state, setState] = useCreateChannelModal();

  const { response: responseWorkspace } = useGetOneWorkspace(workspaceId);
  const { response: responseChannels } = useGetChannels(workspaceId);
  const { response: responseMember } = useCurrentMember(workspaceId);

  const createNewChannel = (workspaceId: string): void => {
    if (!state.isOpen) {
      if (responseMember?.data?.role === "admin")
        setState({ isOpen: true, workspaceId: workspaceId });
    }
  };

  const redirectToChannel = (workspaceId: string, channelId: string): void => {
    router.replace(`/workspaces/${workspaceId}/channels/${channelId}`);
  };

  useEffect(() => {
    if (
      responseWorkspace === undefined ||
      responseChannels === undefined ||
      responseMember === undefined
    )
      return;
    const { data: dataWorkspace } = responseWorkspace;
    const { data: dataChannels } = responseChannels;
    if (dataWorkspace && dataChannels.length === 0) createNewChannel(dataWorkspace._id);
    if (dataWorkspace && dataChannels.length > 0)
      redirectToChannel(dataWorkspace._id, dataChannels[0]._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseWorkspace, responseChannels, responseMember, state.isOpen]);

  if (
    responseWorkspace === undefined ||
    responseChannels === undefined ||
    responseMember === undefined
  )
    return <StartingLoader />;

  return <StartingLoader />;
}
export default Workspace;
