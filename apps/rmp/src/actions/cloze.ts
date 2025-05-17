"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { cloze_answers, ClozeDataSchema } from "@/drizzle/schema";
import { authedProcedure } from "./utils";

export const createClozeAction = authedProcedure
  .input(
    z.object({
      pageSlug: z.string(),
      data: ClozeDataSchema,
      totalWords: z.number(),
      correctWords: z.number(),
    })
  )
  .handler(async ({ input, ctx }) => {
    return await db.insert(cloze_answers).values({
      ...input,
      userId: ctx.user.id,
    });
  });

export const deleteClozeAction = authedProcedure
  .input(
    z.object({
      pageSlug: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    return await db
      .delete(cloze_answers)
      .where(
        and(
          eq(cloze_answers.pageSlug, input.pageSlug),
          eq(cloze_answers.userId, ctx.user.id)
        )
      );
  });
