import { postDataInclude } from "@/lib/types";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const postRouter = router({
  getForYouPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const pagesize = 10;
      const posts = await ctx.db.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: postDataInclude,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        take: pagesize + 1,
      });

      const nextCursor = posts.length > pagesize ? posts[pagesize].id : null;

      return {
        posts: posts.slice(0, pagesize),
        nextCursor,
      };
    }),
});
