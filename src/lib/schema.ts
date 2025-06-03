export interface TextBlock {
  type: "text";
  content: string;
}

export interface ImageBlock {
  type: "image";
}

export type Block = { id: string } & (ImageBlock | TextBlock);

export const SCHEMA: Block[] = [
  {
    id: "title",
    type: "text",
    content: "Project Title",
  },
  {
    id: "authors",
    type: "text",
    content: "Author 1, Author 2, Author 3",
  },
  {
    id: "affiliation",
    type: "text",
    content: "Affiliation",
  },
  {
    id: "objective",
    type: "text",
    content: "Objective of the poster.",
  },
  {
    id: "perspectives",
    type: "text",
    content: "Perspectives on the research.",
  },
  {
    id: "publication",
    type: "text",
    content: "Publication details.",
  },
  {
    id: "funding",
    type: "text",
    content: "Funding information.",
  },
  {
    id: "image1",
    type: "image",
  },
  {
    id: "figure1_caption",
    type: "text",
    content: "Caption for Figure 1.",
  },
  {
    id: "image2",
    type: "image",
  },
  {
    id: "figure2_caption",
    type: "text",
    content: "Caption for Figure 2.",
  },
  {
    id: "image3",
    type: "image",
  },
  {
    id: "figure3_caption",
    type: "text",
    content: "Caption for Figure 3.",
  },
  {
    id: "image4",
    type: "image",
  },
  {
    id: "figure4_caption",
    type: "text",
    content: "Caption for Figure 4.",
  },
];

export function generateTemplate(fields: Record<string, string>): string {
  return `#import "template3.typ" as template

#template.poster(
  title: "${fields.title}",
  authors: "${fields.authors}",
  affiliation: "${fields.affiliation}",
  objective: "${fields.objective}",
  perspectives: "${fields.perspectives}",
  funding: "${fields.funding}",
  figure1_caption: "${fields.figure1_caption}",
  figure2_caption: "${fields.figure2_caption}",
  figure3_caption: "${fields.figure3_caption}",
  figure4_caption: "${fields.figure4_caption}",
  "${fields.image1}",
  "${fields.image2}",
  "${fields.image3}",
  "${fields.image4}",
)`;
}
