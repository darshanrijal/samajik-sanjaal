import { db } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const unusedMedia = await db.media.findMany({
    where: {
      postId: null,
      ...(process.env.NODE_ENV === "production"
        ? {
            createdAt: {
              lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          }
        : {}),
    },
    select: {
      id: true,
      url: true,
    },
  });

  await new UTApi().deleteFiles(
    unusedMedia.map(
      (m) => m.url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]
    )
  );

  await db.media.deleteMany({
    where: {
      id: {
        in: unusedMedia.map((m) => m.id),
      },
    },
  });

  return new Response("Success");
}
