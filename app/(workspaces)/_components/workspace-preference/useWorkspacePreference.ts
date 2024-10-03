import { ChangeEvent, useState } from "react";
import { useDeleteWorkspace, useUpdateWorkspace } from "@/core/workspaces/services";
import { usePreferenceWorkspaceModal } from "../../_stores";
import { useToast } from "@/shared/hooks";

export function useWorkspacePreference() {
  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateWorkspace();
  const { mutate: mutateRemove, isPending: isPendingRemove } = useDeleteWorkspace();
  const { toast } = useToast();

  const [state, setState] = usePreferenceWorkspaceModal();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(state.initValue);

  const onOpenChange = (value: boolean): void => {
    setState({ initValue: "", workspaceId: undefined, isOpen: value });
    setIsEditing(false);
    setOpenConfirmModal(value);
  };

  const onOpenConfirm = (): void => {
    setOpenConfirmModal(true);
  };

  const handleEditing = (): void => {
    const value = !isEditing;
    if (value) setWorkspaceName(state.initValue);
    setIsEditing(value);
  };

  const onChangeWorkspaceName = (e: ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value);
  };

  const onUpdateName = (): void => {
    const workspaceId = state.workspaceId;
    if (!workspaceId) return;
    if (!workspaceName || workspaceName.length < 3) {
      toast({
        variant: "destructive",
        title: "Workspace",
        description: "Name is required an should have at least 3 characters",
        duration: 3000,
      });
      return;
    }
    mutateUpdate(
      { workspaceId, name: workspaceName },
      {
        onError: () => {
          toast({
            variant: "destructive",
            title: "Workspace",
            description: "Failed to update workspace",
            duration: 2000,
          });
        },
        onSuccess: () => {
          toast({
            title: "Workspace",
            description: "Workspace name successfully updated",
            duration: 2000,
          });
          setIsEditing(false);
          onOpenChange(false);
        },
      }
    );
  };

  const onRemove = (): void => {
    const workspaceId = state.workspaceId;
    if (!workspaceId) return;
    mutateRemove(
      { workspaceId },
      {
        onError: () => {
          toast({
            variant: "destructive",
            title: "Workspace",
            description: "Failed to delete workspace",
            duration: 2000,
          });
          setOpenConfirmModal(false);
        },
        onSuccess: () => {
          onOpenChange(false);
          toast({
            title: "Workspace",
            description: "Workspace successfully removed",
            duration: 2000,
          });
        },
      }
    );
  };

  return {
    state,
    isEditing,
    isPendingUpdate,
    isPendingRemove,
    openConfirmModal,
    workspaceName,
    setState,
    onOpenConfirm,
    handleEditing,
    onChangeWorkspaceName,
    onUpdateName,
    onRemove,
    setOpenConfirmModal,
    onOpenChange,
  };
}
