import Link from "next/link";
import { formatearDuracion, formatearPrecio, type Service } from "@/lib/services";
import { Badge } from "./ui";

export function ServiceCard({ servicio }: { servicio: Service }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-hairline bg-surface-card p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-28px_rgba(26,22,19,0.45)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl text-ink sm:text-2xl">{servicio.nombre}</h3>
        {servicio.id === "retiro" ? <Badge tone="primary">Gratis con tu set</Badge> : null}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-body">{servicio.descripcion}</p>

      <dl className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-hairline pt-5">
        <div>
          <dt className="sr-only">Precio</dt>
          <dd className="tabular font-[family-name:var(--font-display)] text-2xl text-ink">
            {formatearPrecio(servicio)}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Duración aproximada</dt>
          <dd className="text-sm text-muted">
            Aprox. <span className="tabular">{formatearDuracion(servicio.duracionMin)}</span>
          </dd>
        </div>
      </dl>

      {servicio.nota ? <p className="mt-3 text-sm text-primary">{servicio.nota}</p> : null}

      <Link
        href={`/agendar?servicio=${servicio.id}`}
        className="mt-6 inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-medium text-ink transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Agendar este servicio
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <span className="sr-only">: {servicio.nombre}</span>
      </Link>
    </article>
  );
}
