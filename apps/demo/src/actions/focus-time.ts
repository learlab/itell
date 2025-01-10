"use server";

import { and, eq } from "drizzle-orm";

import { db, first } from "@/db";
import { CreateFocusTimeSchema, events, focus_times } from "@/drizzle/schema";
import { EventType, isProduction } from "@/lib/constants";
import { authedProcedure } from "./utils";
import type { FocusTimeData } from "@/drizzle/schema";

/**
 * Response to focus time event
 * - add new record to the `events` table
 * - upsert record to the `focus_times` table, using page-user pair
 */
export const createFocusTimeAction = authedProcedure
  .input(CreateFocusTimeSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    if (isProduction) {
      const userId = ctx.user.id;

      await db.transaction(async (tx) => {
        // add events record
        await tx.insert(events).values({
          userId,
          type: EventType.FOCUS_TIME,
          pageSlug: input.pageSlug,
          data: input.data,
        });

        // check if the record exists under the same user-page pair
        const record = first(
          await tx
            .select()
            .from(focus_times)
            .where(and(eq(focus_times.userId, userId), eq(focus_times.pageSlug, input.pageSlug)))
        );

        // update or insert focus_times record
        if (record) {
          const newData: FocusTimeData = {};
          const updateData = input.data as FocusTimeData;
          const oldData = record.data;
          // if there are legacy chunk ids that's not present in the new data
          // they will dropped during the update
          for (const chunkId in updateData) {
            if (chunkId in oldData) {
              newData[chunkId] = oldData[chunkId] + updateData[chunkId];
            } else {
              newData[chunkId] = updateData[chunkId];
            }
          }
          await tx
            .update(focus_times)
            .set({ data: newData })
            .where(and(eq(focus_times.userId, userId), eq(focus_times.pageSlug, input.pageSlug)));
        } else {
          await tx.insert(focus_times).values({
            pageSlug: input.pageSlug,
            data: input.data as FocusTimeData,
            userId,
          });
        }
      });
    }
  });
