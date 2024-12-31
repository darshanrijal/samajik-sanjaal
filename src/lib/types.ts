import type { SessionValidationResult } from "@/auth";
import type { Prisma } from "@prisma/client";

export type SessionUser = NonNullable<SessionValidationResult["user"]>;
export type DBSession = NonNullable<SessionValidationResult["session"]>;

export const userDataSelect = {
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const postDataInclude = {
  user: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
