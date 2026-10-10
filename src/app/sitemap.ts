import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/** Necesario con output: "export" — se genera una sola vez al construir. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = ["", "/servicios", "/galeria", "/agendar", "/faq"];
  const ahora = new Date();

  return rutas.map((ruta) => ({
    url: `${SITE_URL}${ruta}`,
    lastModified: ahora,
    changeFrequency: "monthly" as const,
    priority: ruta === "" ? 1 : 0.8,
  }));
}
