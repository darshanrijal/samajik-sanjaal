"use server";

import { api } from "@/__rpc/server";

export async function changeFollowerInfo(
  isFollowedByUser: boolean,
  userId: string
) {
  return isFollowedByUser
    ? await api.users.deleteFollower({ userId })
    : await api.users.createFollower({ userId });
}
