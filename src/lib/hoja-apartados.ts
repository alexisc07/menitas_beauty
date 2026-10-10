import { BLOQUES, type BloqueId } from "./availability";

/**
 * Lectura de la hoja de Google con los horarios apartados.
 *
 * Menita llena la hoja a mano desde el celular, así que aquí se aceptan
 * formatos variados. Columna A = fecha, columna B = horario. Se ignoran
 * el resto de las columnas y cualquier fila que no se entienda (por
 * ejemplo, el encabezado).
 *
 *   Fecha              Horario
 *   14/10/2026         15:00          -> 2026-10-14 15:00
 *   15 de octubre      5:30 pm        -> 2026-10-15 17:30
 *   16/10              tarde          -> 2026-10-16 15:00
 *   20/10/2026         todo el día    -> los dos bloques (día lleno)
 */

const TODOS: BloqueId[] = BLOQUES.map((b) => b.id);

const MESES: Record<string, number> = {
  enero: 1, ene: 1,
  febrero: 2, feb: 2,
  marzo: 3, mar: 3,
  abril: 4, abr: 4,
  mayo: 5, may: 5,
  junio: 6, jun: 6,
  julio: 7, jul: 7,
  agosto: 8, ago: 8,
  septiembre: 9, setiembre: 9, sep: 9, sept: 9,
  octubre: 10, oct: 10,
  noviembre: 11, nov: 11,
  diciembre: 12, dic: 12,
};

const sinAcentos = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "");

/* ------------------------------------ CSV ------------------------------------ */

/** CSV mínimo con soporte para comillas (por si una celda trae comas). */
export function parsearCSV(texto: string): string[][] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let celda = "";
  let entreComillas = false;

  for (let i = 0; i < texto.length; i += 1) {
    const c = texto[i];
    if (entreComillas) {
      if (c === '"' && texto[i + 1] === '"') {
        celda += '"';
        i += 1;
      } else if (c === '"') {
        entreComillas = false;
      } else {
        celda += c;
      }
    } else if (c === '"') {
      entreComillas = true;
    } else if (c === ",") {
      fila.push(celda);
      celda = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i += 1;
      fila.push(celda);
      filas.push(fila);
      fila = [];
      celda = "";
    } else {
      celda += c;
    }
  }
  if (celda !== "" || fila.length > 0) {
    fila.push(celda);
    filas.push(fila);
  }
  return filas;
}

/* ----------------------------------- Fechas ----------------------------------- */

function armarFecha(ano: number, mes: number, dia: number): string | null {
  const f = new Date(ano, mes - 1, dia);
  if (f.getFullYear() !== ano || f.getMonth() !== mes - 1 || f.getDate() !== dia) return null;
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/** Si no se escribe el año: el actual, o el siguiente si la fecha ya pasó hace rato. */
function inferirAno(mes: number, dia: number, hoy: Date): number {
  const ano = hoy.getFullYear();
  const fecha = new Date(ano, mes - 1, dia);
  const hace60Dias = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 60);
  return fecha < hace60Dias ? ano + 1 : ano;
}

/** Convierte lo que escriba Menita a "AAAA-MM-DD", o null si no se entiende. */
export function normalizarFecha(valor: string, hoy: Date): string | null {
  const t = sinAcentos(valor.trim().toLowerCase());
  if (!t) return null;

  // 2026-10-14
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return armarFecha(+m[1], +m[2], +m[3]);

  // 14/10/2026, 14-10-26, 14.10, 14/10 (día primero, como en México)
  m = t.match(/^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?$/);
  if (m) {
    const dia = +m[1];
    const mes = +m[2];
    const ano = m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : inferirAno(mes, dia, hoy);
    return armarFecha(ano, mes, dia);
  }

  // "14 de octubre", "martes 14 de octubre de 2026", "14 oct"
  m = t.match(/(\d{1,2})\s*(?:de\s+)?([a-z]+)\.?(?:\s*(?:de|del)?\s*(\d{4}))?/);
  if (m && MESES[m[2]]) {
    const dia = +m[1];
    const mes = MESES[m[2]];
    const ano = m[3] ? +m[3] : inferirAno(mes, dia, hoy);
    return armarFecha(ano, mes, dia);
  }

  return null;
}

