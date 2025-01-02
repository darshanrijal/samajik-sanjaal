import { type LikeInfo, getPostDataInclude } from "@/lib/types";
import { TRPCError } from "@trpc/server";
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

  getFollowingPosts: protectedProcedure
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
        where: {
          user: {
            followers: {
              some: {
                followerId: ctx.user.id,
              },
            },
          },
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
  getUserPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const pagesize = 10;
      const posts = await ctx.db.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId: input.userId,
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

  getPostLikes: protectedProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          likes: {
            where: {
              userId: ctx.user.id,
            },
            select: {
              userId: true,
            },
          },

          _count: {
            select: {
              likes: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      const data: LikeInfo = {
        likes: post._count.likes,
        isLikedByUser: !!post.likes.length,
      };

      return data;
    }),

  createLike: protectedProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      await ctx.db.like.upsert({
        where: {
          userId_postId: {
            postId: input.postId,
            userId: ctx.user.id,
          },
        },
        create: { postId: input.postId, userId: ctx.user.id },
        update: {},
      });
    }),

  deleteLike: protectedProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      await ctx.db.like.deleteMany({
        where: {
          postId: input.postId,
          userId: ctx.user.id,
        },
      });
    }),
});
