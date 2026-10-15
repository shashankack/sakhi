import type { ThemeId } from "@/lib/chat";

export type EssentialItem = {
  id: string;
  label: string;
  why: string;
  query: string;
};

export type QuickCommercePartner = {
  id: "blinkit" | "zepto" | "instamart";
  name: string;
  searchUrl: (query: string) => string;
};

/** Public search deep-links only  Aai never places orders or sells products. */
export const QUICK_COMMERCE: QuickCommercePartner[] = [
  {
    id: "blinkit",
    name: "Blinkit",
    searchUrl: (q) => `https://blinkit.com/s/?q=${encodeURIComponent(q)}`,
  },
  {
    id: "zepto",
    name: "Zepto",
    searchUrl: (q) =>
      `https://www.zeptonow.com/search?query=${encodeURIComponent(q)}`,
  },
  {
    id: "instamart",
    name: "Instamart",
    searchUrl: (q) =>
      `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(q)}`,
  },
];

const BY_THEME: Partial<Record<ThemeId, EssentialItem[]>> = {
  cycle_irregularity: [
    {
      id: "pads",
      label: "Sanitary pads / liners",
      why: "Handy if flow is unpredictable while you track patterns.",
      query: "sanitary pads",
    },
    {
      id: "heat",
      label: "Heating pad / hot water bag",
      why: "Warmth can ease period-related discomfort for some people.",
      query: "hot water bag",
    },
  ],
  acne: [
    {
      id: "gentle-wash",
      label: "Gentle face wash",
      why: "A mild cleanser is a common comfort pick for irritated skin.",
      query: "gentle face wash",
    },
    {
      id: "wipes",
      label: "Fragrance-free wipes",
      why: "Useful for freshening up without harsh scrubbing.",
      query: "fragrance free wet wipes",
    },
  ],
  hirsutism: [
    {
      id: "razor",
      label: "Sensitive skin razor",
      why: "If you choose hair removal, a gentle option may feel kinder.",
      query: "sensitive skin razor women",
    },
  ],
  weight_insulin: [
    {
      id: "electrolyte",
      label: "ORS / electrolyte drink",
      why: "Hydration support for warm days or low energy  not a treatment.",
      query: "ORS electrolyte",
    },
    {
      id: "nuts",
      label: "Nuts / protein snack",
      why: "A simple snack option if irregular hunger is part of your day.",
      query: "roasted nuts pack",
    },
  ],
  mood: [
    {
      id: "tea",
      label: "Herbal tea / calming drink",
      why: "A small comfort ritual  not a substitute for mental-health care.",
      query: "herbal tea",
    },
  ],
  fatigue: [
    {
      id: "ors-fatigue",
      label: "ORS / coconut water",
      why: "Gentle hydration if you feel drained; still talk to a clinician.",
      query: "coconut water",
    },
  ],
  hair_loss: [
    {
      id: "mild-shampoo",
      label: "Mild shampoo",
      why: "A gentle wash can feel kinder while you seek clinical advice.",
      query: "mild shampoo",
    },
  ],
  fertility_concerns: [
    {
      id: "preg-test",
      label: "Pregnancy test kit",
      why: "Optional home kit some people keep while trying to conceive  discuss results with a clinician.",
      query: "pregnancy test kit",
    },
  ],
};

const DEFAULT_ITEMS: EssentialItem[] = [
  {
    id: "pads-default",
    label: "Sanitary pads",
    why: "A practical staple many people keep at home.",
    query: "sanitary pads",
  },
  {
    id: "water",
    label: "Drinking water / ORS",
    why: "Hydration helps on heavy or warm days.",
    query: "ORS",
  },
  {
    id: "heat-default",
    label: "Heating pad",
    why: "Optional comfort for cramps or low backache.",
    query: "heating pad",
  },
];

const URGENT_COMFORT: EssentialItem[] = [
  {
    id: "pads-urgent",
    label: "Sanitary pads (extra absorbency)",
    why: "While you arrange urgent care  not a substitute for emergency help.",
    query: "sanitary pads xl",
  },
  {
    id: "ors-urgent",
    label: "ORS sachets",
    why: "Hydration comfort only. If you feel faint, seek emergency care first.",
    query: "ORS sachets",
  },
];

export function essentialsForContext(options: {
  themeIds?: string[];
  urgent?: boolean;
}): EssentialItem[] {
  const seen = new Set<string>();
  const out: EssentialItem[] = [];

  const push = (items: EssentialItem[]) => {
    for (const item of items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      out.push(item);
    }
  };

  if (options.urgent) push(URGENT_COMFORT);

  for (const id of options.themeIds || []) {
    const pack = BY_THEME[id as ThemeId];
    if (pack) push(pack);
  }

  if (out.length < 2) push(DEFAULT_ITEMS);

  return out.slice(0, 4);
}
