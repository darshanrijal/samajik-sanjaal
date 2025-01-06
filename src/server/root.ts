import { getPostDataInclude } from "@/lib/types";
import { z } from "zod";
import { commentRouter } from "./routers/comment-router";
import { notificationRouter } from "./routers/notification-router";
import { postRouter } from "./routers/post-router";
import { streamRouter } from "./routers/stream-router";
import { userRouter } from "./routers/user-router";
import { createCallerFactory, protectedProcedure, router } from "./trpc";

export const appRouter = router({
  posts: postRouter,
  users: userRouter,
  comments: commentRouter,
  notifications: notificationRouter,
  stream: streamRouter,
  getSearchResults: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        q: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, q } = input;
      const pagesize = 10;
      const searchQuery = q.split(" ").join(" & ");

      const posts = await ctx.db.post.findMany({
        where: {
          OR: [
            {
              content: {
                search: searchQuery,
              },
            },
            {
              user: {
                displayName: {
                  search: searchQuery,
                },
              },
            },
            {
              user: {
                username: {
                  search: searchQuery,
                },
              },
            },
          ],
        },
        include: getPostDataInclude(ctx.user.id),
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

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
