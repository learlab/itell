import { and, eq } from "drizzle-orm";

import { chat_messages } from "@/drizzle/schema";
import { db, first } from ".";

export const getPageChats = async (userId: string, pageSlug: string) => {
  const record = first(
    await db
      .select({
        data: chat_messages.data,
        updatedAt: chat_messages.updatedAt,
      })
      .from(chat_messages)
      .where(
        and(
          eq(chat_messages.userId, userId),
          eq(chat_messages.pageSlug, pageSlug)
        )
      )
  );

  if (!record) {
    return {
      data: [],
      updatedAt: new Date(),
    };
  }

  return {
    data: record.data,
    updatedAt: record.updatedAt,
  };
};
