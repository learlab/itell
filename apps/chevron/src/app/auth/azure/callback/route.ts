import { decodeIdToken } from "arctic";
import { z } from "zod";

import { azureProvider, readAzureOAuthState } from "@/lib/auth/provider";
import { createOAuthCallbackHandler } from "../../oauth";

const AzureUserSchema = z.object({
  oid: z.string(),
  preferred_username: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
});

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
