import { TRPCError } from "@trpc/server";
import { z } from "zod";
import streamServerClient from "~/lib/stream";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        isVerified: true,
      },
    });
  }),

  getAllSearchableUsers: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        isVerified: true,
      },
    });
  }),

  getPeopleYouMayKnow: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        isVerified: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            followings: true,
            followers: true,
            posts: true,
          },
        },
      },
    });
  }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        followings: true,
        followers: true,
      },
    });
  }),

  getHoveredUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          isVerified: true,
          bio: true,
          followers: true,
          followings: true,
          createdAt: true,
          _count: {
            select: {
              followings: true,
              followers: true,
            },
          },
        },
      });
    }),

  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const userFollowers = await ctx.db.user.findMany({
        where: {
          username: input.username,
        },
        include: {
          followers: true,
        },
      });

      return ctx.db.user.findFirst({
        where: {
          username: input.username,
        },
        include: {
          followings: true,
          followers: true,
          posts: true,
          _count: {
            select: {
              followings: true,
              followers: true,
              posts: true,
            },
          },
        },
      });
    }),

  signUp: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const isExistUser = await ctx.db.user.findFirst({
        where: {
          OR: [
            {
              username: input.username,
            },
            {
              email: input.email,
            },
          ],
        },
      });

      if (isExistUser?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email or username already exists",
        });
      }

      const newUser = ctx.db.user.create({
        data: {
          username: input.username,
          email: input.email,
          password: input.password,
          name: `${input.username}.social`,
        },
      });

      await streamServerClient.upsertUser({
        id: (await newUser).id,
        username: input.username,
        name: input.username,
      });

      return newUser;
    }),

  editProfile: protectedProcedure
    .input(
      z.object({ name: z.string(), imageUrl: z.string(), bio: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          image: input.imageUrl,
          bio: input.bio,
        },
      });
    }),
});

export type AuthRouterType = typeof authRouter;
