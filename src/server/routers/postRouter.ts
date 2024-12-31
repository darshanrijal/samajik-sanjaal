import { postDataInclude } from "@/lib/types";
import { protectedProcedure, router } from "../trpc";

export const postRouter = router({
  getForYouPosts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: postDataInclude,
    });
    return posts;
  }),
});
