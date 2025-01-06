import { commentRouter } from "./routers/comment-router";
import { notificationRouter } from "./routers/notification-router";
import { postRouter } from "./routers/post-router";
import { streamRouter } from "./routers/stream-router";
import { userRouter } from "./routers/user-router";
import { createCallerFactory, router } from "./trpc";

export const appRouter = router({
  posts: postRouter,
  users: userRouter,
  comments: commentRouter,
  notifications: notificationRouter,
  stream: streamRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
