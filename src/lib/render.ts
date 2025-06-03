export async function render(
  document: string,
  format: string,
): Promise<{ ok: true; data: Blob } | { ok: false; error: string }> {
  const response = await fetch(`/render/${format}`, {
    body: document,
    method: "POST",
  });

  switch (response.status) {
    case 200:
      return { ok: true, data: await response.blob() };

    case 400:
      return { ok: false, error: await response.text() };

    default:
      return { ok: false, error: `Unexpected response code: ${response.status}` };
  }
}
