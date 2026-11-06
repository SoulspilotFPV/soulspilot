import type { MetadataRoute } from "next";
import { site, works } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/progetti`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/chi-sono`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/benefici`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/contatti`, changeFrequency: "yearly", priority: 0.6 },
    ...works.map((w) => ({ url: `${site.url}/progetti/${w.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
