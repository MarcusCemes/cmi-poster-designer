import { processImage } from "$lib/server/image.js";
import { sampleFormData } from "$lib/state.svelte.js";
import { error } from "@sveltejs/kit";
import { spawn } from "node:child_process";

async function compileTypst(typstCode: string, format: string): Promise<Response> {
    return new Promise((resolve, reject) => {
        const typst = spawn(
            "typst",
            [
                "compile",
                "-",
                "-",
                "--root",
                "templates",
                "--format",
                format,
                "--font-path",
                "templates/fonts",
            ],
            {
                stdio: ["pipe", "pipe", "pipe"],
            },
        );

        const startAt = Date.now();

        typst.on("error", (err) => {
            console.error("Failed to start Typst process:", err);
            reject(
                error(500, "Failed to start Typst process. Is Typst installed and in your PATH?"),
            );
        });

        const stdoutChunks: Buffer[] = [];
        let stderr = "";

        typst.stdout.on("data", (data) => {
            stdoutChunks.push(data);
        });

        typst.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        typst.on("close", (code) => {
            const elapsed = Date.now() - startAt;
            console.log(`[typst] Rendered in ${elapsed}ms`);

            if (code === 0) {
                const contentType = format === "svg" ? "image/svg+xml" : "application/pdf";
                const body = Buffer.concat(stdoutChunks);
                resolve(new Response(body, { headers: { "Content-Type": contentType } }));
            } else {
                console.error(`Typst stderr: ${stderr}`);
                reject(error(500, `Typst exited with code ${code}: ${stderr}`));
            }
        });

        typst.stdin.on("error", (err) => {
            console.error("Typst stdin error:", err);
        });

        typst.stdin.write(typstCode);
        typst.stdin.end();
    });
}

export async function POST({ locals, params, request }) {
    if (!locals.user) {
        error(401, "Unauthorized");
    }

    const { format } = params;

    if (!["svg", "pdf"].includes(format)) {
        throw error(400, `Unsupported format: ${format}`);
    }

    const formData = await request.json();
    const watermark = format === "svg" ? "PREVIEW" : "";
    const sampleData = sampleFormData();

    const finalData = {
        title: formData.title || sampleData.title,
        authors: formData.authors || sampleData.authors,
        affiliation: formData.affiliation || sampleData.affiliation,
        objective: formData.objective || sampleData.objective,
        perspectives: formData.perspectives || sampleData.perspectives,
        publication: formData.publication || sampleData.publication,
        funding: formData.funding || sampleData.funding,
        figures: formData.figures,
    };

    const placeholderImages = await getPlaceholderImages();

    for (let i = 0; i < finalData.figures.length; i++) {
        if (!finalData.figures[i].image) {
            finalData.figures[i].image = placeholderImages[i % placeholderImages.length];
        }
    }

    const figuresTypstArray = `(${finalData.figures
        .map((fig: any) => `(image: "${fig.image}", caption: "${fig.caption || ""}")`)
        .join(", ")})`;

    const templatePath = "template.typ";
    const typstCode = `
#import "${templatePath}": poster

#poster(
  title: "${finalData.title}",
  authors: "${finalData.authors}",
  affiliation: "${finalData.affiliation}",
  objective: "${finalData.objective}",
  perspectives: "${finalData.perspectives}",
  publication: "${finalData.publication}",
  funding: "${finalData.funding}",
  figures: ${figuresTypstArray},
  watermark: "${watermark}"
)
`;

    try {
        return await compileTypst(typstCode, format);
    } catch (e: any) {
        // If compileTypst rejects with a SvelteKit error, re-throw it
        if (e.status) {
            throw e;
        }
        console.error(e);
        throw error(500, `Failed to generate the poster: ${e.message}`);
    }
}

const PLACEHOLDER_URLS = [
    "https://picsum.photos/id/827/3333/5000",
    "https://picsum.photos/id/869/2000/1333",
    "https://picsum.photos/id/465/4928/3264",
    "https://picsum.photos/id/866/4704/3136",
];

let placeholderImages: string[] | undefined;

async function getPlaceholderImages() {
    return (placeholderImages ??= await Promise.all(
        PLACEHOLDER_URLS.map(async (url) => {
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`Failed to fetch image from ${url}: ${response.statusText}`);
                return "";
            }

            const buffer = await response.arrayBuffer();
            const contentType = response.headers.get("content-type") || "image/jpeg";

            const image = await processImage(buffer, contentType);
            const base64 = Buffer.from(image.data).toString("base64");

            return `data:${contentType};base64,${base64}`;
        }),
    ));
}
