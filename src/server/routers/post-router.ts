import {
  type BookmarkInfo,
  type LikeInfo,
  getPostDataInclude,
} from "@/lib/types";
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
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          userId: true,
        },
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      await ctx.db.$transaction([
        ctx.db.like.upsert({
          where: {
            userId_postId: {
              postId: input.postId,
              userId: ctx.user.id,
            },
          },
          create: { postId: input.postId, userId: ctx.user.id },
          update: {},
        }),
        ...(ctx.user.id !== post.userId
          ? [
              ctx.db.notification.create({
                data: {
                  issuerId: ctx.user.id,
                  recipientId: post.userId,
                  postId: input.postId,
                  type: "LIKE",
                },
              }),
            ]
          : []),
      ]);
    }),

  deleteLike: protectedProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        select: {
          userId: true,
        },
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      await ctx.db.$transaction([
        ctx.db.like.deleteMany({
          where: {
            postId: input.postId,
            userId: ctx.user.id,
          },
        }),
        ctx.db.notification.deleteMany({
          where: {
            issuerId: ctx.user.id,
            recipientId: post.userId,
            postId: input.postId,
            type: "LIKE",
          },
        }),
      ]);
    }),

  getBookmarkInfo: protectedProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const bookmark = await ctx.db.bookmark.findUnique({
        where: {
          userId_postId: {
            userId: ctx.user.id,
            postId: input.postId,
          },
        },
      });

      const data: BookmarkInfo = {
        isBookmarkedByUser: !!bookmark,
      };

      return data;
    }),

  createBookmark: protectedProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.bookmark.upsert({
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

  deleteBookmark: protectedProcedure
    .input(z.object({ postId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.bookmark.deleteMany({
        where: {
          postId: input.postId,
          userId: ctx.user.id,
        },
      });
    }),
});
