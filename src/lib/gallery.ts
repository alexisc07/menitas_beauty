import type { Trabajo } from "@/components/placeholder-tile";

/**
 * Galería de trabajos.
 *
 * Para publicar una foto real:
 *   1. Guarda la imagen en `public/galeria/` (recomendado: vertical 4:5, JPG o WebP).
 *   2. Agrega `src` y `alt` al trabajo correspondiente. Ejemplo:
 *
 *      { id: "esculturales-nude", titulo: "Esculturales nude",
 *        src: "/galeria/esculturales-nude.jpg",
 *        alt: "Uñas esculturales largas en tono nude con acabado brillante" }
 *
 * Mientras no haya `src`, se muestra un marcador "Próximamente".
 */
export const TRABAJOS: Trabajo[] = [
  { id: "esculturales-nude", titulo: "Esculturales nude" },
  { id: "acrygel-frances", titulo: "Acrygel francés" },
  { id: "gelish-rojo", titulo: "Gelish rojo clásico" },
  { id: "diseno-floral", titulo: "Diseño floral a mano" },
  { id: "rubber-natural", titulo: "Rubber natural" },
  { id: "pedicure-gel", titulo: "Pedicure con gel" },
  { id: "henna-cejas", titulo: "Henna en cejas" },
  { id: "pestanas-clasicas", titulo: "Pestañas 1x1 clásicas" },
  { id: "encapsuladas", titulo: "Uñas encapsuladas" },
];
