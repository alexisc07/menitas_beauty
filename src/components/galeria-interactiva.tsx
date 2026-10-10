"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlaceholderTile, type Trabajo } from "./placeholder-tile";
import { Reveal } from "./reveal";

/** Distancia mínima (px) para que un deslizamiento cuente como cambio de foto. */
const UMBRAL_SWIPE = 50;

export function GaleriaInteractiva({ trabajos }: { trabajos: Trabajo[] }) {
  const fotos = useMemo(() => trabajos.filter((t) => t.src), [trabajos]);
  const [indice, setIndice] = useState<number | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const disparadorRef = useRef<HTMLButtonElement | null>(null);
  const inicioToque = useRef<number | null>(null);

  const actual = indice !== null ? fotos[indice] : null;
  const total = fotos.length;

  // Sincroniza el <dialog> nativo con el estado.
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
    setIndice(i);
  }

  function alCerrar() {
    document.body.style.overflow = "";
    setIndice(null);
    // Devuelve el foco a la foto que se abrió.
    disparadorRef.current?.focus();
  }

  function mover(delta: number) {
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

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {fotos.map((trabajo, i) => (
          <Reveal as="li" key={trabajo.id} delay={(i % 3) * 80} className="group relative">
            <PlaceholderTile trabajo={trabajo} indice={i} priority={i < 3} />
            <button
              type="button"
              onClick={(e) => abrir(i, e.currentTarget)}
              aria-label={`Ver foto completa: ${trabajo.titulo}`}
              className="absolute inset-0 cursor-zoom-in rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            />
          </Reveal>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={alCerrar}
        onKeyDown={onKeyDown}
        onClick={(e) => {
          // Clic fuera de la foto (en el fondo) cierra el visor.
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
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-on-dark backdrop:bg-surface-dark/95"
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

            {/* Foto */}
            <div className="flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center">
              {/* Alto máximo = pantalla menos barra superior, botones y
                  márgenes (~12rem), para que nada se encime. */}
              <Image
                key={actual.id}
                src={actual.src as string}
                alt={actual.alt ?? actual.titulo}
                width={actual.ancho ?? 1200}
                height={actual.alto ?? 1200}
                // Es la foto que la persona pidió ver: sin carga diferida.
                loading="eager"
                fetchPriority="high"
                className="h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full rounded-lg object-contain"
                sizes="(min-width: 1024px) 70vw, 100vw"
              />
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
