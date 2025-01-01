"use client";
import { trpc } from "@/__rpc/react";
import { changeFollowerInfo } from "@/app/(main)/actions";
import { useFollowerInfo } from "@/hooks/use-follower-info";
import { toast } from "@/hooks/use-toast";
import type { FollowerInfo } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export const FollowButton = ({ initialState, userId }: FollowButtonProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  const utils = trpc.useUtils();

  const { mutate } = useMutation({
    mutationFn: () => changeFollowerInfo(data.isFollowedByUser, userId),
    onMutate: async () => {
      await utils.users.getFollowerInfo.cancel({ userId });
      const prevState = utils.users.getFollowerInfo.getData({ userId });
      utils.users.getFollowerInfo.setData(
        { userId },
        {
          followers:
            (prevState?.followers ?? 0) +
            (prevState?.isFollowedByUser ? -1 : 1),
          isFollowedByUser: !prevState?.isFollowedByUser,
        }
      );
      return { prevState };
    },
    onError(_error, _variables, context) {
      utils.users.getFollowerInfo.setData({ userId }, context?.prevState);
      toast({
        variant: "destructive",
        description: "Failed to update follower info",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
};
