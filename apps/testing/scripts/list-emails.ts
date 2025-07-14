import "dotenv/config";

import { like } from "drizzle-orm";

import { db } from "../src/db";
import { users } from "../src/drizzle/schema";

(async () => {
  console.log(
    await db
      .select({ email: users.email })
      .from(users)
      .where(like(users.email, "@vanderbilt.edu"))
  );
})();
