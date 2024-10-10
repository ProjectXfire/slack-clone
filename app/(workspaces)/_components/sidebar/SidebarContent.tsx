"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useCurrentMember, useGetMembers } from "@/core/members/services";
import { useGetOneWorkspace } from "@/core/workspaces/services";
import { useGetChannels } from "@/core/channels/services";
import { useCreateChannelModal } from "../../_stores";
import { useChannelId, useWorkspaceId } from "../../_hooks";
import styles from "./Sidebar.module.css";
import { AlertTriangle, HashIcon, MessageSquareText, SendHorizonal } from "lucide-react";
import { CustomAlert, Loader } from "@/shared/components";
import SidebarContentHeader from "./SidebarContentHeader";
import SidebarItem from "./SidebarItem";
import WorkspaceSection from "../containers/WorkspaceSection";
import SidebarMember from "./SidebarMember";

function SidebarContent(): JSX.Element {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [, setState] = useCreateChannelModal();

  const { response: responseWorkspace } = useGetOneWorkspace(workspaceId);
  const { response: responseMember } = useCurrentMember(workspaceId);
  const { response: responseChannels } = useGetChannels(workspaceId);
  const { response: responseMembers } = useGetMembers(workspaceId);

  const onOpenCreateChannelModal = (): void => {
    if (responseMember?.data?.role === "admin") setState({ workspaceId, isOpen: true });
  };

  if (
    responseWorkspace === undefined ||
    responseMember === undefined ||
    responseChannels === undefined ||
    responseMembers === undefined
  )
    return (
      <div className={styles["sidebar-content-center"]}>
        <Loader size={30} />
      </div>
    );

  if (
    responseWorkspace?.isError ||
    responseMember?.isError ||
    responseChannels?.isError ||
    responseMembers?.isError
  )
    redirect("/");

  if (responseWorkspace?.data === null || responseMember?.data === null)
    return (
      <div className={styles["sidebar-content"]}>
        <div className={`${styles["sidebar-content-center"]}`}>
          <CustomAlert
            description="Failed to load data"
            title={"Error"}
            variant="destructive"
            icon={<AlertTriangle />}
          />
        </div>
      </div>
    );

  return (
    <div className={styles["sidebar-content"]}>
      <div>
        <SidebarContentHeader
          workspace={responseWorkspace.data!}
          isAdmin={responseMember.data!.role === "admin"}
        />
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts-sent" />
        <WorkspaceSection
          label="Channels"
          hint="New channel"
          hideOnNew={responseMember?.data.role === "member"}
          onNew={onOpenCreateChannelModal}
        >
          {responseChannels?.data.map((item) => (
            <SidebarItem
              key={item._id}
              icon={HashIcon}
              label={item.name}
              id={item._id}
              isActive={channelId === item._id}
            />
          ))}
        </WorkspaceSection>
        <WorkspaceSection label="Direct Messages" hint="New direct message" onNew={() => {}}>
          {responseMembers?.data.map((item) => (
            <SidebarMember
              key={item._id}
              image={item.user?.image}
              label={item.user?.name ?? ""}
              userId={item.userId}
            />
          ))}
        </WorkspaceSection>
      </div>
    </div>
  );
}
export default SidebarContent;
