import { trpc } from "@/__rpc/react";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { submitPost } from "./actions";

export function useSubmitPostMutation() {
  const utils = trpc.useUtils();
  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      await utils.posts.getForYouPosts.cancel();
      utils.posts.getForYouPosts.setInfiniteData({}, (oldData) => {
        const firstPage = oldData?.pages[0];
        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                nextCursor: firstPage.nextCursor,
                posts: [newPost, ...firstPage.posts],
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });

      utils.posts.getForYouPosts.invalidate(undefined, {
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({ description: "Post created" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to post. Please try again",
      });
    },
  });
  return mutation;
}
