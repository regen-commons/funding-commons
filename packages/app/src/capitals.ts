/** The eight forms of capital, with the glyphs and plain labels from DESIGN.md and VOICE.md. */
export interface Capital {
  readonly key:
    | "living"
    | "material"
    | "intellectual"
    | "experiential"
    | "social"
    | "financial"
    | "cultural"
    | "spiritual";
  readonly glyph: string;
  readonly label: string;
  readonly description: string;
}

export const CAPITALS: readonly Capital[] = [
  {
    key: "living",
    glyph: "Li",
    label: "Land and living things",
    description: "Land, water, seeds, soil and the living systems they support.",
  },
  {
    key: "material",
    glyph: "Ma",
    label: "Tools and equipment",
    description: "Tools, materials, buildings, equipment and vehicles.",
  },
  {
    key: "intellectual",
    glyph: "In",
    label: "Knowledge",
    description: "Research, data, methods and what people have recorded.",
  },
  {
    key: "experiential",
    glyph: "Ex",
    label: "Skills and know-how",
    description: "Practical skills learned through doing and shared through teaching.",
  },
  {
    key: "social",
    glyph: "So",
    label: "Relationships",
    description: "Trust, introductions, partners and people who can help.",
  },
  {
    key: "financial",
    glyph: "Fi",
    label: "Money",
    description: "Grants, loans, donations and payment for the work.",
  },
  {
    key: "cultural",
    glyph: "Cu",
    label: "Culture and story",
    description: "Art, stories, music, language and shared cultural practices.",
  },
  {
    key: "spiritual",
    glyph: "Sp",
    label: "Care and spirit",
    description: "Care, ritual, meaning and connection to place.",
  },
];
