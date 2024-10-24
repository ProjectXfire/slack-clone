"use client";

import { redirect } from "next/navigation";
import { useGetChannel } from "@/core/channels/services";
import { useChannelId } from "@/app/(workspaces)/_hooks";
import {
  ChannelHeader,
  ChatInput,
  MessageList,
  MessagesContent,
  StartingLoader,
} from "@/app/(workspaces)/_components";
import { useGetMessages } from "@/core/messages/services";

function ChannelPage() {
  const channelId = useChannelId();

  const { resp } = useGetChannel(channelId);
  const { results, status, loadMore } = useGetMessages({ channelId });

  if (resp === undefined || status === "LoadingFirstPage") return <StartingLoader />;
  if (!resp.isError && !resp.data) return redirect("/");
  if (resp.isError) redirect("/error");

  return (
    <MessagesContent>
      <ChannelHeader
        title={resp.data!.name}
        channelId={resp.data!._id}
        workspaceId={resp.data!.workspaceId}
      />
      <MessageList
        channelName={resp.data!.name}
        channelCreationTime={resp.data!._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput placeholder={`Message #${resp.data?.name}`} />
    </MessagesContent>
  );
}
export default ChannelPage;
