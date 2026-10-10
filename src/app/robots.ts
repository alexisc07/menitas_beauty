import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/** Necesario con output: "export" — se genera una sola vez al construir. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
