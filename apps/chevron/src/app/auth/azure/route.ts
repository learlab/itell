import { azureProvider, setAzureOAuthState } from "@/lib/auth/provider";
import { createOAuthRedirectHandler } from "../oauth";

export const GET = createOAuthRedirectHandler({
  setState: setAzureOAuthState,
  getRedirectUrl: ({ state, codeVerifier }) => {
    const url = azureProvider.createAuthorizationURL(state, codeVerifier, [
      "openid",
      "profile",
      "email",
      "user.read",
    ]);

    url.searchParams.set("nonce", "_");
    return url;
  },
});
