import { trpc } from "@/__rpc/react";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { deleteComment, submitComment } from "./actions";

export function useSubmitCommentMutation(postId: string) {
  const utils = trpc.useUtils();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      await utils.comments.getComments.cancel();

      utils.comments.getComments.setInfiniteData({ postId }, (oldData) => {
        const firstPage = oldData?.pages?.[0];

        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                prevCursor: firstPage.prevCursor,
                comments: [...firstPage.comments, newComment],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }

        utils.comments.getComments.invalidate(
          { postId },
          {
            predicate(q) {
              return !q.state.data;
            },
          }
        );

        toast({ description: "Comment submitted" });
      });
    },
    onError() {
      toast({
        variant: "destructive",
        description: "Failed to submit comment, Please try again",
      });
    },
  });

  return mutation;
}

export function useDeleteCommentMutation() {
  const utils = trpc.useUtils();
  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      await utils.comments.getComments.cancel({
        postId: deletedComment.postId,
      });
      utils.comments.getComments.setInfiniteData(
        { postId: deletedComment.postId },
        (oldData) => {
          if (!oldData) {
            return;
          }

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              prevCursor: page.prevCursor,
              comments: page.comments.filter(
                (comment) => comment.id !== deletedComment.id
              ),
            })),
          };
        }
      );

      toast({ description: "Comment deleted" });
    },

    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to delete comment",
      });
    },
  });
  return mutation;
}
