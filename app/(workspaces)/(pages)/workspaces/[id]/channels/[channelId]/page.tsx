"use client";

import { redirect } from "next/navigation";
import { useGetChannel } from "@/core/channels/services";
import { useChannelId } from "@/app/(workspaces)/_hooks";
import { ChannelHeader, ChatInput, StartingLoader } from "@/app/(workspaces)/_components";

function ChannelPage() {
  const channelId = useChannelId();

  const { resp } = useGetChannel(channelId);

  if (resp === undefined) return <StartingLoader />;
  if (!resp.isError && !resp.data) return redirect("/");
  if (resp.isError) redirect("/error");

  return (
    <>
      <ChannelHeader
        title={resp.data!.name}
        channelId={resp.data!._id}
        workspaceId={resp.data!.workspaceId}
      />
      <ChatInput placeholder={`Message #${resp.data?.name}`} />
    </>
  );
}
export default ChannelPage;
