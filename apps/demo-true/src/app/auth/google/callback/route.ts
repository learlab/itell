import { z } from "zod";

import { googleProvider, readGoogleOAuthState } from "@/lib/auth/provider";
import { createOAuthCallbackHandler } from "../../oauth";

const GoogleUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  picture: z.string().optional(),
});

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
    const json = await googleUserResponse.json();
    const data = GoogleUserSchema.parse(json);
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      image: data.picture,
    };
  },
});
