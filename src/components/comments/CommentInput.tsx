import React, { useState } from "react";
import { PostData } from "@/lib/types";
import { useSubmitCommentMutation } from "./mutations";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizonal } from "lucide-react";

interface CommentInput {
  post: PostData;
}
export default function CommentInput({ post }: CommentInput) {
  const [input, setInput] = useState<string>("");
  const mutation = useSubmitCommentMutation(post.id);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      { post, content: input },
      {
        onSuccess: () => setInput(""),
      },
    );
  }
  return (
    <form onSubmit={onSubmit} className="flex w-full items-center gap-2">
      <Input
        placeholder="write a comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant={"ghost"}
        size={"icon"}
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
}
