"use server";

import { getCurrentSession } from "@/auth";
import { db } from "@/lib/prisma";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: string) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content } = createPostSchema.parse({ content: input });

  await db.post.create({
    data: {
      content,
      userId: user.id,
    },
  });
}
