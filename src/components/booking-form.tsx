"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  BLOQUES,
  construirMensaje,
  formatearFechaLarga,
  getBloquesParaFecha,
  urlSolicitud,
  type BloqueId,
} from "@/lib/availability";
import { INSTAGRAM_SIN_CONFIGURAR } from "@/lib/config";
import {
  CATEGORIAS,
  formatearDuracion,
  formatearPrecio,
  getServicio,
  serviciosPorCategoria,
  type Categoria,
} from "@/lib/services";
import { Calendario } from "./calendario";

const ORDEN: Categoria[] = ["unas", "cejas", "pestanas"];

/**
 * `true` solo después de hidratar. Permite leer la fecha real del navegador
 * sin provocar un desajuste entre el HTML del servidor y el del cliente.
 */
const sinSuscripcion = () => () => {};
function useEstaEnCliente() {
  return useSyncExternalStore(
    sinSuscripcion,
    () => true,
    () => false,
  );
}

function Paso({
  numero,
  titulo,
  descripcion,
  children,
  refSeccion,
}: {
  numero: number;
  titulo: string;
  descripcion?: string;
  children: React.ReactNode;
  refSeccion?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={refSeccion} tabIndex={-1} className="scroll-mt-28">
      <div className="flex items-baseline gap-3">
        <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-on-primary">
          {numero}
        </span>
        <div>
          <h2 className="text-xl text-ink sm:text-2xl">{titulo}</h2>
          {descripcion ? <p className="mt-1 text-sm text-muted">{descripcion}</p> : null}
        </div>
      </div>
      <div className="mt-5 pl-0 sm:pl-10">{children}</div>
    </div>
  );
}

