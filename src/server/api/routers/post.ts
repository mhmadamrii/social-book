import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAllPosts: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  create: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          content: input.content,
        },
      });
    }),
});
