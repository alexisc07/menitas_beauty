"use client";

import { useEffect, useRef, useState } from "react";
import {
  DIAS_SEMANA,
  claveFecha,
  construirMes,
  formatearFechaLarga,
  formatearMesAno,
  motivoCierre,
} from "@/lib/availability";

/** Cuántos meses hacia adelante se pueden consultar. */
const MESES_ADELANTE = 2;

const mismoDia = (a: Date, b: Date) => claveFecha(a) === claveFecha(b);

function sumarDias(fecha: Date, dias: number): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + dias);
}

function indiceMes(fecha: Date): number {
  return fecha.getFullYear() * 12 + fecha.getMonth();
}

export function Calendario({
  hoy,
  seleccionada,
  onSeleccionar,
}: {
  hoy: Date;
  seleccionada: Date | null;
  onSeleccionar: (fecha: Date) => void;
}) {
  const [mesActual, setMesActual] = useState(() => new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const [foco, setFoco] = useState<Date>(() => seleccionada ?? hoy);

  // Solo movemos el foco del navegador cuando la persona usa el teclado.
  const navegandoConTeclado = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const minMes = indiceMes(hoy);
  const maxMes = minMes + MESES_ADELANTE;
  const mesMostrado = indiceMes(mesActual);

  const puedeRetroceder = mesMostrado > minMes;
  const puedeAvanzar = mesMostrado < maxMes;

  const celdas = construirMes(mesActual.getFullYear(), mesActual.getMonth());

  useEffect(() => {
    if (!navegandoConTeclado.current) return;
    navegandoConTeclado.current = false;
    const boton = gridRef.current?.querySelector<HTMLButtonElement>(
      `[data-fecha="${claveFecha(foco)}"]`,
    );
    boton?.focus();
  }, [foco]);

  function moverFoco(nuevaFecha: Date) {
    const indice = indiceMes(nuevaFecha);
    if (indice < minMes || indice > maxMes) return;

    navegandoConTeclado.current = true;
    setFoco(nuevaFecha);
    if (indice !== mesMostrado) {
      setMesActual(new Date(nuevaFecha.getFullYear(), nuevaFecha.getMonth(), 1));
    }
  }

  function cambiarMes(delta: number) {
    const destino = new Date(mesActual.getFullYear(), mesActual.getMonth() + delta, 1);
    const indice = indiceMes(destino);
    if (indice < minMes || indice > maxMes) return;
    setMesActual(destino);

    // Mantén el foco dentro del mes visible.
    const diaFoco = Math.min(
      foco.getDate(),
      new Date(destino.getFullYear(), destino.getMonth() + 1, 0).getDate(),
    );
    setFoco(new Date(destino.getFullYear(), destino.getMonth(), diaFoco));
  }

  function onKeyDown(evento: React.KeyboardEvent<HTMLDivElement>) {
    const teclas: Record<string, () => void> = {
      ArrowRight: () => moverFoco(sumarDias(foco, 1)),
      ArrowLeft: () => moverFoco(sumarDias(foco, -1)),
      ArrowDown: () => moverFoco(sumarDias(foco, 7)),
      ArrowUp: () => moverFoco(sumarDias(foco, -7)),
      Home: () => moverFoco(sumarDias(foco, -((foco.getDay() + 6) % 7))),
      End: () => moverFoco(sumarDias(foco, 6 - ((foco.getDay() + 6) % 7))),
      PageDown: () => {
        navegandoConTeclado.current = true;
        moverFoco(new Date(foco.getFullYear(), foco.getMonth() + 1, foco.getDate()));
      },
      PageUp: () => {
        navegandoConTeclado.current = true;
        moverFoco(new Date(foco.getFullYear(), foco.getMonth() - 1, foco.getDate()));
      },
    };

    const accion = teclas[evento.key];
    if (!accion) return;
    evento.preventDefault();
    accion();
  }

  return (
    <div className="rounded-xl border border-hairline bg-canvas p-3 sm:p-5">
      {/* Encabezado con navegación de mes */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => cambiarMes(-1)}
          disabled={!puedeRetroceder}
          aria-label="Mes anterior"
          className="inline-flex size-11 items-center justify-center rounded-lg border border-hairline text-ink transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-hairline disabled:hover:text-ink"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>

        <p aria-live="polite" className="text-center text-base font-medium text-ink first-letter:uppercase">
          {formatearMesAno(mesActual)}
        </p>

        <button
          type="button"
          onClick={() => cambiarMes(1)}
          disabled={!puedeAvanzar}
          aria-label="Mes siguiente"
          className="inline-flex size-11 items-center justify-center rounded-lg border border-hairline text-ink transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-hairline disabled:hover:text-ink"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* Encabezados de día */}
      <div className="mt-5 grid grid-cols-7 gap-1">
        {DIAS_SEMANA.map((dia) => (
          <div
            key={dia}
            aria-hidden="true"
            className="pb-2 text-center text-xs font-medium uppercase tracking-wider text-muted"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div
        ref={gridRef}
        role="grid"
        aria-label="Calendario de citas"
        onKeyDown={onKeyDown}
        className="grid grid-cols-7 gap-1"
      >
        {celdas.map((fecha, i) => {
          if (!fecha) {
            return <div key={`vacio-${i}`} role="presentation" />;
          }

          const cierre = motivoCierre(fecha, hoy);
          const cerrado = cierre !== null;
          const activa = seleccionada !== null && mismoDia(fecha, seleccionada);
          const esHoy = mismoDia(fecha, hoy);
          const enFoco = mismoDia(fecha, foco);

          const etiqueta =
            cierre === "lleno"
              ? `${formatearFechaLarga(fecha)} — sin horarios disponibles`
              : cerrado
                ? `${formatearFechaLarga(fecha)} — no disponible`
                : formatearFechaLarga(fecha);

          return (
            <button
              key={claveFecha(fecha)}
              type="button"
              role="gridcell"
              data-fecha={claveFecha(fecha)}
              tabIndex={enFoco ? 0 : -1}
              disabled={cerrado}
              aria-label={etiqueta}
              aria-selected={activa}
              aria-current={esHoy ? "date" : undefined}
              onClick={() => {
                setFoco(fecha);
                onSeleccionar(fecha);
              }}
              className={[
                // En 375 px siete columnas no caben con 44 px; 40 px sigue
                // siendo un objetivo táctil cómodo y evita recortar el domingo.
                "tabular relative flex aspect-square min-h-10 w-full scroll-mt-28 items-center justify-center rounded-lg text-sm transition-[background-color,color,border-color] duration-200 sm:min-h-11",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                cerrado
                  ? "cursor-not-allowed text-muted/40"
                  : activa
                    ? "bg-primary font-medium text-on-primary"
                    : "text-ink hover:bg-surface-card",
                !cerrado && !activa && esHoy ? "ring-1 ring-inset ring-primary/40" : "",
              ].join(" ")}
            >
              {fecha.getDate()}
              {esHoy && !activa ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 size-1 rounded-full bg-primary"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <p className="mt-4 border-t border-hairline pt-4 text-xs leading-relaxed text-muted">
        Los domingos, los días llenos y los días en gris no están disponibles. Puedes agendar hasta con{" "}
        {MESES_ADELANTE} meses de anticipación.
      </p>
    </div>
  );
}
