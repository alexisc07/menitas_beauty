import { HORARIO, urlPerfilInstagram } from "./config";
import { formatearPrecio, type Service } from "./services";

/**
 * Días que Menita NO puede atender (vacaciones, cursos, asuntos personales).
 * Formato "AAAA-MM-DD". Agrega o quita líneas libremente.
 *
 *   export const FECHAS_BLOQUEADAS = ["2025-12-24", "2025-12-25"];
 */
export const FECHAS_BLOQUEADAS: string[] = [];

/** Los dos bloques de cita disponibles dentro del horario de 15:00 a 20:00. */
export const BLOQUES = [
  { id: "15:00", label: "15:00", rango: "15:00 – 17:30", descripcion: "Bloque de la tarde" },
  { id: "17:30", label: "17:30", rango: "17:30 – 20:00", descripcion: "Bloque de la noche" },
] as const;

export type BloqueId = (typeof BLOQUES)[number]["id"];

/**
 * Bloques que ya están apartados (citas confirmadas).
 * Formato "AAAA-MM-DD HH:MM", con la hora de inicio del bloque.
 *
 *   export const BLOQUES_APARTADOS = ["2026-10-14 15:00", "2026-10-14 17:30"];
 *
 * Si los dos bloques de un día están apartados, el día aparece como lleno.
 */
export const BLOQUES_APARTADOS: string[] = [];

/** Clave local "AAAA-MM-DD" sin pasar por UTC (evita corrimientos de día). */
export function claveFecha(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function aMedianoche(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

export type MotivoCierre = "pasado" | "domingo" | "bloqueada" | "lleno" | null;

export const claveBloque = (fecha: Date, bloque: BloqueId) => `${claveFecha(fecha)} ${bloque}`;

export function bloqueApartado(
  fecha: Date,
  bloque: BloqueId,
  apartados: readonly string[] = BLOQUES_APARTADOS,
): boolean {
  return apartados.includes(claveBloque(fecha, bloque));
}

/**
 * Por qué una fecha no se puede agendar, o null si sí se puede.
 * `hoy` se recibe como parámetro para que la función sea pura y testeable.
 */
export function motivoCierre(
  fecha: Date,
  hoy: Date,
  apartados: readonly string[] = BLOQUES_APARTADOS,
): MotivoCierre {
  if (aMedianoche(fecha) < aMedianoche(hoy)) return "pasado";
  if (!HORARIO.diasAbiertos.includes(fecha.getDay())) return "domingo";
  if (FECHAS_BLOQUEADAS.includes(claveFecha(fecha))) return "bloqueada";
  if (BLOQUES.every((b) => bloqueApartado(fecha, b.id, apartados))) return "lleno";
  return null;
}

export function estaDisponible(
  fecha: Date,
  hoy: Date,
  apartados: readonly string[] = BLOQUES_APARTADOS,
): boolean {
  return motivoCierre(fecha, hoy, apartados) === null;
}

/** Bloques de una fecha, cada uno indicando si ya está apartado. Vacío si el día está cerrado. */
export function getBloquesParaFecha(
  fecha: Date,
  hoy: Date,
  apartados: readonly string[] = BLOQUES_APARTADOS,
) {
  if (!estaDisponible(fecha, hoy, apartados)) return [];
  return BLOQUES.map((b) => ({ ...b, apartado: bloqueApartado(fecha, b.id, apartados) }));
}

/* ---------------------------------- Fechas --------------------------------- */

const fmtFechaLarga = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const fmtMesAno = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });
const fmtDiaMes = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long" });

export const formatearFechaLarga = (f: Date) => fmtFechaLarga.format(f);
export const formatearMesAno = (f: Date) => fmtMesAno.format(f);
export const formatearDiaMes = (f: Date) => fmtDiaMes.format(f);

/** Etiquetas de los días, semana iniciando en lunes. */
export const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

/**
 * Cuadrícula del mes: celdas nulas al inicio para alinear con el lunes,
 * seguidas de cada día del mes.
 */
export function construirMes(ano: number, mes: number): (Date | null)[] {
  const primero = new Date(ano, mes, 1);
  // getDay(): 0=domingo. Queremos 0=lunes.
  const offset = (primero.getDay() + 6) % 7;
  const diasEnMes = new Date(ano, mes + 1, 0).getDate();

  const celdas: (Date | null)[] = Array.from({ length: offset }, () => null);
  for (let dia = 1; dia <= diasEnMes; dia += 1) {
    celdas.push(new Date(ano, mes, dia));
  }
  return celdas;
}

/* -------------------------------- Instagram -------------------------------- */

export type SolicitudCita = {
  servicio: Service;
  fecha: Date;
  bloque: BloqueId;
  nombre: string;
};

/**
 * Resumen de la cita que la clienta puede copiar para pegarlo en el chat.
 *
 * Es opcional: el botón principal la lleva al perfil de Instagram. Instagram
 * no permite abrir un chat con el mensaje ya escrito (WhatsApp sí lo hacía
 * con `?text=`), así que copiar y pegar es la única forma de que la solicitud
 * llegue con servicio, fecha y horario.
 */
export function construirMensaje({ servicio, fecha, bloque, nombre }: SolicitudCita): string {
  const lineas = [
    "¡Hola Menita! Quiero agendar una cita ✨",
    "",
    `Servicio: ${servicio.nombre} (${formatearPrecio(servicio)})`,
    `Fecha: ${formatearFechaLarga(fecha)}`,
    `Horario: ${bloque} h`,
    "",
    `Mi nombre: ${nombre.trim()}`,
  ];
  return lineas.join("\n");
}

/** Perfil de Instagram de Menita, desde donde la clienta manda el mensaje. */
export function urlSolicitud(): string {
  return urlPerfilInstagram();
}
