import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env.mjs";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

// Fix for "sorry, too many clients already"
declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase | undefined;
}

let db: PostgresJsDatabase;
if (process.env.NODE_ENV === "production") {
  db = drizzle(postgres(env.DATABASE_URL, { prepare: false }));
} else {
  if (!global.db) {
    global.db = drizzle(postgres(env.DATABASE_URL, { prepare: false }));
  }
  db = global.db;
}

export const first = <T>(res: T[]) => (res.length > 0 ? res[0] : null);

export { db };
