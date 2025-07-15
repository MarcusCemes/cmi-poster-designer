import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { fail, redirect } from "@sveltejs/kit";

const EMAIL_REGEX =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export async function load({ locals }) {
    return locals.user ? redirect(302, "/") : {};
}

export const actions = {
    default: async ({ cookies, request }) => {
        const formData = await request.formData();
        const email = formData.get("email");

        if (!validateEmail(email)) {
            return fail(400, { message: "Invalid email." });
        }

        const user = await getOrCreateUser(email);
        const sessionToken = auth.generateSessionToken();
        const session = await auth.createSession(sessionToken, user.id);

        auth.setSessionTokenCookie(cookies, sessionToken, session.expiresAt);

        return redirect(302, "/");
    },
};

async function getOrCreateUser(email: string) {
    const [user] = await db
        .insert(table.user)
        .values({ email })
        .onConflictDoUpdate({ target: table.user.email, set: { email } })
        .returning();

    return user;
}

function validateEmail(email: unknown): email is string {
    return typeof email === "string" && EMAIL_REGEX.test(email);
}
