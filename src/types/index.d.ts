import { getUserDataSelect, PostData } from "@/lib/types";
import { Prisma } from "@prisma/client";

declare interface ActionResult {
  error: string;
}

declare interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

declare interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

declare type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

/**
 * Returns the following attributes from google oauth consent
 */
declare type GoogleUserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
};
