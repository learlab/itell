"use server";

import "server-only";

import { cookies, headers } from "next/headers";
import { type Session as _Session, type User } from "lucia";
import { memoize } from "nextjs-better-unstable-cache";

import { env } from "@/env.mjs";
import { Tags } from "../constants";
import { lucia } from "./lucia";

export type GetSessionData =
  | { user: User; session: _Session }
  | { user: null; session: null };

export const getSession = memoize(
  async (): Promise<GetSessionData> => {
    const c = await cookies();
    const sessionId = c.get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }
    const result = await lucia.validateSession(sessionId);
    if ((result && result.session?.fresh) || !result.session) {
      const headersList = await headers();
      const referer = headersList.get("referer");
      const url = new URL(
        "/api/auth/refresh-token?redirect_to=" + referer,
        env.NEXT_PUBLIC_HOST
      );
      await fetch(url);
    }
    return result;
  },
  {
    persist: false,
    revalidateTags: [Tags.GET_SESSION],
  }
);

export const logout = async () => {
  const { session } = await getSession();
  if (session) {
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }
};
