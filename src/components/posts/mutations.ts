import { trpc } from "@/__rpc/react";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";

export function useDeletePostMutation() {
  const utils = trpc.useUtils();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      await utils.posts.getForYouPosts.cancel();
      utils.posts.getForYouPosts.setInfiniteData({}, (oldData) => {
        if (!oldData) {
          return;
        }

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            posts: page.posts.filter((post) => post.id !== deletedPost.id),
          })),
        };
      });

      toast({ description: "Post deleted" });

      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
    onError: () => {
      toast({ variant: "destructive", description: "Failed to delete post" });
    },
  });

  return mutation;
}
