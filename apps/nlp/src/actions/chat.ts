"use server";

import { and, eq, Param, sql } from "drizzle-orm";
import { z } from "zod";

import { db, first } from "@/db";
import { chat_messages, ChatMessageDataSchema } from "@/drizzle/schema";
import { authedProcedure } from "./utils";

/**
 * Create chat messages to page, if the entry already exists, append messages to the existing `data` array
 */
export const createChatsAction = authedProcedure
  .input(
    z.object({
      pageSlug: z.string(),
      messages: z.array(ChatMessageDataSchema),
    })
  )
  .handler(async ({ input, ctx }) => {
    const record = first(
      await db
        .select()
        .from(chat_messages)
        .where(
          and(
            eq(chat_messages.userId, ctx.user.id),
            eq(chat_messages.pageSlug, input.pageSlug)
          )
        )
    );

    if (!record) {
      await db.insert(chat_messages).values({
        pageSlug: input.pageSlug,
        userId: ctx.user.id,
        data: input.messages,
      });
    } else {
      const newData = [...record.data, ...input.messages];
      await db
        .update(chat_messages)
        .set({ data: newData })
        .where(
          and(
            eq(chat_messages.userId, ctx.user.id),
            eq(chat_messages.pageSlug, input.pageSlug)
          )
        );
    }
  });

export const deleteChatsAction = authedProcedure
  .input(
    z.object({
      pageSlug: z.string(),
    })
  )
  .handler(async ({ ctx, input }) => {
    return await db
      .delete(chat_messages)
      .where(
        and(
          (eq(chat_messages.userId, ctx.user.id),
          eq(chat_messages.pageSlug, input.pageSlug))
        )
      );
  });