/* ---------------------------------- Horarios ---------------------------------- */

/** Convierte lo que escriba Menita a los bloques que ocupa. Vacío si no se entiende. */
export function normalizarHorario(valor: string): BloqueId[] {
  const t = sinAcentos(valor.trim().toLowerCase());

  if (/noche/.test(t)) return ["17:30"];
  if (/tarde/.test(t)) return ["15:00"];
  // Celda vacía, "todo el día", "completo", "ambos", "cerrado": el día entero.
  if (!t || /todo|complet|ambos|dia|cerrad|lleno/.test(t)) return TODOS;

  const m = t.match(/(\d{1,2})(?:[:.h](\d{2}))?\s*(a\.?\s?m\.?|p\.?\s?m\.?)?/);
  if (!m) return [];

  let hora = +m[1];
  const minutos = m[2] ? +m[2] : 0;
  const sufijo = m[3]?.[0];
  if (sufijo === "p" && hora < 12) hora += 12;
  if (sufijo === "a" && hora === 12) hora = 0;
  // "3" o "5:30" sin am/pm: en este horario siempre es de tarde.
  if (!sufijo && hora >= 1 && hora <= 8) hora += 12;

  // Fuera del horario de atención no corresponde a ningún bloque.
  const total = hora * 60 + minutos;
  if (total < 14 * 60 || total >= 20 * 60) return [];

  // El bloque cuyo inicio esté más cerca: "4" -> 15:00, "5" -> 17:30.
  const aMinutos = (id: string) => {
    const [h, mm] = id.split(":").map(Number);
    return h * 60 + mm;
  };
  const cercano = BLOQUES.reduce((mejor, b) =>
    Math.abs(aMinutos(b.id) - total) < Math.abs(aMinutos(mejor.id) - total) ? b : mejor,
  );
  return [cercano.id];
}

/* ------------------------------------ Todo ------------------------------------ */

export type ResultadoHoja = {
  /** Claves "AAAA-MM-DD HH:MM", listas para BLOQUES_APARTADOS. */
  apartados: string[];
  /** Filas que no se pudieron leer (sin contar el encabezado). */
  ignoradas: string[][];
};

export function leerHoja(csv: string, hoy: Date): ResultadoHoja {
  const apartados = new Set<string>();
  const ignoradas: string[][] = [];

  parsearCSV(csv).forEach((fila, i) => {
    const [celdaFecha = "", celdaHorario = ""] = fila;
    if (!celdaFecha.trim() && !celdaHorario.trim()) return; // fila vacía

    const fecha = normalizarFecha(celdaFecha, hoy);
    const bloques = fecha ? normalizarHorario(celdaHorario) : [];

    if (!fecha || bloques.length === 0) {
      if (i > 0) ignoradas.push(fila); // la fila 0 suele ser el encabezado
      return;
    }
    for (const b of bloques) apartados.add(`${fecha} ${b}`);
  });

  return { apartados: [...apartados], ignoradas };
}

/** Descarga y lee la hoja. Lanza error si no responde en `limiteMs`. */
export async function descargarApartados(
  url: string,
  hoy: Date,
  limiteMs = 8000,
): Promise<ResultadoHoja> {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), limiteMs);
  try {
    const respuesta = await fetch(url, { signal: control.signal, cache: "no-store" });
    if (!respuesta.ok) throw new Error(`La hoja respondió ${respuesta.status}`);
    return leerHoja(await respuesta.text(), hoy);
  } finally {
    clearTimeout(temporizador);
  }
}
