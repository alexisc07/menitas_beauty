import { SERVICIOS } from "@/lib/services";
import { TRABAJOS } from "@/lib/gallery";
import { HORARIO, NEGOCIO } from "@/lib/config";
import { ServiceCard } from "@/components/service-card";
import { PlaceholderTile } from "@/components/placeholder-tile";
import { Reveal } from "@/components/reveal";
import { Snapshot } from "@/components/snapshot";
import {
  Badge,
  ButtonLink,
  Container,
  Section,
  SectionHeading,
  Sparkle,
} from "@/components/ui";

const PASOS = [
  {
    numero: "01",
    titulo: "Elige tu servicio",
    texto: "Revisa la carta con precios y duración aproximada. Sin costos ocultos.",
  },
  {
    numero: "02",
    titulo: "Escoge día y horario",
    texto: "Dos bloques por día, de lunes a sábado. Tú eliges el que te acomode.",
  },
  {
    numero: "03",
    titulo: "Confirmamos por Instagram",
    texto: "Te llevamos a mi Instagram para que me escribas y te confirme.",
  },
];

export default function HomePage() {
  const destacados = SERVICIOS.filter((s) => s.destacado);
  // El collage del hero usa las dos primeras fotos; la franja, las siguientes tres.
  const hero = TRABAJOS.slice(0, 2);
  const teaser = TRABAJOS.slice(2, 5);

  return (
    <>
      {/* ------------------------------- Hero ------------------------------- */}
      <Section className="pt-12 sm:pt-16 lg:pt-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Badge>
                <Sparkle className="mr-1.5 size-3 text-primary" />
                {HORARIO.diasTexto} &middot; {HORARIO.horasTexto}
              </Badge>

              <h1 className="mt-6 text-[2.5rem] leading-[1.05] text-ink sm:text-6xl lg:text-[4.25rem]">
                Uñas hechas
                <span className="block text-primary">con cariño.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-body sm:text-lg">
                {NEGOCIO.descripcion}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/agendar">Agendar cita</ButtonLink>
                <ButtonLink href="/servicios" variant="secondary">
                  Ver servicios y precios
                </ButtonLink>
              </div>

              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-hairline pt-8">
                {[
                  { k: "Servicios", v: String(SERVICIOS.length) },
                  { k: "Desde", v: "$200" },
                  { k: "Días", v: "Lun–Sáb" },
                ].map((item) => (
                  <div key={item.k}>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted">
                      {item.k}
                    </dt>
                    <dd className="tabular mt-1.5 font-[family-name:var(--font-display)] text-2xl text-ink">
                      {item.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Collage de trabajos */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <PlaceholderTile
                  trabajo={hero[0]}
                  indice={0}
                  priority
                  className="translate-y-6 self-start"
                />
                <div className="flex flex-col gap-4">
                  <PlaceholderTile trabajo={hero[1]} indice={1} priority />
                  <div className="rounded-xl bg-surface-dark p-6">
                    <Sparkle className="size-5 text-accent" />
                    <p className="mt-3 text-sm leading-relaxed text-on-dark-soft">
                      Materiales de calidad y un espacio tranquilo para que salgas
                      contenta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------- Destacados ---------------------------- */}
      <Section className="bg-surface-soft">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Lo más pedido"
              title="Los servicios favoritos de mis clientas."
              description="Cada uno con su precio y duración aproximada, para que planees tu día sin prisas."
            />
            <ButtonLink href="/servicios" variant="secondary">
              Ver todos
            </ButtonLink>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destacados.map((servicio, i) => (
              <Reveal as="li" key={servicio.id} delay={i * 80} className="h-full">
                <ServiceCard servicio={servicio} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------ Pasos ------------------------------- */}
      <Section className="bg-surface-dark">
        <Container>
          <SectionHeading
            eyebrow="Cómo funciona"
            title="Agendar toma menos de un minuto."
            description="No necesitas crear una cuenta ni pagar por adelantado."
            tone="dark"
          />

          <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {PASOS.map((paso, i) => (
              <Reveal as="li" key={paso.numero} delay={i * 100}>
                <div className="border-t border-white/15 pt-6">
                  <span className="tabular font-[family-name:var(--font-display)] text-3xl text-accent">
                    {paso.numero}
                  </span>
                  <h3 className="mt-4 text-xl text-on-dark">{paso.titulo}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-on-dark-soft">
                    {paso.texto}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-14">
            <ButtonLink href="/agendar" variant="onDark">
              Agendar cita
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ----------------------------- Galería ------------------------------ */}
      <Section>
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Galería"
              title="Un vistazo a mi trabajo."
              description="Algunos sets recientes. En la galería hay más, y puedes verlos en grande."
            />
            <ButtonLink href="/galeria" variant="secondary">
              Ver galería
            </ButtonLink>
          </div>

          <ul className="mt-12 grid items-start gap-x-8 gap-y-10 px-2 sm:grid-cols-3 sm:px-4">
            {teaser.map((trabajo, i) => (
              <Reveal as="li" key={trabajo.id} className="snapshot-li pt-3">
                <Snapshot
                  trabajo={trabajo}
                  retraso={i * 120}
                  sizes="(min-width: 640px) 30vw, 90vw"
                  href="/galeria"
                  etiqueta={`Ver en la galería: ${trabajo.titulo}`}
                />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ------------------------------- CTA -------------------------------- */}
      <Section className="pt-0">
        <Container>
          <div className="rounded-2xl bg-primary px-6 py-14 text-center sm:px-12 sm:py-20">
            <h2 className="mx-auto max-w-xl text-3xl text-on-primary sm:text-[2.75rem] sm:leading-[1.1]">
              Tu próxima cita te está esperando.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-on-primary/85 sm:text-base">
              Elige servicio, día y horario. Te confirmo por Instagram en cuanto lo vea.
            </p>
            <div className="mt-9 flex justify-center">
              <ButtonLink href="/agendar" variant="onDark">
                Agendar cita
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
