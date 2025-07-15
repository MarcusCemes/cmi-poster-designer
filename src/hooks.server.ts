import * as auth from "$lib/server/auth";

export async function handle({ event, resolve }) {
    const { cookies, locals } = event;

    const sessionToken = cookies.get(auth.sessionCookieName);

    if (!sessionToken) {
        locals.user = undefined;
        locals.session = undefined;
        return resolve(event);
    }

    const { session, user } = await auth.validateSessionToken(sessionToken);

    if (session) {
        auth.setSessionTokenCookie(cookies, sessionToken, session.expiresAt);
    } else {
        auth.deleteSessionTokenCookie(cookies);
    }

    locals.user = user;
    locals.session = session;

    return resolve(event);
}
