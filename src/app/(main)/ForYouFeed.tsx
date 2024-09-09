"use client";

import Post from "@/components/posts/Post";
import kyInstance from "@/lib/ky";
import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

const ForYouFeed = () => {
  const query = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: kyInstance.get("/api/posts/for-you").json<PostData[]>,
    refetchOnWindowFocus: false,
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
    <div className="space-y-5">
      {query.data.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default ForYouFeed;
