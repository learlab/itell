import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { generateIdFromEntropySize } from "lucia";
import { allPagesSorted } from "tests/utils";

import { createUser, findUserByProvider } from "@/db/user";
import { env } from "@/env.mjs";
import { lucia } from "@/lib/auth";
import { getPageConditions } from "@/lib/auth/conditions";
import { routes } from "@/lib/navigation";
import { reportSentry } from "@/lib/utils";

const sessionCookieAttributes = {
  // Default attributes
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none", // Use "none" for SCORM
  path: "/",
  maxAge: 60 * 60 * 24 * 30 // 30 days
};

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
          name: `SCORM User ${scormUserId.slice(0, 8)}`,
          // SCORM users don't have emails or images by default
          email: null,
          image: null,
          conditionAssignments: pageConditions,
          role: "user",
          classId: null,
          onboardingFinished: false, // Skip onboarding for SCORM users
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
          "Location": `/${user.pageSlug ? user.pageSlug : "1-operations-training-program-overview"}`,
          "Set-Cookie": `${sessionCookie.name}=${sessionCookie.value}; Max-Age=${sessionCookie.attributes.maxAge}; Path=${sessionCookie.attributes.path}; HttpOnly=true; Secure=true; SameSite=None`
        }
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

