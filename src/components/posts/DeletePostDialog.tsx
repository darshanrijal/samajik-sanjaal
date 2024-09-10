import { PostData } from "@/lib/types";
import React from "react";
import { useDeletePost } from "./mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

const DeletePostDialog = ({ onClose, open, post }: DeletePostDialogProps) => {
  const mutation = useDeletePost();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to delte this
            post?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            isLoading={mutation.isPending}
            variant={"destructive"}
            onClick={() =>
              mutation.mutate(post.id, {
                onSuccess: onClose,
              })
            }
          >
            Delete
          </LoadingButton>
          <Button
            variant={"outline"}
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
