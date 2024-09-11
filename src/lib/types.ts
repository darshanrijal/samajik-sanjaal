import { Prisma } from "@prisma/client";

/**
 *
 * @param loggedInUserId The logged in user's id
 * @returns Data of the user including followers and count of followers
 */
export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

/**
 *
 * @param loggedInUserId The logged in user's id
 * @returns Prisma user with the type User including followers and count of followers
 */
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
