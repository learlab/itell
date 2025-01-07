"use server";

import { and, eq, inArray } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";

import { db } from "@/actions/db";
import { CreateEventSchema, events, quiz_answers } from "@/drizzle/schema";
import { EventType, isProduction, Tags } from "@/lib/constants";
import { authedProcedure } from "./utils";

/**
 * Create event
 */
export const createEventAction = authedProcedure
  .input(CreateEventSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    if (isProduction) {
      return await db.insert(events).values({
        ...input,
        userId: ctx.user.id,
      });
    }
  });
