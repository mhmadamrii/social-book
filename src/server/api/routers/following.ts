import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const followingRouter = createTRPCRouter({
  getAllPosts: protectedProcedure
    .input(z.object({ limit: z.number(), cursor: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit || 3;
      const cursor = input.cursor; // Cursor from the previous request

      const posts = await ctx.db.post.findMany({
        take: limit + 1, // Fetch one extra item to determine if there's a next page
        skip: cursor ? 1 : 0, // Skip the cursor if present
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" }, // Adjust based on your needs
      });

      let nextCursor = null;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  followUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const followUser = await ctx.db.follow.create({
        data: {
          followerId: ctx.session.user.id, // The current user (follower)
          followingId: input.userId, // The user being followed
        },
      });

      await ctx.db.notification.create({
        data: {
          recipientId: input.userId,
          issuerId: ctx.session.user.id,
          type: "FOLLOW",
        },
      });

      return followUser;
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.follow.delete({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: input.userId,
          },
        },
      });
    }),

  getAvailableFollows: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany({
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        isVerified: true,
        _count: {
          select: {
            followers: true,
            followings: true,
          },
        },
      },
    });

    const sortedUsers = users.sort(
      (a, b) => b._count.followings - a._count.followings,
    );

    return sortedUsers;
  }),

  getFollowedPosts: protectedProcedure
    .input(z.object({ limit: z.number(), cursor: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const limit = input.limit || 3;
      const cursor = input.cursor; // Cursor from the previous request

      const followedUsers = await ctx.db.follow.findMany({
        where: {
          followerId: ctx.session.user.id,
        },
        include: {
          follower: true,
        },
      });

      const followedPosts = await ctx.db.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          userId: {
            in: followedUsers.map((user) => user.followingId),
          },
        },
        include: {
          user: true,
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      });

      let nextCursor = null;
      if (followedPosts.length > limit) {
        const nextItem = followedPosts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        followedPosts,
        nextCursor,
      };
    }),
});

export type FollowingRouterType = typeof followingRouter;
