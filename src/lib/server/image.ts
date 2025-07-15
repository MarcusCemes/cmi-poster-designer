import { error } from "@sveltejs/kit";
import sharp from "sharp";
import { optimize } from "svgo";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_IMAGE_DIMENSION = 1024;

export async function processImage(input: ArrayBuffer, contentType: string) {
    if (contentType === "image/svg+xml") {
        const svgString = new TextDecoder().decode(input);

        try {
            const { data } = optimize(svgString);

            const size = new TextEncoder().encode(data).length;

            if (size < MAX_IMAGE_SIZE) {
                return { data, format: "svg", size };
            }
        } catch {
            // ignore
        }
    }

    try {
        const result = await sharp(input)
            .resize({
                width: MAX_IMAGE_DIMENSION,
                height: MAX_IMAGE_DIMENSION,
                fit: "inside",
                withoutEnlargement: true,
            })
            .jpeg({ quality: 80 })
            .png({ quality: 80 })
            .toFormat(
                contentType === "image/svg+xml" || contentType === "image/png" ? "png" : "jpeg",
            )
            .toBuffer({ resolveWithObject: true });

        if (result.info.size > MAX_IMAGE_SIZE) {
            error(400, "Image exceeds maximum size of 10 MB");
        }

        return { data: result.data, format: result.info.format, size: result.info.size };
    } catch (e) {
        throw error(400, `Failed to process image: ${e}`);
    }
}
