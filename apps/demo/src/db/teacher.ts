import { and, eq } from "drizzle-orm";

import { db, first } from ".";
import * as schema from "../drizzle/schema";

export const findTeacher = async (id: string) => {
  return first(
    await db
      .select()
      .from(schema.teachers)
      .where(
        and(eq(schema.teachers.id, id), eq(schema.teachers.isApproved, true))
      )
  );
};
