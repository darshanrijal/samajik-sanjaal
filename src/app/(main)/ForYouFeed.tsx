"use client";

import Post from "@/components/posts/Post";
import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

const ForYouFeed = () => {
  const query = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: async () => {
      const res = await fetch("/api/posts/for-you");
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      return res.json();
    },
  });

  if (query.isPending) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.error) {
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts
      </p>
    );
  }

  return (
    <>
      {query.data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </>
  );
};

export default ForYouFeed;
