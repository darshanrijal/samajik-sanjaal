import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pagesize = 5;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: getCommentDataInclude(user.id),
      orderBy: {
        createdAt: "asc",
      },
      take: -pagesize - 1,
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,
    });

    const prevCursor = comments.length > pagesize ? comments[0].id : null;
    const data: CommentPage = {
      comments: comments.length > pagesize ? comments.slice(1) : comments,
      prevCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server Error" }, { status: 500 });
  }
}
