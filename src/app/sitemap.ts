import type { MetadataRoute } from "next";
import { featuredOrder } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/projects`, changeFrequency: "weekly", priority: 0.8 },
    ...featuredOrder.map((slug) => ({
      url: `${site.url}/projects/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
