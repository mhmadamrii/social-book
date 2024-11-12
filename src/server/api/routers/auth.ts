import { TRPCError } from "@trpc/server";
import { z } from "zod";
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
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
    });
  }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  getHoveredUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: {
          id: input.userId,
        },
        include: {
          followings: true,
          followers: true,
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
          username: input.username,
        },
      });

      if (isExistUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email or username already exists",
        });
      }

      return ctx.db.user.create({
        data: {
          username: input.username,
          email: input.email,
          password: input.password,
        },
      });
    }),
});
