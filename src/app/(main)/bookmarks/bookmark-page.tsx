"use client";

import { trpc } from "@/__rpc/react";
import { InfiniteScrollContainer } from "@/components/infinite-scroll-container";
import { Post } from "@/components/posts/post";
import { PostsLoadingSkeleton } from "@/components/posts/post-loading-skeleton";
import { Loader2 } from "lucide-react";

export const BookmarkPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    error,
  } = trpc.users.getUserBookmarks.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastpage) => lastpage.nextCursor,
      staleTime: 0.3,
    }
  );

  if (isPending) {
    return <PostsLoadingSkeleton />;
  }

  if (error) {
    return (
      <p className="text-center text-destructive">
        An error occured while fetching your bookmarks
      </p>
    );
  }
  const posts = data.pages.flatMap((page) => page.posts);

  if (!posts.length) {
    return (
      <p className="text-center text-muted-foreground">
        You dont have any bookmarks
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isPending && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};
