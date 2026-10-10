export type Categoria = "unas" | "cejas" | "pestanas";

export type Service = {
  id: string;
  nombre: string;
  /** Precio en pesos. Si hay precioMax, se muestra como rango. */
  precioMin: number;
  precioMax?: number;
  /** Duración aproximada en minutos. Informativa. */
  duracionMin: number;
  descripcion: string;
  nota?: string;
  categoria: Categoria;
  destacado?: boolean;
};

export const CATEGORIAS: Record<Categoria, { label: string; descripcion: string }> = {
  unas: {
    label: "Uñas",
    descripcion: "Esculturales, acrygel, rubber, gelish y pedicure.",
  },
  cejas: {
    label: "Cejas",
    descripcion: "Henna y lifting para definir tu mirada.",
  },
  pestanas: {
    label: "Pestañas",
    descripcion: "Aplicación pelo a pelo con técnica clásica.",
  },
};

export const SERVICIOS: Service[] = [
  {
    id: "unas-esculturales",
    nombre: "Uñas esculturales",
    precioMin: 350,
    precioMax: 450,
    duracionMin: 150,
    descripcion:
      "Extensión esculpida a mano, con la forma y el largo que elijas. Acabado parejo y resistente.",
    nota: "El precio depende del diseño y el largo.",
    categoria: "unas",
    destacado: true,
  },
  {
    id: "acrygel",
    nombre: "Acrygel",
    precioMin: 350,
    precioMax: 450,
    duracionMin: 150,
    descripcion:
      "Lo mejor del acrílico y del gel: ligero, flexible y muy duradero. Ideal si tus uñas son delgadas.",
    nota: "El precio depende del diseño y el largo.",
    categoria: "unas",
    destacado: true,
  },
  {
    id: "rubber",
    nombre: "Rubber",
    precioMin: 300,
    duracionMin: 120,
    descripcion:
      "Base rubber para dar refuerzo y estructura a la uña natural, con brillo espejo.",
    categoria: "unas",
  },
  {
    id: "gelish",
    nombre: "Gelish",
    precioMin: 200,
    duracionMin: 60,
    descripcion:
      "Esmaltado semipermanente sobre uña natural. Color intacto por semanas.",
    categoria: "unas",
    destacado: true,
  },
  {
    id: "pedicure",
    nombre: "Pedicure",
    precioMin: 450,
    duracionMin: 90,
    descripcion:
      "Limpieza completa, limado, cutícula y esmaltado. Incluye gel para que dure mucho más.",
    nota: "Incluye gel.",
    categoria: "unas",
  },
  {
    id: "retiro",
    nombre: "Retiro",
    precioMin: 150,
    duracionMin: 30,
    descripcion:
      "Retiro seguro de tu set anterior, sin maltratar la uña natural.",
    nota: "Gratis si el set te lo hice yo.",
    categoria: "unas",
  },
  {
    id: "henna-cejas",
    nombre: "Henna en cejas",
    precioMin: 350,
    duracionMin: 45,
    descripcion:
      "Diseño y tinte con henna: define la forma y pigmenta también la piel para un efecto relleno.",
    categoria: "cejas",
    destacado: true,
  },
  {
    id: "lifting-cejas",
    nombre: "Lifting de cejas",
    precioMin: 250,
    duracionMin: 45,
    descripcion:
      "Alinea el vello hacia arriba para una ceja peinada, simétrica y con más presencia.",
    categoria: "cejas",
  },
  {
    id: "pestanas-clasica",
    nombre: "Aplicación de pestañas 1x1",
    precioMin: 200,
    duracionMin: 90,
    descripcion:
      "Técnica clásica pelo a pelo: una extensión por pestaña natural. Resultado natural y ligero.",
    nota: "Técnica clásica.",
    categoria: "pestanas",
    destacado: true,
  },
];

export function getServicio(id: string): Service | undefined {
  return SERVICIOS.find((s) => s.id === id);
}

export function serviciosPorCategoria(categoria: Categoria): Service[] {
  return SERVICIOS.filter((s) => s.categoria === categoria);
}

const formatoPeso = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatearPrecio(servicio: Service): string {
  const min = formatoPeso.format(servicio.precioMin);
  if (servicio.precioMax === undefined) return min;
  return `${min} – ${formatoPeso.format(servicio.precioMax)}`;
}

export function formatearDuracion(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  const horas = minutos / 60;
  const texto = Number.isInteger(horas) ? `${horas}` : horas.toFixed(1).replace(".", ",");
  return `${texto} h`;
}
