"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db, first } from "@/db";
import { survey_sessions } from "@/drizzle/schema";
import { SurveyQuestionDataSchema } from "@/lib/survey-question";
import { authedProcedure } from "./utils";

export const upsertSurveyAction = authedProcedure
  .input(
    z.object({
      isFinished: z.boolean().optional(),
      surveyId: z.string(),
      sectionId: z.string(),
      data: z.record(SurveyQuestionDataSchema),
    })
  )
  .handler(async ({ input, ctx }) => {
    return await db.transaction(async (tx) => {
      const session = first(
        await tx
          .select()
          .from(survey_sessions)
          .where(
            and(
              eq(survey_sessions.userId, ctx.user.id),
              eq(survey_sessions.surveyId, input.surveyId)
            )
          )
      );

      if (!session) {
        return await tx.insert(survey_sessions).values({
          userId: ctx.user.id,
          surveyId: input.surveyId,
          data: { [input.sectionId]: input.data },
          finishedAt: input.isFinished ? new Date() : null,
        });
      }

      await tx
        .update(survey_sessions)
        .set({
          data: { ...session.data, [input.sectionId]: input.data },
          finishedAt: input.isFinished ? new Date() : undefined,
        })
        .where(eq(survey_sessions.id, session.id));
    });
  });

export const deleteSurveyAction = authedProcedure
  .input(z.object({ surveyId: z.string() }))
  .handler(async ({ ctx, input }) => {
    await db
      .delete(survey_sessions)
      .where(
        and(
          eq(survey_sessions.userId, ctx.user.id),
          eq(survey_sessions.surveyId, input.surveyId)
        )
      );
  });
