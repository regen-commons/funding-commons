/** The eight forms of capital, with the glyphs and plain labels from DESIGN.md and VOICE.md. */
export interface Capital {
  readonly key: "living" | "material" | "intellectual" | "experiential" | "social" | "financial" | "cultural" | "spiritual";
  readonly glyph: string;
  readonly label: string;
}

export const CAPITALS: readonly Capital[] = [
  { key: "living", glyph: "Li", label: "Land and living things" },
  { key: "material", glyph: "Ma", label: "Tools and equipment" },
  { key: "intellectual", glyph: "In", label: "Knowledge" },
  { key: "experiential", glyph: "Ex", label: "Skills and know-how" },
  { key: "social", glyph: "So", label: "Relationships" },
  { key: "financial", glyph: "Fi", label: "Money" },
  { key: "cultural", glyph: "Cu", label: "Culture and story" },
  { key: "spiritual", glyph: "Sp", label: "Care and spirit" },
];
