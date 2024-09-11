"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { formatNumber } from "@/lib/utils";
import { FollowerInfo } from "@/types";
import React from "react";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowerCount: React.FC<FollowerCountProps> = ({
  initialState,
  userId,
}) => {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
};

export default FollowerCount;
