import { and, eq, ne } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";

import { OAuthProviderId } from "@/app/auth/oauth";
import { isProduction } from "@/lib/constants";
import { db, first } from ".";
import * as schema from "../drizzle/schema";

export const findUser = memoize(
  async (id: string) => {
    return first(
      await db.select().from(schema.users).where(eq(schema.users.id, id))
    );
  },
  {
    persist: true,
    duration: 60,
    revalidateTags: (userId) => ["get-user", userId],
    log: isProduction ? [] : ["dedupe", "datacache", "verbose"],
    logid: "Get user",
  }
);

type FindProviderArgs = {
  provider_id: OAuthProviderId;
  provider_user_id: string;
};

/**
 * Find user by oauth provider
 */
export const findUserByProvider = async ({
  provider_id,
  provider_user_id,
}: FindProviderArgs) => {
  const joined = first(
    await db
      .select()
      .from(schema.users)
      .innerJoin(
        schema.oauthAccounts,
        eq(schema.users.id, schema.oauthAccounts.user_id)
      )
      .where(
        and(
          eq(schema.oauthAccounts.provider_id, provider_id),
          eq(schema.oauthAccounts.provider_user_id, provider_user_id)
        )
      )
  );

  return joined?.users;
};

/**
 * Create uesr with oauth provider and optional class id
 *
 * `class_id` should be validated before calling this function, e.g. `findTeacherByClass`
 */
export const createUser = async ({
  user,
  provider_id,
  provider_user_id,
}: { user: schema.CreateUserInput } & FindProviderArgs) => {
  return await db.transaction(async (tx) => {
    const [newUser] = await tx.insert(schema.users).values(user).returning();

    await tx.insert(schema.oauthAccounts).values({
      provider_id,
      provider_user_id,
      user_id: newUser.id,
    });
    return newUser;
  });
};

/*
 * Update user
 *
 * This function does not call revalidateTag (which updateUserAction does)
 */
export const updateUser = async (
  userId: string,
  values: schema.UpdateUserInput
) => {
  return await db
    .update(schema.users)
    .set(values)
    .where(eq(schema.users.id, userId))
    .returning();
};

/**
 * Get an array of users to compare with the current user
 *
 * - If user is in a class, get other users from the class
 * - If user is not in a class, get all other users
 */
export const getOtherUsers = memoize(
  async ({ userId, classId }: { userId: string; classId: string | null }) => {
    if (classId) {
      return await db
        .select({
          id: schema.users.id,
          pageSlug: schema.users.pageSlug,
        })
        .from(schema.users)
        .where(and(eq(schema.users.classId, classId)));
    }

    return await db
      .select({ id: schema.users.id, pageSlug: schema.users.pageSlug })
      .from(schema.users)
      .where(ne(schema.users.id, userId))
      .limit(100);
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: ({ userId }) => ["get-other-users", userId],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Get other users",
  }
);

/**
 * Get streak stats for every user
 * If classId is provided, only get users from that class
 * Otherwise, get all users
 */
export const getStreakLeaderboard = memoize(
  async ({ classId }: { classId: string | null }) => {
    let results;
    if (classId) {
      results = await db
        .select({
          name: schema.users.name,
          image: schema.users.image,
          streak: schema.users.personalization,
        })
        .from(schema.users)
        .where(and(eq(schema.users.classId, classId)));
    } else {
      results = await db
        .select({
          name: schema.users.name,
          image: schema.users.image,
          streak: schema.users.personalization,
        })
        .from(schema.users);
    }
    return results
      .sort((a, b) => {
        const difference =
          (b.streak?.max_cri_streak ?? -1) - (a.streak?.max_cri_streak ?? -1);
        if (difference === 0) {
          return (
            (b.streak?.max_summary_streak ?? -1) -
            (a.streak?.max_summary_streak ?? -1)
          );
        }
        return difference;
      })
      .splice(0, 5);
  }
);
