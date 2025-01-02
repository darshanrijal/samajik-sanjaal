"use client";
import { useFollowerInfo } from "@/hooks/use-follower-info";
import type { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

export const FollowerCount = ({ initialState, userId }: FollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span className="text-foreground">
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
};
