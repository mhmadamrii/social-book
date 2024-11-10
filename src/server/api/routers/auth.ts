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
          message: "Email already exists",
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
