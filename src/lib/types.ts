import type { SessionValidationResult } from "@/auth";
import type { Prisma } from "@prisma/client";

export type SessionUser = NonNullable<SessionValidationResult["user"]>;
export type DBSession = NonNullable<SessionValidationResult["session"]>;

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    bio: true,
    createdAt: true,
    displayName: true,
    avatarUrl: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
        posts: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export type FollowerInfo = {
  followers: number;
  isFollowedByUser: boolean;
};

export type PostPage = {
  posts: PostData[];
  nextCursor: string | null;
};
