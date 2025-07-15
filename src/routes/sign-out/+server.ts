import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/auth.js";
import { redirect } from "@sveltejs/kit";

export async function GET({ cookies, locals }) {
    if (locals.session) {
        await invalidateSession(locals.session.id);
        deleteSessionTokenCookie(cookies);
    }

    redirect(302, "/sign-in");
}
