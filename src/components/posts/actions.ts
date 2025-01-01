"use server";

import { getCurrentSession } from "@/auth";
import { db } from "@/lib/prisma";

export async function deletePost(postId: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== user.id) {
    throw new Error("Forbidden");
  }

  return db.post.delete({
    where: {
      id: postId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}
