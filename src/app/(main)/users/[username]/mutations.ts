import { trpc } from "@/__rpc/react";
import { toast } from "@/hooks/use-toast";
import type { PostPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import type { UpdateUserProfileValues } from "@/lib/validation";
import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";

export function useUpdateUserProfileMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: ({
      values,
      avatar,
    }: { values: UpdateUserProfileValues; avatar?: File }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;
      const queryKey = getQueryKey(trpc.posts);
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
        { queryKey },
        (oldData) => {
          if (!oldData) {
            return;
          }
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      router.refresh();

      toast({ description: "Profile updated" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Failed to update profile, Please try again",
      });
    },
  });

  return mutation;
}
