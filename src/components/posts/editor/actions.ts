"use server";

import { getCurrentSession } from "@/auth";
import { db } from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content, mediaIds } = createPostSchema.parse(input);

  return db.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });
}
