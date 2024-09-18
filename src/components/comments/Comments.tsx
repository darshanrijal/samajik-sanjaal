import { CommentPage, PostData } from "@/lib/types";
import React from "react";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Loader2 } from "lucide-react";
import Comment from "./Comment";
import { Button } from "../ui/button";

export default function Comments({ post }: { post: PostData }) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam
              ? {
                  searchParams: {
                    cursor: pageParam,
                  },
                }
              : {},
          )
          .json<CommentPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.prevCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });
  if (status === "pending") {
    return <Loader2 className="mx-auto animate-spin text-primary" />;
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">Failed to load comments</p>
    );
  }
  const comments = data.pages.flatMap((page) => page.comments);
  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant={"link"}
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {!comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
