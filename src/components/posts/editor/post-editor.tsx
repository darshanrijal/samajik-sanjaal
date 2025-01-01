"use client";

import { LoadingButton } from "@/components/loading-button";
import { UserAvatar } from "@/components/user-avatar";
import { useSession } from "@/hooks/use-session";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useSubmitPostMutation } from "./mutations";
import "./styles.css";

export const PostEditor = () => {
  const { user } = useSession();
  const mutation = useSubmitPostMutation();
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        italic: false,
        bold: false,
      }),
      Placeholder.configure({
        placeholder: `What's going on your mind?`,
      }),
    ],
  });

  const input = editor?.getText({ blockSeparator: "\n" }) || "";

  function onSubmit() {
    mutation.mutate(input, {
      onSuccess: () => editor?.commands.clearContent(),
    });
  }
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-80 w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          loading={mutation.isPending}
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
};
