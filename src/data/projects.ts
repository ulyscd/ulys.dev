/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectCurated {
  id: string;
  num: string;
  navLabel: string;
  title: string;
  subtitle: string;
  description: string;
  detailSubtitle?: string;
  detailUrl?: string;
  detailUrlLabel?: string;
  articleUrl?: string;
  date: string;
  category: string;
  colorName: string;
  extraDetails: string[];
  featuresLabel?: string;
  techStackLabel?: string;
  techStack?: string[];
}

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const CURATED_PROJECTS: ProjectCurated[] = [
  {
    id: "fleur-sauvage",
    num: "01",
    navLabel: "PROJECT",
    title: "Fish-E-Dex",
    subtitle: "fishing journal web app",
    description: "hook em' all! I built this poke-e-dex inspired fishing journal for me and my friends to have somewhere we can look back at the memories we made spending time outdoors and catching fish",
    detailSubtitle: "prolong fish pics and memories",
    detailUrl: "https://www.fishy.quest/",
    detailUrlLabel: "www.fishy.quest",
    date: "10.2003",
    category: "Net-Art / Kinetic Sound",
    colorName: "Blush Silk",
    extraDetails: [
      "log & browse your fishing memories with pictures, catch counts, scenery, field notes, and more!",
      "accumulate insights on your fishing patterns and tick off every species in the fish-e-dex journal."
    ],
    featuresLabel: "features:",
    techStackLabel: "tech stack:",
    techStack: [
      "Frontend: React, Vite",
      "Database & Auth: Supabase (PostgreSQL, Auth, Storage)",
      "Styling: Done with love."
    ]
  },
  {
    id: "scent-silhouette",
    num: "02",
    navLabel: "PROJECT",
    title: "PortFlo",
    subtitle: "supply chain mineral tracker",
    description: "This project was a QuackHacks 2026 winner! In 17 hours my team and I deployed this supply-chain intelligence dashboard for monitoring global risk across critical materials, trade routes, ports, suppliers, and chokepoints.",
    detailSubtitle: "real time risk assessment supply chain dashboard",
    detailUrl: "https://www.portflo.org",
    detailUrlLabel: "www.portflo.org",
    date: "04.2004",
    category: "Motion Design / Fashion",
    colorName: "Dianthus Blush",
    extraDetails: [
      "combines public data sources with an interactive globe.",
      "AI-powered daily briefings and risk scores pertaining to price and geo-political events."
    ],
    featuresLabel: "features:",
    techStackLabel: "tech stack:",
    techStack: [
      "Frontend: React, Vite, Typescript",
      "Backend: FastAPI on Uvicorn",
      "Database & Auth: Supabase (PostgreSQL, Auth, Storage)"
    ]
  },
  {
    id: "aura-editorial",
    num: "03",
    navLabel: "RESEARCH",
    title: "Leadership Research Article",
    subtitle: "political leader brands evaluation @ uoregon",
    description: "I explored how University of Oregon students define great leadership and evaluate real political figures against that standard.\n\nStarting with qualitative interviews to surface the traits students actually associate with excellent leadership, I built and deployed a survey, ran regression and crosstab analyses in IBM SPSS Statistics, and translated findings into a six-page data driven visual article.",
    detailSubtitle: "primary researcher, data analyst & author experience",
    detailUrlLabel: "view article",
    articleUrl: publicAsset("articles/leadership.pdf"),
    date: "[date]",
    category: "[category]",
    colorName: "[specification]",
    extraDetails: []
  },
  {
    id: "blush-chronicles",
    num: "04",
    navLabel: "TIMELINE",
    title: "Fish Pics",
    subtitle: "some memorable catches...",
    description: "",
    date: "[date]",
    category: "[category]",
    colorName: "[specification]",
    extraDetails: []
  }
];
