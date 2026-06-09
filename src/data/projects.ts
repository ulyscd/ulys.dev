/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectCurated {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  category: string;
  colorName: string;
  extraDetails: string[];
}

export const CURATED_PROJECTS: ProjectCurated[] = [
  {
    id: "fleur-sauvage",
    num: "01",
    title: "La Fleur Sauvage",
    subtitle: "Organic digital scent experiment",
    description: "An early study exploring cross-modal translation between fluid vector lines and notes of white dianthus, jasmine, and cedarwood. Built as an interactive sensory canvas.",
    date: "10.2003",
    category: "Net-Art / Kinetic Sound",
    colorName: "Blush Silk",
    extraDetails: [
      "Designed with 0.25mm vector coordinate clusters",
      "Interactive harmonic scale based on user cursor speed",
      "Premiered at the Tokyo Digital Horizon Showcase"
    ]
  },
  {
    id: "scent-silhouette",
    num: "02",
    title: "Scent & Silhouette",
    subtitle: "Fashion Editorial intro sequence",
    description: "A cinematic introduction crafted with high-contrast floral overlays and slow-fading layered transparencies, translating the weight of fine linen and soft wind into mathematical coordinate grids.",
    date: "04.2004",
    category: "Motion Design / Fashion",
    colorName: "Dianthus Blush",
    extraDetails: [
      "Custom bezier spline interpolations",
      "Translucent overlay transparency maps (30 layers)",
      "Soundscape engineered with low-frequency organ pads"
    ]
  },
  {
    id: "aura-editorial",
    num: "03",
    title: "Aura and Ephemera",
    subtitle: "Interactive digital publication",
    description: "A digital sanctuary documenting the fleeting nature of early-2000s net culture. Features elegant typography paired with kinetic line ornaments that drift like steam based on ambient focus.",
    date: "11.2004",
    category: "Hypertext / Typography",
    colorName: "Powder Rose",
    extraDetails: [
      "Over 40 micro-typography presets",
      "Kinetic responsive gravity particle fields",
      "Honorable mention - NetArt Frontier 2004"
    ]
  },
  {
    id: "blush-chronicles",
    num: "04",
    title: "The Blush Chronicles",
    subtitle: "Tactile vector sculpture",
    description: "A procedural flower generator mimicking the fractal growth of the Dianthus barbatus. Each blossom is simulated using thousands of delicate pink hairlines responding to micro-sonics.",
    date: "01.2005",
    category: "Generative Code / Art",
    colorName: "Pale Peony",
    extraDetails: [
      "Procedural math-art engine",
      "Real-time audio reactive blooming states",
      "Preserved in the Digital Fragility Archives"
    ]
  }
];
