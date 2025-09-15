import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { generateIdFromEntropySize } from "lucia";
import { allPagesSorted } from "tests/utils";

import { createUser, findUserByProvider } from "@/db/user";
import { lucia } from "@/lib/auth";
import { getPageConditions } from "@/lib/auth/conditions";
import { routes } from "@/lib/navigation";
import { makePageHref, reportSentry } from "@/lib/utils";

export async function GET(request: NextRequest) {
  // The SCORM user ID should be available via query params
  // The provider has already set the scormUserId in the URL when redirecting here
  const scormUserId = request.nextUrl.searchParams.get("scormUserId");

  if (!scormUserId) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: routes.auth({ search: { error: "scorm_missing_id" } }),
      },
    });
  }

  try {
    // Check if user already exists
    let user = await findUserByProvider({
      provider_id: "scorm",
      provider_user_id: scormUserId,
    });

    // Create new user if not found
    if (!user) {
      const pageConditions = getPageConditions(allPagesSorted);
      const newUser = await createUser({
        user: {
          id: generateIdFromEntropySize(16),
          name: `${scormUserId.slice(0, 8)}_scorm`,
          // SCORM users don't have emails or images by default
          email: null,
          image: null,
          conditionAssignments: pageConditions,
          classId: null,
        },
        provider_id: "scorm",
        provider_user_id: scormUserId,
      });

      user = newUser;
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Set the session cookie exactly as the OAuth implementation does
    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // Use the same Response approach as the OAuth handler
    return new Response(null, {
      status: 303,
      headers: {
        Location: user.pageSlug
          ? makePageHref(user.pageSlug)
          : makePageHref(allPagesSorted[0].slug),
        "Set-Cookie": `${sessionCookie.name}=${sessionCookie.value}; Max-Age=${sessionCookie.attributes.maxAge}; Path=${sessionCookie.attributes.path}; HttpOnly=true; Secure=true; SameSite=None`,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      reportSentry("scorm auth error", {
        error,
        provider_id: "scorm",
      });
    }

    return new Response(null, {
      status: 303,
      headers: {
        Location: routes.auth({ search: { error: "scorm_auth_error" } }),
      },
    });
  }
}
