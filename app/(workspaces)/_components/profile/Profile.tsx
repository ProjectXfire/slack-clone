"use client";

import NextLink from "next/link";

import { useWorkspaceId } from "../../_hooks";
import { formatName } from "@/shared/utils";
import { useToast } from "@/shared/hooks";
import styles from "./Styles.module.css";
import { ChevronDown, Mail, X } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  Separator,
  useConfirm,
} from "@/shared/components";
import {
  useCurrentMember,
  useDeleteMember,
  useGetMember,
  useUpdateMember,
} from "@/core/members/services";
import StartingLoader from "../loader/StartingLoader";
import WorkspaceContentError from "../content-error/WorkspaceContentError";

interface Props {
  memberId: string;
  onClose: () => void;
  onDelete?: () => void;
}

function Profile({ onClose, memberId, onDelete }: Props): JSX.Element {
  const workspaceId = useWorkspaceId();
  const { toast } = useToast();

  const [ChangeRoleConfirm, confirmChangeRole] = useConfirm({
    title: "Change role",
    message: "This action cannot be undo, are you sure?",
  });

  const [DeleteConfirm, confirmDelete] = useConfirm({
    title: "Remove member",
    message: "Are you sure to remove this member from this workspace?",
  });

  const [LeaveConfirm, confirmLeave] = useConfirm({
    title: "Leave workspace",
    message: "Are you sure you want to leave this workspace?",
  });

  const { response: member } = useGetMember(memberId);
  const { response: currentMember } = useCurrentMember(workspaceId);
  const { isPending: isUpdatingMember, mutate: mutateUpdate } = useUpdateMember();
  const { isPending: isRemovingMember, mutate: mutateRemove } = useDeleteMember();

  const isLoading = member === undefined || currentMember === undefined;
  const isPending = isUpdatingMember || isRemovingMember;

  const onChangeRole = async (value: string): Promise<void> => {
    const role = value as "admin" | "member";
    const ok = await confirmChangeRole();
    if (!ok) return;
    mutateUpdate(
      { id: memberId, role },
      {
        onError: (err) => {
          toast({
            title: "Member",
            variant: "destructive",
            description: err,
            duration: 3000,
          });
        },
        onSuccess: ({ message }) => {
          toast({
            title: "Member",
            description: message,
            duration: 3000,
          });
        },
      }
    );
  };

  const onLeaveWorkspace = async (): Promise<void> => {
    const ok = await confirmLeave();
    if (!ok) return;
    mutateRemove(
      { id: memberId },
      {
        onError: (err) => {
          toast({
            title: "Member",
            variant: "destructive",
            description: err,
            duration: 3000,
          });
        },
        onSuccess: () => {
          toast({
            title: "Member",
            description: "You leave the workspace",
            duration: 3000,
          });
          if (onDelete) onDelete();
        },
      }
    );
  };

  const onRemoveMember = async (): Promise<void> => {
    const ok = await confirmDelete();
    if (!ok) return;
    mutateRemove(
      { id: memberId },
      {
        onError: (err) => {
          toast({
            title: "Member",
            variant: "destructive",
            description: err,
            duration: 3000,
          });
        },
        onSuccess: ({ message }) => {
          toast({
            title: "Member",
            description: message,
            duration: 3000,
          });
          onClose();
        },
      }
    );
  };

  return (
    <>
      <DeleteConfirm />
      <ChangeRoleConfirm />
      <LeaveConfirm />
      <div className={styles["profile-header"]}>
        <div className={styles["profile-header__content"]}>
          <p>Profile</p>
          <Button variant="ghost" type="button" name="close-profile" onClick={onClose}>
            <X />
          </Button>
        </div>
        <Separator />
      </div>
      {isLoading ? (
        <StartingLoader reduceHeightIn={100} />
      ) : (
        <>
          {member.isError || currentMember.isError ? (
            <WorkspaceContentError description={member.message} reduceHeightIn={100} />
          ) : (
            <div className={styles["profile-body"]}>
              <div className={styles["profile-body__avatar"]}>
                <Avatar className={styles["profile-body__avatar-image"]}>
                  <AvatarImage src={member.data!.user.image} />
                  <AvatarFallback>
                    <p className={styles["profile-body__avatar-image"]}>
                      {formatName(member.data!.user.name ?? "MB")}
                    </p>
                  </AvatarFallback>
                </Avatar>
                <p>{member.data!.user.name}</p>
                {currentMember.data!._id !== memberId && currentMember.data!.role === "admin" && (
                  <div className={styles["profile-body__avatar-settings"]}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" type="button" size="sm" disabled={isPending}>
                          {member.data!.role} <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuRadioGroup onValueChange={onChangeRole}>
                          <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="destructive"
                      type="button"
                      size="sm"
                      disabled={isPending}
                      onClick={onRemoveMember}
                    >
                      Delete
                    </Button>
                  </div>
                )}
                {currentMember.data!._id === memberId && currentMember.data!.role !== "admin" && (
                  <div className={styles["profile-body__avatar-settings"]}>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={onLeaveWorkspace}
                    >
                      Leave
                    </Button>
                  </div>
                )}
              </div>
              <Separator />
              <div className={styles["profile-body__information"]}>
                <p>Contact information</p>
                <div className={styles["profile-info"]}>
                  <div className={styles["profile-info__icon"]}>
                    <Mail />
                  </div>
                  <div className={styles["profile-info__text"]}>
                    <p>Email Address</p>
                    <NextLink href={`mailto:${member.data!.user.email}`}>
                      {member.data!.user.email}
                    </NextLink>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
export default Profile;
