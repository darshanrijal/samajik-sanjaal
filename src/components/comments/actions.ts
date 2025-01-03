"use server";

import { getCurrentSession } from "@/auth";
import { db } from "@/lib/prisma";
import { type PostData, getCommentDataInclude } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitComment({
  post,
  content,
}: { post: PostData; content: string }) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content: validatedContent } = createCommentSchema.parse({ content });

  const [newComment, _] = await db.$transaction([
    db.comment.create({
      data: {
        content: validatedContent,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.userId !== user.id
      ? [
          db.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.userId,
              postId: post.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

export async function deleteComment(id: string) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const comment = await db.comment.findUnique({
    where: {
      id,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== user.id) {
    throw new Error("Forbidden request, This is not your comment");
  }

  const deletedComment = await db.comment.delete({
    where: {
      id,
    },
    include: getCommentDataInclude(user.id),
  });
  return deletedComment;
}
