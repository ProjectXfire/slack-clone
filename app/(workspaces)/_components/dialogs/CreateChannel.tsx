"use client";

import type { CreateChannelDto } from "@/core/channels/dtos";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChannelSchema } from "../../_schemas";
import { useCreateChannel } from "@/core/channels/services";
import { useToast } from "@/shared/hooks/use-toast";
import { useCreateChannelModal } from "../../_stores";
import styles from "./Dialog.module.css";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
} from "@/shared/components";

function CreateChannel(): JSX.Element {
  const [state, setState] = useCreateChannelModal();
  const { mutate, isPending } = useCreateChannel();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CreateChannelDto>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (createWorkspaceDto: CreateChannelDto): void => {
    const { name } = createWorkspaceDto;
    if (!state.workspaceId) return;
    mutate(
      { name, workspaceId: state.workspaceId },
      {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
            duration: 2000,
          });
        },
        onSuccess: (data) => {
          router.push(`/workspaces/${state.workspaceId}/channels/${data}`);
          handleClose();
          toast({
            variant: "default",
            title: "Workspace",
            description: "Successful channel created",
            duration: 2000,
          });
          setState({ isOpen: false, workspaceId: "" });
        },
      }
    );
  };

  const handleClose = (): void => {
    setState({ isOpen: false, workspaceId: "" });
    form.reset();
  };

  return (
    <Dialog open={state.isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Channel</DialogTitle>
          <DialogDescription>Create a new channel to start new conversations.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className={styles["dialog-form"]} onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      autoFocus
                      minLength={3}
                      placeholder="Channel name e.g. 'Work', 'Personal', 'Home'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={styles["dialog-form__action"]}>
              <Button type="submit" name="create-channel" disabled={isPending}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
export default CreateChannel;
