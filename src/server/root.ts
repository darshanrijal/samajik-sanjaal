import { createCallerFactory, publicProcedure, router } from "./trpc";

export const appRouter = router({
  sayHi: publicProcedure.query(() => "Hello NextJS 15"),
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
