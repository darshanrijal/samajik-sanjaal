"use client";

import { trpc } from "@/__rpc/react";
import { Post } from "@/components/posts/post";
import { Loader2 } from "lucide-react";

export const ForYouFeed = () => {
  const query = trpc.posts.getForYouPosts.useQuery();

  if (query.isPending) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.error) {
    return (
      <p className="text-center text-destructive">
        An error occured while fetching posts
      </p>
    );
  }
  return (
    <>
      {query.data?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
};
