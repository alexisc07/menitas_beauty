"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import type { Trabajo } from "./placeholder-tile";
import { Reveal } from "./reveal";
import { Snapshot, rotacionPorId } from "./snapshot";

/** Distancia mínima (px) para que un deslizamiento cuente como cambio de foto. */
const UMBRAL_SWIPE = 50;

type Direccion = "abrir" | "siguiente" | "anterior";

/** Fisher–Yates. Garantiza un orden distinto al anterior si hay 2+ fotos. */
function mezclar<T>(lista: T[]): T[] {
  if (lista.length < 2) return lista;
  let copia: T[];
  do {
    copia = [...lista];
    for (let i = copia.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
  } while (copia.every((x, i) => x === lista[i]));
  return copia;
}

const rotacionAleatoria = () => {
  const r = Math.round((Math.random() * 8 - 4) * 10) / 10;
  return Math.abs(r) < 1 ? r + (r < 0 ? -1.2 : 1.2) : r;
};

export function GaleriaInteractiva({ trabajos }: { trabajos: Trabajo[] }) {
  // Orden y ángulos iniciales deterministas (iguales en servidor y cliente).
  const [fotos, setFotos] = useState(() => trabajos.filter((t) => t.src));
  const [rotaciones, setRotaciones] = useState<Record<string, number>>(() =>
    Object.fromEntries(trabajos.map((t) => [t.id, rotacionPorId(t.id)])),
  );
  const [vecesBarajado, setVecesBarajado] = useState(0);

  const [indice, setIndice] = useState<number | null>(null);
  const [direccion, setDireccion] = useState<Direccion>("abrir");

  const listaRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const disparadorRef = useRef<HTMLButtonElement | null>(null);
  const inicioToque = useRef<number | null>(null);

  const actual = indice !== null ? fotos[indice] : null;
  const total = fotos.length;

  /* --------------------------------- Visor --------------------------------- */

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (indice !== null && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (indice === null && dialog.open) {
      dialog.close();
    }
  }, [indice]);

  // Precarga la foto anterior y la siguiente para que las flechas sean instantáneas.
  useEffect(() => {
    if (indice === null || total < 2) return;
    for (const delta of [1, -1]) {
      const vecina = fotos[(indice + delta + total) % total];
      if (vecina?.src) new window.Image().src = vecina.src;
    }
  }, [indice, fotos, total]);

  function abrir(i: number, boton: HTMLButtonElement) {
    disparadorRef.current = boton;
    setDireccion("abrir");
    setIndice(i);
  }

  function alCerrar() {
    document.body.style.overflow = "";
    setIndice(null);
    disparadorRef.current?.focus();
  }

  function mover(delta: number) {
    setDireccion(delta > 0 ? "siguiente" : "anterior");
    setIndice((i) => (i === null ? i : (i + delta + total) % total));
  }

  function onKeyDown(evento: React.KeyboardEvent<HTMLDialogElement>) {
    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      mover(1);
    } else if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      mover(-1);
    }
  }

  /* -------------------------------- Barajar -------------------------------- */

  function barajar() {
    const nuevoOrden = mezclar(fotos);
    const nuevasRotaciones = Object.fromEntries(
      nuevoOrden.map((f) => [f.id, rotacionAleatoria()]),
    );
    const aplicar = () => {
      flushSync(() => {
        setFotos(nuevoOrden);
        setRotaciones(nuevasRotaciones);
        setVecesBarajado((v) => v + 1);
      });
    };

    const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof document.startViewTransition !== "function" || menosMovimiento) {
      aplicar();
      return;
    }

    // Las fotos "vuelan" a su nuevo lugar; sin soporte, el cambio es inmediato.
    const lista = listaRef.current;
    lista?.setAttribute("data-barajando", "");
    const transicion = document.startViewTransition(aplicar);
    transicion.finished.finally(() => lista?.removeAttribute("data-barajando"));
  }

  return (
    <>
      {/* Controles */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          <span className="tabular">{total}</span> trabajos &middot; toca una foto para verla
          en grande
        </p>
        <button
          type="button"
          onClick={barajar}
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-hairline bg-canvas px-5 text-sm font-medium text-ink transition-[border-color,color] duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-4 transition-transform duration-500 group-hover:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          Barajar fotos
        </button>
        <p aria-live="polite" className="sr-only">
          {vecesBarajado > 0 ? `Fotos barajadas (${vecesBarajado})` : ""}
        </p>
      </div>

      {/* Mesa de fotos */}
      <ul
        ref={listaRef}
        className="columns-2 gap-x-5 sm:columns-3 sm:gap-x-8 lg:columns-4 lg:gap-x-10"
      >
        {fotos.map((trabajo, i) => (
          <Reveal
            as="li"
            key={trabajo.id}
            className="snapshot-li mb-7 break-inside-avoid pt-3 sm:mb-10"
          >
            <Snapshot
              trabajo={trabajo}
              rotacion={rotaciones[trabajo.id]}
              retraso={(i % 4) * 110}
              priority={i < 4}
              etiqueta={`Ver foto completa: ${trabajo.titulo}`}
              onAbrir={(boton) => abrir(i, boton)}
            />
          </Reveal>
        ))}
      </ul>

      {/* Visor */}
      <dialog
        ref={dialogRef}
        onClose={alCerrar}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        onTouchStart={(e) => {
          inicioToque.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const inicio = inicioToque.current;
          const fin = e.changedTouches[0]?.clientX;
          inicioToque.current = null;
          if (inicio === null || fin === undefined) return;
          const delta = fin - inicio;
          if (Math.abs(delta) > UMBRAL_SWIPE) mover(delta < 0 ? 1 : -1);
        }}
        aria-label="Visor de fotos"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 text-on-dark backdrop:bg-surface-dark/95"
        style={{ overscrollBehavior: "contain" }}
      >
        {actual ? (
          <div
            className="flex h-full flex-col items-center justify-center gap-4 px-4 py-6 sm:px-16"
            onClick={(e) => {
              if (e.target === e.currentTarget) dialogRef.current?.close();
            }}
          >
            {/* Barra superior */}
            <div className="flex w-full max-w-5xl items-center justify-between gap-4">
              <p aria-live="polite" className="tabular text-sm text-on-dark-soft">
                {(indice ?? 0) + 1} / {total}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Cerrar visor"
                className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-on-dark transition-colors duration-200 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Foto como polaroid grande */}
            <div
              className="flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center"
              onClick={(e) => {
                if (e.target === e.currentTarget) dialogRef.current?.close();
              }}
            >
              <span
                key={actual.id}
                data-direccion={direccion}
                className="visor-polaroid inline-block max-w-full rounded-[3px] bg-[#fffdf8] p-2.5 pb-10 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] sm:p-4 sm:pb-16"
                style={
                  {
                    "--rot-visor": `${((rotaciones[actual.id] ?? 0) * 0.35).toFixed(2)}deg`,
                  } as CSSProperties
                }
              >
                {/* Alto máximo = pantalla menos barra, botones, márgenes y el
                    marco de la polaroid (~16rem), para que nada se encime. */}
                <Image
                  src={actual.src as string}
                  alt={actual.alt ?? actual.titulo}
                  width={actual.ancho ?? 1200}
                  height={actual.alto ?? 1200}
                  // Es la foto que la persona pidió ver: sin carga diferida.
                  loading="eager"
                  fetchPriority="high"
                  className="block h-auto max-h-[calc(100dvh-16rem)] w-auto max-w-full object-contain"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </span>
            </div>

            {/* Navegación */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => mover(-1)}
                aria-label="Foto anterior"
                className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-on-dark transition-colors duration-200 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <p className="hidden text-xs text-on-dark-soft sm:block">
                Usa las flechas del teclado o desliza
              </p>
              <button
                type="button"
                onClick={() => mover(1)}
                aria-label="Foto siguiente"
                className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-on-dark transition-colors duration-200 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
