import { getCurrentSession } from "@/auth";
import { FollowButton } from "@/components/follow-button";
import { FollowerCount } from "@/components/follower-count";
import { Linkify } from "@/components/linkify";
import { TrendsSidebar } from "@/components/trends-sidebar";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { db } from "@/lib/prisma";
import {
  type FollowerInfo,
  type UserData,
  getUserDataSelect,
} from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { UserPosts } from "./user-posts";

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await db.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });
  if (!user) {
    notFound();
  }
  return user;
});

export async function generateMetadata({
  params,
}: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { user: loggedInUser } = await getCurrentSession();
  if (!loggedInUser) {
    return {};
  }

  const { username } = await params;

  const user = await getUser(username, loggedInUser.id);
  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({
  params,
}: { params: Promise<{ username: string }> }) {
  const { user: loggedInUser } = await getCurrentSession();
  if (!loggedInUser) {
    redirect("/login");
  }
  const { username } = await params;

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />

        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center font-bold text-2xl">
            {user.displayName}'s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>

      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="font-bold text-3xl">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
