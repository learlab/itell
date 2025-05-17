"use server";

import { db } from "@/db";
import {
  createChatFeedbackSchema,
  createCRIFeedbackSchema,
  feedbacks,
} from "@/drizzle/schema";
import { FeedbackType } from "@/lib/constants";
import { authedProcedure } from "./utils";

export const createCRIFeedbackAction = authedProcedure
  .input(createCRIFeedbackSchema)
  .handler(async ({ input, ctx }) => {
    return await db.insert(feedbacks).values({
      userId: ctx.user.id,
      type: FeedbackType.CRI,
      data: {
        chunkSlug: input.chunkSlug,
        pageSlug: input.pageSlug,
        tags: input.tags,
      },
      ...input,
    });
  });

export const createChatFeedbackAction = authedProcedure
  .input(createChatFeedbackSchema)
  .handler(async ({ input, ctx }) => {
    return await db.insert(feedbacks).values({
      userId: ctx.user.id,
      type: FeedbackType.CHAT,
      data: {
        history: input.history,
        pageSlug: input.pageSlug,
        message: input.message,
      },
      ...input,
    });
  });
