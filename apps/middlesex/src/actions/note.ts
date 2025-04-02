"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { CreateNoteSchema, notes, UpdateNoteSchema } from "@/drizzle/schema";
import { authedProcedure } from "./utils";

export const createNoteAction = authedProcedure
  .input(CreateNoteSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    return (
      await db
        .insert(notes)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning()
    )[0];
  });

export const updateNoteAction = authedProcedure
  .input(z.object({ id: z.number(), data: UpdateNoteSchema }))
  .handler(async ({ input }) => {
    await db.update(notes).set(input.data).where(eq(notes.id, input.id));
  });

/**
 * Delete a note
 */
export const deleteNoteAction = authedProcedure
  .input(z.object({ id: z.number() }))
  .handler(async ({ input }) => {
    return await db.delete(notes).where(eq(notes.id, input.id));
  });
