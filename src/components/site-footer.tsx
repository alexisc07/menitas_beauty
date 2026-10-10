import Link from "next/link";
import {
  HORARIO,
  INSTAGRAM_SIN_CONFIGURAR,
  INSTAGRAM_USUARIO,
  NAV_LINKS,
  NEGOCIO,
  urlPerfilInstagram,
} from "@/lib/config";
import { Container, Sparkle } from "./ui";

export function SiteFooter() {
  const ano = new Date().getFullYear();
  const zonaPendiente = NEGOCIO.zona.startsWith("TODO");

  return (
    <footer className="bg-surface-dark text-on-dark-soft">
      <Container>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-2 text-on-dark">
              <Sparkle className="size-4 text-accent" />
              <span translate="no" className="font-[family-name:var(--font-display)] text-xl">
                Menita&rsquo;s Beauty
              </span>
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">{NEGOCIO.eslogan}</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-on-dark">Sitio</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {[...NAV_LINKS, { href: "/agendar", label: "Agendar cita" }].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm transition-colors duration-200 hover:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-medium text-on-dark">Horario</h2>
            <p className="mt-4 text-sm">
              {HORARIO.diasTexto}
              <br />
              <span className="tabular">{HORARIO.horasTexto}</span>
              <br />
              <span className="text-on-dark-soft/70">Domingo cerrado</span>
            </p>

            {!zonaPendiente ? <p className="mt-4 text-sm">{NEGOCIO.zona}</p> : null}

            {!INSTAGRAM_SIN_CONFIGURAR ? (
              <a
                href={urlPerfilInstagram()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm transition-colors duration-200 hover:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                <span translate="no">@{INSTAGRAM_USUARIO}</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ano} <span translate="no">Menita&rsquo;s Beauty</span>. Todos los derechos
            reservados.
          </p>
          <p>Las citas se confirman por Instagram.</p>
        </div>
      </Container>
    </footer>
  );
}
