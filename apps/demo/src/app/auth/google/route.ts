import { googleProvider, setGoogleOAuthState } from "@/lib/auth/provider";
import { createOAuthRedirectHandler } from "../oauth";

export const GET = createOAuthRedirectHandler({
  setState: setGoogleOAuthState,
  getRedirectUrl: ({ state, codeVerifier }) =>
    googleProvider.createAuthorizationURL(state, codeVerifier, [
      "openid",
      "profile",
      "email",
    ]),
});
