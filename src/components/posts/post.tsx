"use client";
import { useSession } from "@/hooks/use-session";
import type { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import type { Media } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Linkify } from "../linkify";
import { UserAvatar } from "../user-avatar";
import { UserTooltip } from "../user-tooltip";
import { LikeButton } from "./like-button";
import { PostMoreButton } from "./post-more-button";

interface PostProps {
  post: PostData;
}

export const Post = ({ post }: PostProps) => {
  const { user } = useSession();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-muted-foreground text-sm hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>

      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <LikeButton
        postId={post.id}
        initialState={{
          likes: post._count.likes,
          isLikedByUser: post.likes.some(({ userId }) => user.id === userId),
        }}
      />
    </article>
  );
};

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2"
      )}
    >
      {attachments.map((media) => (
        <MediaPreview key={media.id} media={media} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "PHOTO") {
    return (
      <Image
        src={media.url}
        alt="attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}
