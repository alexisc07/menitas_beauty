/**
 * Configuración del negocio — punto único de edición.
 *
 * Lo que siga marcado con TODO todavía falta por llenar.
 * No hace falta tocar ningún otro archivo.
 */

/**
 * Usuario de Instagram de Menita, sin la @.
 * Las citas se piden por mensaje directo de Instagram.
 */
export const INSTAGRAM_USUARIO: string = "_menitasbeauty_";

/** true mientras el usuario siga siendo el de ejemplo. */
export const INSTAGRAM_SIN_CONFIGURAR = INSTAGRAM_USUARIO === "tu.usuario";

/**
 * Enlace CSV de la hoja de Google con los horarios apartados
 * (Archivo → Compartir → Publicar en la web → formato CSV).
 *
 * ⚠️ Esa hoja es pública: solo fecha y horario, nunca nombres ni teléfonos.
 * Vacío = no se usa hoja; solo cuenta BLOQUES_APARTADOS de availability.ts.
 */
export const URL_HOJA_APARTADOS: string = "";

/** Perfil público de Instagram: a donde llega la clienta para escribir. */
export const urlPerfilInstagram = () => `https://instagram.com/${INSTAGRAM_USUARIO}`;

export const NEGOCIO = {
  nombre: "Menita's Beauty",
  nombreCorto: "Menita's",
  eslogan: "Uñas, cejas y pestañas con acabado impecable.",
  descripcion:
    "Estudio de belleza especializado en uñas esculturales, acrygel, gelish, diseño de cejas y aplicación de pestañas. Trabajo detallado, materiales de calidad y un espacio tranquilo.",

  /** TODO: zona o ciudad donde atiende. */
  zona: "TODO: agregar zona o ciudad",

} as const;

/** Horario de atención. Domingo cerrado. */
export const HORARIO = {
  diasTexto: "Lunes a sábado",
  horasTexto: "15:00 – 20:00 h",
  /** 0 = domingo … 6 = sábado */
  diasAbiertos: [1, 2, 3, 4, 5, 6] as readonly number[],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/galeria", label: "Galería" },
  { href: "/faq", label: "Preguntas" },
] as const;

/** Dominio público del sitio. Cámbialo si algún día usas un dominio propio. */
export const SITE_URL = "https://menitas-beauty.netlify.app";
