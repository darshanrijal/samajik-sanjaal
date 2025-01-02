"use client";

import { trpc } from "@/__rpc/react";
import { changeBookmarkInfo } from "@/app/(main)/actions";
import { toast } from "@/hooks/use-toast";
import type { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { BookmarkIcon } from "lucide-react";

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export const BookmarkButton = ({
  initialState,
  postId,
}: BookmarkButtonProps) => {
  const utils = trpc.useUtils();

  const { data } = trpc.posts.getBookmarkInfo.useQuery(
    { postId },
    {
      staleTime: Number.POSITIVE_INFINITY,
      initialData: initialState,
    }
  );

  const { mutate } = useMutation({
    mutationFn: () => changeBookmarkInfo(data.isBookmarkedByUser, postId),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`,
      });
      await utils.posts.getBookmarkInfo.cancel({ postId });
      const prevState = utils.posts.getBookmarkInfo.getData({ postId });
      utils.posts.getBookmarkInfo.setData(
        { postId },
        {
          isBookmarkedByUser: !prevState?.isBookmarkedByUser,
        }
      );

      return { prevState };
    },

    onError(_error, _v, context) {
      utils.posts.getBookmarkInfo.setData({ postId }, context?.prevState);
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
      <BookmarkIcon
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary"
        )}
      />
    </button>
  );
};
