import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { allPagesSorted } from "tests/utils";

import { findTeacherByClass } from "@/db/teacher";
import { createUser, findUserByProvider, updateUser } from "@/db/user";
import { env } from "@/env.mjs";
import { lucia } from "@/lib/auth";
import { getPageConditions } from "@/lib/auth/conditions";
import { readAuthData, setAuthData } from "@/lib/auth/provider";
import { routes } from "@/lib/navigation";
import { reportSentry } from "@/lib/utils";

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
type AuthState = {
  state: string;
  codeVerifier: string;
};

type getUserArgs = {
  code: string;
  storedCodeVerifier: string;
};

type OAuthUser = {
  id: string;
  name: string;
  email?: string;
  image?: string;
};

export type OAuthProviderId = "google" | "azure";

/**
 * Factory function for creating oauth redirect handlers
 *
 * e.g., in `google/route.ts`, put `export const GET = createOAuthRedirectHandler({ ... })`
 *
 */
export const createOAuthRedirectHandler = ({
  setState,
  getRedirectUrl,
}: {
  setState: () => Promise<AuthState>;
  getRedirectUrl: (state: AuthState) => URL;
}) => {
  return async function (req: Request) {
    const searchParams = new URL(req.url).searchParams;
    const { state, codeVerifier } = await setState();
    const join_class_code = searchParams.get("join_class_code") ?? "";
    const dst = searchParams.get("redirect_to") ?? "/";

    await setAuthData({ dst, join_class_code });

    const url = getRedirectUrl({ state, codeVerifier });

    return Response.redirect(url);
  };
};

/**
 *  Factory function for creating oauth callback handlers
 *
 * e.g., in `google/callback/route.ts`, put `export const GET = createOAuthCallbackHandler({ ... })`
 * @param providerId - the oauth provider id
 * @param getState - a function that returns the state and codeVerifier
 * @param getUser - a function that validates the authorization code, and get the oauth user model
 *
 */
export const createOAuthCallbackHandler = ({
  providerId,
  getState,
  getUser,
}: {
  providerId: OAuthProviderId;
  getState: () => Promise<Nullable<AuthState>>;
  getUser: (input: getUserArgs) => Promise<OAuthUser>;
}) => {
  return async function (req: Request) {
    const url = new URL(req.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const err = url.searchParams.get("error");

    if (err === "access_denied") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: routes.auth({ search: { error: "access_denied" } }),
        },
      });
    }

    const { state: storedState, codeVerifier: storedCodeVerifier } =
      await getState();
    const { dst, join_class_code } = await readAuthData();

    if (
      !code ||
      !state ||
      !storedState ||
      !storedCodeVerifier ||
      state !== storedState
    ) {
      return notFound();
    }

    try {
      const oauthUser = await getUser({
        code,
        storedCodeVerifier,
      });
      let user = await findUserByProvider({
        provider_id: providerId,
        provider_user_id: oauthUser.id,
      });

      const teacher = join_class_code
        ? await findTeacherByClass(join_class_code)
        : null;
      let class_code_valid: boolean | undefined = undefined;

      if (!user) {
        const pageConditions = getPageConditions(allPagesSorted);
        class_code_valid = join_class_code ? Boolean(teacher) : undefined;
        const newUser = await createUser({
          user: {
            id: generateIdFromEntropySize(16),
            name: oauthUser.name,
            image: oauthUser.image,
            email: oauthUser.email,
            conditionAssignments: pageConditions,
            role: env.ADMINS?.includes(oauthUser.email ?? "")
              ? "admin"
              : "user",
            classId: teacher ? join_class_code : null,
          },
          provider_id: providerId,
          provider_user_id: oauthUser.id,
        });

        user = newUser;
      } else {
        // for existing users without a class id, update their record
        if (!user.classId) {
          class_code_valid = join_class_code ? Boolean(teacher) : undefined;
          if (teacher) {
            updateUser(user.id, { classId: join_class_code });
          }
        }
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      // redirect, which can be
      // - onboarding if not finished
      // - the "redirect_to" searchParam present on the /auth page
      // - referrer header
      // - homepage (fallback)
      const url = !user.onboardingFinished
        ? routes.onboarding(
            class_code_valid === undefined
              ? undefined
              : { search: { class_code_valid } }
          )
        : dst !== "/"
          ? dst
          : routes.home(
              class_code_valid === undefined
                ? undefined
                : { search: { class_code_valid } }
            );

      return new Response(null, {
        status: 303,
        // @ts-expect-error location mismtach
        headers: {
          Location: url,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        reportSentry("oauth error", {
          error,
          provider_id: providerId,
        });
      }
      const url = new URL("/auth", env.NEXT_PUBLIC_HOST);
      url.searchParams.append("error", "oauth");
      return Response.redirect(url.toString());
    }
  };
};
