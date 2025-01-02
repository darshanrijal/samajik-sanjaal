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

export async function changeLikeInfo(isLikedByUser: boolean, postId: string) {
  return isLikedByUser
    ? await api.posts.deleteLike({ postId })
    : await api.posts.createLike({ postId });
}

export async function changeBookmarkInfo(
  isBookmarkedByUser: boolean,
  postId: string
) {
  return isBookmarkedByUser
    ? await api.posts.deleteBookmark({ postId })
    : await api.posts.createBookmark({ postId });
}
