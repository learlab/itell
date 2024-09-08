import { env } from "@/env.mjs";
import {
	Google,
	MicrosoftEntraId,
	generateCodeVerifier,
	generateState,
} from "arctic";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export type OAuthProvider = "google" | "azure";

export const azureProvider = new MicrosoftEntraId(
	env.AZURE_TENANT_ID,
	env.AZURE_CLIENT_ID,
	env.AZURE_CLIENT_SECRET,
	`${env.HOST}/auth/azure/callback`,
);

export const googleProvider = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	`${env.HOST}/auth/google/callback`,
);

const cookieOptions: Partial<ResponseCookie> = {
	path: "/",
	secure: process.env.NODE_ENV === "production",
	httpOnly: true,
	maxAge: 60 * 10,
	sameSite: "lax",
};

export const setJoinClassCode = (join_class_code: string | null) => {
	if (join_class_code !== null) {
		cookies().set("join_class_code", join_class_code);
	}
};

export const readJoinClassCode = () => {
	const join_class_code = cookies().get("join_class_code")?.value ?? null;
	cookies().delete("join_class_code");

	return join_class_code;
};

export const setAzureOAuthState = (referer?: string) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	cookies().set("azure_oauth_state", state, cookieOptions);
	cookies().set("azure_oauth_code_verifier", codeVerifier, cookieOptions);
	if (referer) {
		cookies().set("azure_oauth_referer", referer, cookieOptions);
	}

	return { state, codeVerifier };
};

export const readAzureOAuthState = () => {
	const state = cookies().get("azure_oauth_state")?.value ?? null;
	const codeVerifier =
		cookies().get("azure_oauth_code_verifier")?.value ?? null;
	const referer = cookies().get("azure_oauth_referer")?.value ?? null;

	return { state, codeVerifier, referer };
};

export const setGoogleOAuthState = (referer?: string) => {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	cookies().set("google_oauth_state", state, cookieOptions);
	cookies().set("google_oauth_code_verifier", codeVerifier, cookieOptions);
	if (referer) {
		cookies().set("google_oauth_referer", referer, cookieOptions);
	}

	return { state, codeVerifier };
};

export const readGoogleOAuthState = () => {
	const state = cookies().get("google_oauth_state")?.value ?? null;
	const codeVerifier =
		cookies().get("google_oauth_code_verifier")?.value ?? null;
	const referer = cookies().get("google_oauth_referer")?.value ?? null;
	return { state, codeVerifier, referer };
};
