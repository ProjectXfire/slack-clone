"use client";

import type { CreateWorkspaceDto } from "../../_dtos";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWorkspaceModal } from "../../_stores";
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
import { createWorkspaceSchema } from "../../_schemas";
import { useCreateWorkspace } from "../../_services";
import { useToast } from "@/shared/hooks/use-toast";

function CreateWorkspace(): JSX.Element {
  const [openModal, setOpenModal] = useCreateWorkspaceModal();
  const { mutate, isPending } = useCreateWorkspace();
  const { toast } = useToast();

  const form = useForm<CreateWorkspaceDto>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (createWorkspaceDto: CreateWorkspaceDto): void => {
    const { name } = createWorkspaceDto;
    mutate(
      { name },
      {
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
            duration: 2000,
          });
        },
        onSuccess: () => {
          handleClose();
          toast({
            variant: "default",
            title: "Workspace",
            description: "Successful workspace created",
            duration: 2000,
          });
        },
      }
    );
  };

  const handleClose = (): void => {
    setOpenModal(false);
  };

  return (
    <Dialog open={openModal} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to start a simpler way to chat and collaborate.
          </DialogDescription>
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
                      placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={styles["dialog-form__action"]}>
              <Button type="submit" name="create-workspace" disabled={isPending}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
export default CreateWorkspace;
