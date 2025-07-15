import { processImage } from "$lib/server/image";
import { error } from "@sveltejs/kit";

export async function POST({ locals, request }) {
    if (!locals.user) {
        error(401, "Unauthorized");
    }

    if (!request.body) {
        error(400, "No request body provided");
    }

    const image = await processImage(
        await request.arrayBuffer(),
        request.headers.get("content-type") || "image/jpeg",
    );

    return new Response(image.data, {
        headers: {
            "Content-Type": image.format === "jpeg" ? "image/jpeg" : "image/png",
            "Content-Length": image.size.toString(),
        },
    });
}
