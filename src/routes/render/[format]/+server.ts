import { executeTypst } from "$lib/render.server.js";

const FORMAT_HEADERS: Record<string, string> = {
  svg: "image/svg+xml",
  pdf: "application/pdf",
  html: "text/html",
};

export async function POST({ params, request }) {
  const { format } = params;

  const contentType = FORMAT_HEADERS[format];

  if (!contentType) {
    return new Response("Unsupported format", { status: 400 });
  }

  const result = await executeTypst(await request.text(), format);
  const status = result.ok ? 200 : 400;

  return new Response(result.data, {
    headers: { "Content-Type": contentType },
    status,
  });
}
