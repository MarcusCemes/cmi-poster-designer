import { SCHEMA, type Block } from "./schema";

type PreviewType = "pdf" | "svg";

interface AppState {
  error: string | null;
  name: string;
  preview: [string, PreviewType] | null;
  previewType: PreviewType;
  fields: Record<string, string>;
}

export let app = $state<AppState>({
  error: null,
  name: "Poster",
  preview: null,
  previewType: "svg",
  fields: generateFields(SCHEMA),
});

function generateFields(schema: Block[]): Record<string, string> {
  return Object.fromEntries(schema.map((block) => [block.id, ""]));
}
