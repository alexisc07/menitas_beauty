import type { Metadata } from "next";
import { TRABAJOS } from "@/lib/gallery";
import { PlaceholderTile } from "@/components/placeholder-tile";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Trabajos recientes de Menita's Beauty: uñas esculturales, acrygel, gelish, diseños a mano, cejas y pestañas.",
};

export default function GaleriaPage() {
  const sinFotos = TRABAJOS.every((t) => !t.src);

  return (
    <>
      <Section className="pb-8">
        <Container>
          <SectionHeading
            eyebrow="Galería"
            as="h1"
            title="Trabajos recientes."
            description="Diseños hechos a mano, uno por uno. Si viste algo que te gustó, mándamelo como referencia al agendar."
          />

          {sinFotos ? (
            <p className="mt-8 max-w-xl rounded-xl border border-hairline bg-surface-card px-5 py-4 text-sm leading-relaxed text-body">
              Estoy preparando las fotos de esta sección. Mientras tanto, puedes ver los
              servicios disponibles o agendar tu cita.
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/agendar">Agendar cita</ButtonLink>
            <ButtonLink href="/servicios" variant="secondary">
              Ver precios
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section className="pt-4">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TRABAJOS.map((trabajo, i) => (
              <Reveal as="li" key={trabajo.id} delay={(i % 3) * 80}>
                <PlaceholderTile trabajo={trabajo} indice={i} priority={i < 3} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
