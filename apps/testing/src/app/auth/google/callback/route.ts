import { decodeIdToken } from "arctic";

import { googleProvider, readGoogleOAuthState } from "@/lib/auth/provider";
import { GoogleUserSchema } from "@/lib/auth/schema";
import { createOAuthCallbackHandler } from "../../oauth";

export const GET = createOAuthCallbackHandler({
  providerId: "google",
  getState: readGoogleOAuthState,
  getUser: async ({ code, storedCodeVerifier }) => {
    const tokens = await googleProvider.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const accessToken = tokens.accessToken();
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const googleUser = await googleUserResponse.json();
    const data = GoogleUserSchema.parse(googleUser);
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      image: data.picture,
    };
  },
});
