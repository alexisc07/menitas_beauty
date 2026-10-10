import Image from "next/image";
import { Sparkle } from "./ui";

/**
 * Marcador de posición para las fotos que aún no se suben.
 * Cuando exista `src`, se muestra la foto real en su lugar.
 */
export type Trabajo = {
  id: string;
  titulo: string;
  /** Ruta dentro de /public, p. ej. "/galeria/esculturales-01.jpg". */
  src?: string;
  /** Texto alternativo de la foto. Obligatorio cuando hay src. */
  alt?: string;
};

const TONOS = [
  "from-surface-card to-primary-soft",
  "from-primary-soft to-surface-soft",
  "from-surface-soft to-surface-card",
  "from-[#efe3da] to-[#f7f0e7]",
] as const;

export function PlaceholderTile({
  trabajo,
  indice = 0,
  priority = false,
  className = "",
}: {
  trabajo: Trabajo;
  indice?: number;
  priority?: boolean;
  className?: string;
}) {
  const tieneFoto = Boolean(trabajo.src);

  return (
    <figure
      className={`group relative isolate overflow-hidden rounded-xl border border-hairline bg-surface-card ${className}`}
    >
      <div className="relative aspect-4/5 w-full">
        {tieneFoto ? (
          <Image
            src={trabajo.src as string}
            alt={trabajo.alt ?? trabajo.titulo}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className={`flex size-full flex-col items-center justify-center gap-3 bg-linear-to-br ${
              TONOS[indice % TONOS.length]
            }`}
          >
            <Sparkle className="size-7 text-primary/45" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary/55">
              Próximamente
            </span>
          </div>
        )}
      </div>

      <figcaption className="flex items-center justify-between gap-2 border-t border-hairline px-4 py-3">
        <span className="truncate text-sm text-ink">{trabajo.titulo}</span>
        {!tieneFoto ? <span className="shrink-0 text-xs text-muted">Foto pendiente</span> : null}
      </figcaption>
    </figure>
  );
}
