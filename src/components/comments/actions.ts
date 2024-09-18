"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitComment({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const [newComment, _] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: contentValidated,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(user.id !== post.user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              postId: post.id,
              type: "COMMENT",
            },
          }),
        ]
      : []),
  ]);

  return newComment;
}

export async function deleteComment(comment_id: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Cannot delete comment");
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id: comment_id,
    },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId !== user.id) {
    throw new Error("Unauthorized");
  }

  const deletedComment = await prisma.comment.delete({
    where: {
      id: comment_id,
    },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
}
