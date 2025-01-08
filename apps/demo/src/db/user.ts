import { eq } from "drizzle-orm";

import { db, first } from ".";
import * as schema from "../drizzle/schema";

export const findUser = async (id: string) => {
  return first(
    await db.select().from(schema.users).where(eq(schema.users.id, id))
  );
};
