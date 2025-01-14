"use server";

import { db } from "@/db";
import { CreateEventSchema, events } from "@/drizzle/schema";
import { authedProcedure } from "./utils";

/**
 * Create event
 */
export const createEventAction = authedProcedure
  .input(CreateEventSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    return await db.insert(events).values({
      ...input,
      userId: ctx.user.id,
    });
  });