export function BookingForm() {
  // `hoy` y el parámetro `?servicio=` solo existen en el cliente: se leen
  // después de hidratar para que el HTML del servidor y el del cliente coincidan.
  const enCliente = useEstaEnCliente();
  const hoy = useMemo(() => (enCliente ? new Date() : null), [enCliente]);

  const servicioDeUrl = useMemo(() => {
    if (!enCliente) return null;
    const id = new URLSearchParams(window.location.search).get("servicio");
    return id && getServicio(id) ? id : null;
  }, [enCliente]);

  // Lo que elige la persona manda sobre lo que venga en la URL.
  const [servicioElegido, setServicioElegido] = useState<string | null>(null);
  const servicioId = servicioElegido ?? servicioDeUrl;
  const setServicioId = setServicioElegido;

  const [fecha, setFecha] = useState<Date | null>(null);
  const [bloque, setBloque] = useState<BloqueId | null>(null);
  const [nombre, setNombre] = useState("");
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const refServicio = useRef<HTMLDivElement>(null);
  const refFecha = useRef<HTMLDivElement>(null);
  const refHorario = useRef<HTMLDivElement>(null);
  const refNombre = useRef<HTMLInputElement>(null);

  const servicio = servicioId ? getServicio(servicioId) : undefined;
  const nombreValido = nombre.trim().length >= 2;

  const bloquesDisponibles = useMemo(
    () => (fecha && hoy ? getBloquesParaFecha(fecha, hoy) : []),
    [fecha, hoy],
  );

  // Al cambiar de día, el bloque elegido deja de ser válido.
  function elegirFecha(nueva: Date) {
    setFecha(nueva);
    setBloque(null);
  }

  const completo = Boolean(servicio && fecha && bloque && nombreValido);

  const mensaje =
    servicio && fecha && bloque && nombreValido
      ? construirMensaje({ servicio, fecha, bloque, nombre })
      : null;

  // Se reinicia si la persona cambia algo después de copiar.
  const [copiadoDe, setCopiadoDe] = useState<string | null>(null);
  const [falloCopia, setFalloCopia] = useState(false);
  const copiado = copiadoDe !== null && copiadoDe === mensaje;

  /** Selecciona el mensaje en pantalla para que se pueda copiar a mano. */
  function seleccionarMensaje(): boolean {
    const nodo = document.getElementById("mensaje-cita");
    if (!nodo) return false;
    const rango = document.createRange();
    rango.selectNodeContents(nodo);
    const seleccion = window.getSelection();
    seleccion?.removeAllRanges();
    seleccion?.addRange(rango);
    return true;
  }

  async function copiarMensaje() {
    if (!mensaje) return;

    // Plan A: portapapeles moderno.
    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiadoDe(mensaje);
      setFalloCopia(false);
      return;
    } catch {
      // Algunos navegadores lo bloquean; seguimos con el plan B.
    }

    // Plan B: seleccionar el texto e intentar el comando antiguo.
    if (seleccionarMensaje()) {
      let copio = false;
      try {
        copio = document.execCommand("copy");
      } catch {
        copio = false;
      }
      if (copio) {
        setCopiadoDe(mensaje);
        setFalloCopia(false);
        return;
      }
    }

    // Plan C: el texto queda seleccionado y se avisa para copiarlo a mano.
    setFalloCopia(true);
  }

  function irAlPendiente() {
    setIntentoEnvio(true);
    if (!servicio) return refServicio.current?.focus();
    if (!fecha) return refFecha.current?.focus();
    if (!bloque) return refHorario.current?.focus();
    if (!nombreValido) return refNombre.current?.focus();
  }

  const faltante = !servicio
    ? "Elige un servicio para continuar."
    : !fecha
      ? "Elige una fecha para continuar."
      : !bloque
        ? "Elige un horario para continuar."
        : !nombreValido
          ? "Escribe tu nombre para continuar."
          : null;

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      {/* ------------------------------- Pasos ------------------------------ */}
      <div className="flex flex-col gap-12 lg:col-span-7">
        {/* Paso 1 — servicio */}
        <Paso
          numero={1}
          titulo="Elige tu servicio"
          descripcion="Los precios con rango dependen del largo y el diseño."
          refSeccion={refServicio}
        >
          <div className="flex flex-col gap-7">
            {ORDEN.map((categoria) => (
              <fieldset key={categoria}>
                <legend className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-muted">
                  {CATEGORIAS[categoria].label}
                </legend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {serviciosPorCategoria(categoria).map((s) => {
                    const activo = servicioId === s.id;
                    return (
                      <label
                        key={s.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-[border-color,background-color] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                          activo
                            ? "border-primary bg-primary-soft/60"
                            : "border-hairline bg-canvas hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="servicio"
                          value={s.id}
                          checked={activo}
                          onChange={() => setServicioId(s.id)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                            activo ? "border-primary bg-primary" : "border-muted/50"
                          }`}
                        >
                          {activo ? (
                            <span className="size-1.5 rounded-full bg-on-primary" />
                          ) : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-ink">
                            {s.nombre}
                          </span>
                          <span className="tabular mt-0.5 block text-sm text-body">
                            {formatearPrecio(s)}
                            <span className="text-muted">
                              {" "}
                              &middot; {formatearDuracion(s.duracionMin)}
                            </span>
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </Paso>

        {/* Paso 2 — fecha */}
        <Paso
          numero={2}
          titulo="Elige el día"
          descripcion="De lunes a sábado. Domingo cerrado."
          refSeccion={refFecha}
        >
          {hoy ? (
            <Calendario hoy={hoy} seleccionada={fecha} onSeleccionar={elegirFecha} />
          ) : (
            <div
              aria-hidden="true"
              className="h-[420px] animate-pulse rounded-xl border border-hairline bg-surface-card/60"
            />
          )}
        </Paso>

        {/* Paso 3 — horario y nombre */}
        <Paso
          numero={3}
          titulo="Elige el horario"
          descripcion="Dos bloques por día, de 15:00 a 20:00."
          refSeccion={refHorario}
        >
          {fecha ? (
            <fieldset>
              <legend className="sr-only">
                Horarios disponibles para {formatearFechaLarga(fecha)}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {bloquesDisponibles.map((b) => {
                  const activo = bloque === b.id;
                  return (
                    <label
                      key={b.id}
                      className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-5 transition-[border-color,background-color] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                        activo
                          ? "border-primary bg-primary-soft/60"
                          : "border-hairline bg-canvas hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="bloque"
                        value={b.id}
                        checked={activo}
                        onChange={() => setBloque(b.id)}
                        className="sr-only"
                      />
                      <span className="tabular font-[family-name:var(--font-display)] text-2xl text-ink">
                        {b.label}
                      </span>
                      <span className="tabular text-sm text-muted">{b.rango}</span>
                      <span className="text-xs text-muted">{b.descripcion}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : (
            <p className="rounded-xl border border-dashed border-hairline px-5 py-6 text-sm text-muted">
              Primero elige un día en el calendario.
            </p>
          )}

          <div className="mt-7">
            <label htmlFor="nombre" className="block text-sm font-medium text-ink">
              Tu nombre
            </label>
            <input
              ref={refNombre}
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="name"
              spellCheck={false}
              placeholder="Por ejemplo: Ana López…"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              aria-invalid={intentoEnvio && !nombreValido ? true : undefined}
              aria-describedby={intentoEnvio && !nombreValido ? "nombre-error" : undefined}
              className="mt-2 h-12 w-full rounded-lg border border-hairline bg-canvas px-4 text-base text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:border-primary focus:shadow-[0_0_0_3px_rgba(169,96,77,0.15)] focus:outline-none sm:max-w-sm"
            />
            {intentoEnvio && !nombreValido ? (
              <p id="nombre-error" className="mt-2 text-sm text-primary">
                Escribe tu nombre para que Menita sepa quién agenda.
              </p>
            ) : null}
          </div>
        </Paso>
      </div>

      {/* ------------------------------ Resumen ----------------------------- */}
      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <div className="rounded-2xl border border-hairline bg-surface-card p-6 sm:p-7">
            <h2 className="text-xl text-ink">Resumen de tu cita</h2>

            <dl className="mt-6 flex flex-col gap-4 text-sm" aria-live="polite">
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
                <dt className="shrink-0 text-muted">Servicio</dt>
                <dd className="min-w-0 text-right text-ink">
                  {servicio ? servicio.nombre : <span className="text-muted/70">—</span>}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
                <dt className="shrink-0 text-muted">Precio</dt>
                <dd className="tabular min-w-0 text-right text-ink">
                  {servicio ? (
                    formatearPrecio(servicio)
                  ) : (
                    <span className="text-muted/70">—</span>
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-hairline pb-4">
                <dt className="shrink-0 text-muted">Fecha</dt>
                <dd className="min-w-0 text-right text-ink first-letter:uppercase">
                  {fecha ? formatearFechaLarga(fecha) : <span className="text-muted/70">—</span>}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="shrink-0 text-muted">Horario</dt>
                <dd className="tabular min-w-0 text-right text-ink">
                  {bloque ? (
                    BLOQUES.find((b) => b.id === bloque)?.rango
                  ) : (
                    <span className="text-muted/70">—</span>
                  )}
                </dd>
              </div>
            </dl>

            {completo && mensaje ? (
              <div className="mt-7">
                {/* Acción principal — ir al perfil de Instagram */}
                <a
                  href={urlSolicitud()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-on-primary transition-colors duration-200 hover:bg-primary-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                  Escribirme por Instagram
                </a>

                <p className="mt-3 text-center text-xs leading-relaxed text-muted">
                  Te llevamos a mi perfil. Mándame un mensaje directo con tu cita.
                </p>

                {/* Opcional — copiar el resumen para pegarlo en el chat */}
                <details className="group mt-5 border-t border-hairline pt-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-medium text-ink transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    <span>Copiar los datos de mi cita (opcional)</span>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>

                  <div className="mt-3 rounded-xl border border-hairline bg-canvas p-4">
                    <p
                      id="mensaje-cita"
                      className="whitespace-pre-line text-sm leading-relaxed text-body"
                    >
                      {mensaje}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copiarMensaje}
                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-hairline bg-canvas px-5 text-sm font-medium text-ink transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      {copiado ? (
                        <path d="M20 6 9 17l-5-5" />
                      ) : (
                        <>
                          <rect x="9" y="9" width="11" height="11" rx="2" />
                          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                        </>
                      )}
                    </svg>
                    {copiado ? "¡Copiado!" : "Copiar"}
                  </button>

                  <p
                    aria-live="polite"
                    className={`mt-2.5 text-center text-xs leading-relaxed ${
                      falloCopia ? "text-primary" : "text-muted"
                    }`}
                  >
                    {falloCopia
                      ? "Tu navegador no nos dejó copiar. El texto ya quedó seleccionado: cópialo con Ctrl+C (o mantén presionado y elige «Copiar» en el celular)."
                      : copiado
                        ? "Listo, pégalo en el chat."
                        : "Así no tengo que preguntarte los datos por chat."}
                  </p>
                </details>
              </div>
            ) : (
              <div className="mt-7">
                <button
                  type="button"
                  onClick={irAlPendiente}
                  aria-describedby="resumen-pendiente"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-hairline bg-canvas px-5 text-sm font-medium text-muted transition-colors duration-200 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Completa los datos
                </button>

                <p
                  id="resumen-pendiente"
                  aria-live="polite"
                  className="mt-3 text-center text-xs leading-relaxed text-muted"
                >
                  {faltante}
                </p>
              </div>
            )}

            <p className="mt-6 border-t border-hairline pt-5 text-xs leading-relaxed text-muted">
              Este calendario muestra el horario de Menita, no su agenda en tiempo real.
              Tu cita queda apartada hasta que ella te confirme por Instagram.
            </p>
          </div>

          {INSTAGRAM_SIN_CONFIGURAR ? (
            <p className="mt-4 rounded-xl border border-primary/30 bg-primary-soft/50 px-4 py-3 text-xs leading-relaxed text-ink">
              <strong className="font-medium">Falta configurar el Instagram.</strong> Abre{" "}
              <code className="rounded bg-canvas px-1 py-0.5" translate="no">
                src/lib/config.ts
              </code>{" "}
              y escribe el usuario real para que el botón funcione.
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
