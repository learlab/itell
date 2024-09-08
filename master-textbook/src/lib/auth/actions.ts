"use server";
import { User, Session as _Session } from "lucia";
import { cookies } from "next/headers";
import { memoize } from "nextjs-better-unstable-cache";
import "server-only";
import { Tags } from "../constants";
import { lucia } from "./lucia";

export type GetSessionData =
	| { user: User; session: _Session }
	| { user: null; session: null };

export const getSession = memoize(
	async (): Promise<GetSessionData> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
		if (!sessionId) {
			return {
				user: null,
				session: null,
			};
		}
		const result = await lucia.validateSession(sessionId);
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes,
				);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes,
				);
			}
		} catch (err) {
			console.log("get session", err);
		}
		return result;
	},
	{
		persist: false,
		revalidateTags: [Tags.GET_SESSION],
	},
);

export const logout = async () => {
	const { session } = await getSession();
	if (session) {
		await lucia.invalidateSession(session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	}
};
