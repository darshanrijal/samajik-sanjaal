"use client";

import { trpc } from "@/__rpc/react";
import { changeLikeInfo } from "@/app/(main)/actions";
import { toast } from "@/hooks/use-toast";
import type { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export const LikeButton = ({ initialState, postId }: LikeButtonProps) => {
  const utils = trpc.useUtils();

  const { data } = trpc.posts.getPostLikes.useQuery(
    { postId },
    {
      staleTime: Number.POSITIVE_INFINITY,
      initialData: initialState,
    }
  );

  const { mutate } = useMutation({
    mutationFn: () => changeLikeInfo(data.isLikedByUser, postId),
    onMutate: async () => {
      await utils.posts.getPostLikes.cancel({ postId });
      const prevState = utils.posts.getPostLikes.getData({ postId });
      utils.posts.getPostLikes.setData(
        { postId },
        {
          isLikedByUser: !prevState?.isLikedByUser,
          likes: (prevState?.likes || 0) + (prevState?.isLikedByUser ? -1 : 1),
        }
      );

      return { prevState };
    },

    onError(_error, _v, context) {
      utils.posts.getPostLikes.setData({ postId }, context?.prevState);
      toast({
        variant: "destructive",
        description: "Failed to update like info",
      });
    },
  });
  return (
    <button
      type="button"
      onClick={() => mutate()}
      className="flex items-center gap-2"
    >
      <HeartIcon
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500"
        )}
      />
      <span className="font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
};
