import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/expenses",
    "/expenses/new",
    "/settlements",
    "/settlements/new",
    "/settlements/history",
    "/analytics",
    "/profile",
    "/settings",
    "/login",
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
