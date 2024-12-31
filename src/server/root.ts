import { postRouter } from "./routers/postRouter";
import { createCallerFactory, router } from "./trpc";

export const appRouter = router({
  posts: postRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
