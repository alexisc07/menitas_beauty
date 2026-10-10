import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Todas las rutas del sitio son estáticas, así que exportamos HTML plano.
   * Se publica en cualquier hosting (Netlify, Vercel, etc.) sin adaptadores.
   */
  output: "export",

  /**
   * La exportación estática no incluye el servidor de optimización de
   * imágenes, así que las fotos se sirven tal cual. Sube las imágenes de la
   * galería ya comprimidas (4:5, menos de 500 KB).
   */
  images: {
    unoptimized: true,
  },

  /** URLs con barra final: /servicios/ en lugar de /servicios */
  trailingSlash: true,
};

export default nextConfig;
