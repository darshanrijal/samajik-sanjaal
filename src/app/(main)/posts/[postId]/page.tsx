import { getCurrentSession } from "@/auth";
import { FollowButton } from "@/components/follow-button";
import { Linkify } from "@/components/linkify";
import { Post } from "@/components/posts/post";
import { UserAvatar } from "@/components/user-avatar";
import { UserTooltip } from "@/components/user-tooltip";
import { db } from "@/lib/prisma";
import { type UserData, getPostDataInclude } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense, cache } from "react";

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) {
    notFound();
  }

  return post;
});

export async function generateMetadata({
  params,
}: { params: Promise<{ postId: string }> }): Promise<Metadata> {
  const { user } = await getCurrentSession();
  if (!user) {
    return {};
  }

  const { postId } = await params;

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}${post.content.length > 50 ? "...." : ""}`,
  };
}

export default async function Page({
  params,
}: { params: Promise<{ postId: string }> }) {
  const { user } = await getCurrentSession();
  if (!user) {
    redirect("/login");
  }

  const { postId } = await params;

  const post = await getPost(postId, user.id);
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>

      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await getCurrentSession();
  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="font-bold text-xl">About this user</div>

      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />

          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>

            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>

      <Linkify>
        <p className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </p>
      </Linkify>

      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id
            ),
          }}
        />
      )}
    </div>
  );
}
