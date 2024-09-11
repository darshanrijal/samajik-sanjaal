import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { PostsPage } from "@/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pagesize = 10;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: user.id,
            },
          },
        },
      },
      include: getPostDataInclude(user.id),
      orderBy: {
        createdAt: "desc",
      },
      take: pagesize + 1,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
    });
    const nextCursor = posts.length > pagesize ? posts[pagesize].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, pagesize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
