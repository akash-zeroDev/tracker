export type EditionStatus = 'Research' | 'Planned' | 'Prototype' | 'In Development';
export type Complexity = 'Low' | 'Medium' | 'High';
export type Impact = 'Low' | 'Medium' | 'High';
export interface EditionFeature {
  id: string;
  title: string;
  shortDescription: string;
  problemSolved: string;
  whyItExists: string;
  impact: Impact;
  complexity: Complexity;
  status: EditionStatus;
}
export const upcomingEditions: EditionFeature[] = [
  {
    id: "curated-exhibition",
    title: "The Curated Exhibition",
    shortDescription: "Allows the user to select specific, sealed fragments from their archive and arrange them into a public, beautifully typeset exhibition centered around a single theme.",
    problemSolved: "Provides a meaningful way to publicly present curated knowledge without exposing the entire archive.",
    whyItExists: "Inspired by museum curators selecting artifacts for a public exhibition.",
    impact: "High",
    complexity: "Medium",
    status: "Planned"
  },
  {
    id: "heirloom-export",
    title: "Heirloom Export (Print-Ready Typesetting)",
    shortDescription: "Compile selected archive volumes into professionally typeset, print-ready books complete with table of contents, index, and colophon.",
    problemSolved: "Transforms digital knowledge into a lasting physical artifact.",
    whyItExists: "Allows the archive to exist beyond software.",
    impact: "High",
    complexity: "High",
    status: "Research"
  },
  {
    id: "archivists-digest",
    title: "The Archivist's Digest",
    shortDescription: "Automatically produces an annual synthesis highlighting the most referenced, edited, and influential fragments from the past year.",
    problemSolved: "Helps users reflect on years of accumulated learning.",
    whyItExists: "Acts as a dedicated historian for the archive.",
    impact: "High",
    complexity: "High",
    status: "Research"
  },
  {
    id: "lineage-trees",
    title: "Lineage Trees",
    shortDescription: "Visualizes how a concept has evolved over time by tracking references, revisions, and connections across years.",
    problemSolved: "Shows intellectual growth instead of isolated notes.",
    whyItExists: "Treats knowledge as something living and evolving.",
    impact: "High",
    complexity: "High",
    status: "Research"
  }
];
