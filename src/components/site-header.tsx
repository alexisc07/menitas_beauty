"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/config";
import { ButtonLink, Container, Wordmark } from "./ui";

export function SiteHeader() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [condensado, setCondensado] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setCondensado(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú al cambiar de página, ajustando el estado durante el render
  // en lugar de usar un efecto (evita un render en cascada).
  const [rutaPrevia, setRutaPrevia] = useState(pathname);
  if (pathname !== rutaPrevia) {
    setRutaPrevia(pathname);
    setAbierto(false);
  }

  // Bloquea el scroll de fondo y atrapa el foco mientras el menú está abierto.
  useEffect(() => {
    if (!abierto) return;

    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
        return;
      }
      if (evento.key !== "Tab" || !panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (focusables.length === 0) return;
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];

      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previo;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [abierto]);

  const esActivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        condensado
          ? "border-hairline bg-canvas/85 backdrop-blur-md"
          : "border-transparent bg-canvas"
      }`}
    >
      <Container>
        <div
          className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${
            condensado ? "h-16" : "h-20"
          }`}
        >
          <Link
            href="/"
            className="rounded-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <Wordmark />
            <span className="sr-only">— ir a la página de inicio</span>
          </Link>

          <nav aria-label="Navegación principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={esActivo(link.href) ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-md px-3 text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      esActivo(link.href)
                        ? "bg-surface-card text-ink"
                        : "text-body hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* El contenedor controla la visibilidad: la clase `inline-flex`
                del botón gana a `hidden` si se aplican al mismo elemento. */}
            <div className="hidden sm:block">
              <ButtonLink href="/agendar">Agendar cita</ButtonLink>
            </div>

            <button
              ref={botonRef}
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex size-11 items-center justify-center rounded-lg border border-hairline text-ink transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                {abierto ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        ref={panelRef}
        hidden={!abierto}
        className="border-t border-hairline bg-canvas md:hidden"
        style={{ overscrollBehavior: "contain" }}
      >
        <Container>
          <nav aria-label="Navegación móvil" className="py-4">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={esActivo(link.href) ? "page" : undefined}
                    className={`flex min-h-12 items-center rounded-lg px-3 text-base transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      esActivo(link.href)
                        ? "bg-surface-card text-ink"
                        : "text-body hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <ButtonLink href="/agendar" className="w-full">
                  Agendar cita
                </ButtonLink>
              </li>
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
