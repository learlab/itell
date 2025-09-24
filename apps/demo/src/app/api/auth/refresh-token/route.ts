import { cookies } from "next/headers";

import { lucia } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export async function GET(req: Request) {
  const c = await cookies();
  const redirectUrl = new URL(req.url).searchParams.get("redirect_to") ?? "/";

  const sessionId = c.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: redirectUrl,
    });
  }
  const result = await lucia.validateSession(sessionId);
  if (result.session?.fresh) {
    const sessionCookie = lucia.createSessionCookie(result.session.id);
    c.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }
  if (!result.session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    c.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }

  return Response.redirect(redirectUrl);
}
