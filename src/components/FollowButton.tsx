"use client";
import { useToast } from "@/hooks/use-toast";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowButton = ({ initialState, userId }: FollowButtonProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  const queryKey: QueryKey = ["follower-info", userId];
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<FollowerInfo>(queryKey);
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (prevState?.followers || 0) + (prevState?.isFollowedByUser ? -1 : +1),
        isFollowedByUser: !prevState?.isFollowedByUser,
      }));
      return { prevState, queryKey };
    },

    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.prevState);
      console.log(error);
      toast({
        variant: "destructive",
        description: "Something went wrong, Please try again",
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

export default FollowButton;
