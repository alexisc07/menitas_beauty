import type { Metadata } from "next";
import { CATEGORIAS, SERVICIOS, serviciosPorCategoria, type Categoria } from "@/lib/services";
import { ServiceCard } from "@/components/service-card";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { HORARIO } from "@/lib/config";

export const metadata: Metadata = {
  title: "Servicios y precios",
  description:
    "Lista completa de servicios y precios: uñas esculturales, acrygel, rubber, gelish, pedicure, henna y lifting de cejas, y aplicación de pestañas 1x1.",
};

const ORDEN: Categoria[] = ["unas", "cejas", "pestanas"];

export default function ServiciosPage() {
  return (
    <>
      <Section className="pb-8 sm:pb-10">
        <Container>
          <SectionHeading
            eyebrow="Carta de servicios"
            as="h1"
            title="Precios claros, sin sorpresas al final."
            description="Cada servicio incluye preparación, limado y acabado. Si tienes dudas sobre cuál te conviene, escríbeme y lo vemos juntas."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/agendar">Agendar cita</ButtonLink>
            <ButtonLink href="/faq" variant="secondary">
              Ver políticas
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-muted">
            {HORARIO.diasTexto} · <span className="tabular">{HORARIO.horasTexto}</span>
          </p>
        </Container>
      </Section>

      {ORDEN.map((categoria, indice) => {
        const servicios = serviciosPorCategoria(categoria);
        const info = CATEGORIAS[categoria];
        const fondo = indice % 2 === 1 ? "bg-surface-soft" : "";

        return (
          <Section key={categoria} id={categoria} className={`py-12 sm:py-16 ${fondo}`}>
            <Container>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline pb-5">
                <h2 className="text-2xl text-ink sm:text-3xl">{info.label}</h2>
                <p className="text-sm text-muted">{info.descripcion}</p>
              </div>

              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {servicios.map((servicio, i) => (
                  <Reveal as="li" key={servicio.id} delay={i * 70} className="h-full">
                    <ServiceCard servicio={servicio} />
                  </Reveal>
                ))}
              </ul>
            </Container>
          </Section>
        );
      })}

      <Section className="pt-4">
        <Container>
          <div className="rounded-2xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="text-3xl text-on-primary sm:text-4xl">
              ¿Lista para tu próxima cita?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-on-primary/85 sm:text-base">
              Elige el servicio, el día y el horario que te acomode. Yo te confirmo por
              Instagram.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/agendar" variant="onDark">
                Agendar cita
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-on-primary/70">
              {SERVICIOS.length} servicios disponibles · {HORARIO.diasTexto}
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
