import {
  type FollowerInfo,
  type PostPage,
  getPostDataInclude,
  getUserDataSelect,
} from "@/lib/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getFollowerInfo: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          followers: {
            where: {
              followerId: ctx.user.id,
            },
            select: {
              followerId: true,
            },
          },
          _count: {
            select: {
              followers: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const data: FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: !!user.followers.length,
      };

      return data;
    }),

  createFollower: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      await ctx.db.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: ctx.user.id,
            followingId: input.userId,
          },
        },
        create: {
          followerId: ctx.user.id,
          followingId: input.userId,
        },
        update: {},
      });
    }),

  deleteFollower: protectedProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      await ctx.db.follow.deleteMany({
        where: {
          followerId: ctx.user.id,
          followingId: input.userId,
        },
      });
    }),
  getUserByUsername: protectedProcedure
    .input(
      z.object({
        username: z.string().regex(/^[a-zA-Z0-9_-]{3,20}$/),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          username: {
            equals: input.username,
            mode: "insensitive",
          },
        },
        select: getUserDataSelect(ctx.user.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found with requested username",
        });
      }

      return user;
    }),

  getUserBookmarks: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor } = input;
      const pagesize = 10;
      const bookmarks = await ctx.db.bookmark.findMany({
        where: {
          userId: ctx.user.id,
        },
        include: {
          post: {
            include: getPostDataInclude(ctx.user.id),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: pagesize + 1,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
      });

      const nextCursor =
        bookmarks.length > pagesize ? bookmarks[pagesize].id : null;

      return {
        posts: bookmarks.slice(0, pagesize).map((bookmark) => bookmark.post),
        nextCursor,
      } satisfies PostPage;
    }),
});
