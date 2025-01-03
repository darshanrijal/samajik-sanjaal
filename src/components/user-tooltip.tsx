"use client";

import { useSession } from "@/hooks/use-session";
import type { FollowerInfo, UserData } from "@/lib/types";
import Link from "next/link";
import { FollowButton } from "./follow-button";
import { FollowerCount } from "./follower-count";
import { Linkify } from "./linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { UserAvatar } from "./user-avatar";

interface UserTooltipProps extends React.PropsWithChildren {
  user: UserData;
}

export const UserTooltip = ({ user, children }: UserTooltipProps) => {
  const { user: loggedInUser } = useSession();
  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id
    ),
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-card shadow-sm ring-2 ring-muted">
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar avatarUrl={user.avatarUrl} size={70} />
              </Link>

              {loggedInUser.id !== user.id && (
                <FollowButton initialState={followerState} userId={user.id} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <p className="font-semibold text-card-foreground text-lg hover:underline">
                  {user.displayName}
                </p>
                <p className="text-muted-foreground">@{user.username}</p>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <p className="line-clamp-4 whitespace-pre-line text-card-foreground">
                  {user.bio}
                </p>
              </Linkify>
            )}

            <FollowerCount initialState={followerState} userId={user.id} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
