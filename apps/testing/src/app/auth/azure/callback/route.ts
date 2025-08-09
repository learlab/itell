import { decodeIdToken } from "arctic";
import { z } from "zod";

import { azureProvider, readAzureOAuthState } from "@/lib/auth/provider";
import { AzureUserSchema } from "@/lib/auth/schema";
import { createOAuthCallbackHandler } from "../../oauth";

export const GET = createOAuthCallbackHandler({
  providerId: "azure",
  getState: readAzureOAuthState,
  getUser: async ({ code, storedCodeVerifier }) => {
    const tokens = await azureProvider.validateAuthorizationCode(
      code,
      storedCodeVerifier
    );
    const idToken = tokens.idToken();
    const data = decodeIdToken(idToken);
    const user = AzureUserSchema.parse(data);
    return {
      id: user.oid,
      name: user.name || user.preferred_username,
      email: user.email,
    };
  },
});
