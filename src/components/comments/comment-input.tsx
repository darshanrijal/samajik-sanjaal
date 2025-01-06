import type { PostData } from "@/lib/types";
import { Loader2, SendHorizonal } from "lucide-react";
import Form from "next/form";
import { useState } from "react";
import type React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSubmitCommentMutation } from "./mutations";

interface CommentInputProps {
  post: PostData;
}
export const CommentInput = ({ post }: CommentInputProps) => {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation(post.id);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!input) {
      return;
    }

    mutation.mutate(
      { post, content: input },
      {
        onSuccess: () => {
          setInput("");
        },
      }
    );
  }
  return (
    <Form
      action=""
      className="flex w-full items-center gap-2"
      onSubmit={onSubmit}
    >
      <Input
        placeholder="write a comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />

      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
      >
        {mutation.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <SendHorizonal />
        )}
      </Button>
    </Form>
  );
};
