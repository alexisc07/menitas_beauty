"use client";

import Image from "next/image";
import Link from "next/link";
import type { AnimationEvent, CSSProperties, PointerEvent, ReactNode } from "react";
import type { Trabajo } from "./placeholder-tile";

/* ------------------------------ Aleatoriedad estable ------------------------------
   El ángulo y la cinta salen del id de la foto: el HTML del servidor y el del
   cliente coinciden (sin desajustes de hidratación) y cada foto conserva su
   "personalidad" aunque cambie de lugar. */

function hash(texto: string): number {
  let h = 0;
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/** Ángulo entre -4° y 4°, nunca demasiado recto. */
export function rotacionPorId(id: string): number {
  const r = ((hash(id) % 70) - 35) / 10;
  return Math.abs(r) < 1 ? r + (r < 0 ? -1.2 : 1.2) : r;
}

type Cinta = "centro" | "esquina" | "ninguna";
const CINTAS: Cinta[] = ["centro", "esquina", "ninguna"];
const cintaPorId = (id: string): Cinta => CINTAS[hash(id + "cinta") % CINTAS.length];

/* ----------------------------- Interacción con el mouse ----------------------------- */

const prefiereMenosMovimiento = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Inclina la foto en 3D siguiendo el cursor (solo con mouse). */
function inclinar(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse" || prefiereMenosMovimiento()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--rx", `${(x * 12).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${(-y * 12).toFixed(2)}deg`);
}

function enderezar(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.removeProperty("--rx");
  e.currentTarget.style.removeProperty("--ry");
}

/** Marca la foto como "ya aterrizada" para que no vuelva a caer al reordenarse. */
function aterrizar(e: AnimationEvent<HTMLElement>) {
  if (e.animationName === "snapshot-caer") e.currentTarget.dataset.aterrizado = "true";
}

/* ------------------------------------ Componente ------------------------------------ */

export function Snapshot({
  trabajo,
  rotacion = rotacionPorId(trabajo.id),
  retraso = 0,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  etiqueta,
  href,
  onAbrir,
}: {
  trabajo: Trabajo;
  rotacion?: number;
  /** Retraso de la animación de entrada, en ms. */
  retraso?: number;
  priority?: boolean;
  sizes?: string;
  /** Texto para lectores de pantalla. */
  etiqueta: string;
  /** Si hay href, la foto es un enlace; si no, un botón que llama a onAbrir. */
  href?: string;
  onAbrir?: (boton: HTMLButtonElement) => void;
}) {
  const cinta = cintaPorId(trabajo.id);
  const proporcion =
    trabajo.ancho && trabajo.alto ? `${trabajo.ancho} / ${trabajo.alto}` : "4 / 5";

  const estilo = {
    "--rot": `${rotacion}deg`,
    "--retraso": `${retraso}ms`,
    // Permite animar el "barajar" con View Transitions.
    viewTransitionName: `snap-${trabajo.id}`,
  } as CSSProperties;

  const contenido: ReactNode = (
    <>
      {cinta !== "ninguna" ? (
        <span aria-hidden="true" className={`snapshot-cinta snapshot-cinta--${cinta}`} />
      ) : null}
      <span className="snapshot-marco">
        <span
          className="relative block overflow-hidden bg-surface-card"
          style={{ aspectRatio: proporcion }}
        >
          {trabajo.src ? (
            <Image
              src={trabajo.src}
              alt={trabajo.alt ?? trabajo.titulo}
              fill
              sizes={sizes}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : undefined}
              className="object-cover"
            />
          ) : null}
          <span aria-hidden="true" className="snapshot-brillo" />
        </span>
      </span>
    </>
  );

  const comunes = {
    style: estilo,
    "aria-label": etiqueta,
    onPointerMove: inclinar,
    onPointerLeave: enderezar,
    onAnimationEnd: aterrizar,
    className:
      "snapshot w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
  };

  if (href) {
    return (
      <Link href={href} {...comunes}>
        {contenido}
      </Link>
    );
  }

  return (
    <button
      type="button"
      {...comunes}
      className={`${comunes.className} cursor-zoom-in`}
      onClick={(e) => onAbrir?.(e.currentTarget)}
    >
      {contenido}
    </button>
  );
}
