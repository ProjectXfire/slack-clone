"use client";

import { useGetChannel } from "@/core/channels/services";
import { useChannelId } from "@/app/(workspaces)/_hooks";
import { ChannelHeader, StartingLoader } from "@/app/(workspaces)/_components";
import { redirect } from "next/navigation";

function ChannelPage() {
  const channelId = useChannelId();

  const { resp } = useGetChannel(channelId);

  if (resp === undefined) return <StartingLoader />;
  if (!resp.isError && !resp.data) return redirect("/");
  if (resp.isError) redirect("/error");

  return (
    <ChannelHeader
      title={resp.data!.name}
      channelId={resp.data!._id}
      workspaceId={resp.data!.workspaceId}
    />
  );
}
export default ChannelPage;
