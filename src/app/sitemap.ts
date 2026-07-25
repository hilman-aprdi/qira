import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
const publicRoutes = ["/", "/quran", "/prayer-times", "/about", "/privacy-policy"];
export default function sitemap(): MetadataRoute.Sitemap { const surahRoutes = Array.from({ length: 114 }, (_, index) => index + 1).flatMap((number) => [`/quran/${number}`, `/tafsir/${number}`]); return [...publicRoutes, ...surahRoutes].map((url) => ({ url: absoluteUrl(url), lastModified: new Date() })); }
