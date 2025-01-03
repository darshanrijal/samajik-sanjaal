import { type CommentsPage, getCommentDataInclude } from "@/lib/types";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const commentRouter = router({
  getComments: protectedProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const pagesize = 5;
      const comments = await ctx.db.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: getCommentDataInclude(ctx.user.id),
        orderBy: {
          createdAt: "asc",
        },
        take: -pagesize - 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      const prevCursor = comments.length > pagesize ? comments[0].id : null;

      return {
        comments: comments.length > pagesize ? comments.slice(1) : comments,
        prevCursor,
      } satisfies CommentsPage;
    }),
});
