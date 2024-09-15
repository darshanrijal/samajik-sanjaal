import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";
import Post from "@/components/posts/Post";
import UserAvatar from "@/components/UserAvatar";
import UserTooltip from "@/components/UserTooltip";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { UserData } from "@/types";
import { Loader2 } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { cache, Suspense } from "react";

interface PageProps {
  params: { postId: string };
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) {
    notFound();
  }
  return post;
});

export async function generateMetadata({
  params: { postId },
}: PageProps): Promise<Metadata> {
  const { user } = await validateRequest();
  if (!user) {
    return {};
  }

  const post = await getPost(postId, user.id);
  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function page({ params: { postId } }: PageProps) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return (
      <p className="flex flex-col gap-2 text-destructive">
        You&apos;re not logged in
        <Link
          href={"/login"}
          className="underline-offset-2 transition-colors hover:text-muted-foreground hover:underline"
        >
          Login to view this page
        </Link>
      </p>
    );
  }

  const post = await getPost(postId, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit flex-none space-y-5 sm:w-72 md:block lg:w-80">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
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
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return null;
  }
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
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
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
}
