import type { Metadata } from "next";
import { TRABAJOS } from "@/lib/gallery";
import { GaleriaInteractiva } from "@/components/galeria-interactiva";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Trabajos recientes de Menita's Beauty: uñas esculturales, acrygel, gelish, francés y diseños hechos a mano.",
};

export default function GaleriaPage() {
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

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/agendar">Agendar cita</ButtonLink>
            <ButtonLink href="/servicios" variant="secondary">
              Ver precios
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* "Mesa" con puntitos sobre la que caen las fotos. */}
      <Section className="overflow-x-clip border-t border-hairline bg-surface-soft bg-[radial-gradient(var(--hairline)_1px,transparent_1px)] [background-size:22px_22px] pt-12 sm:pt-16">
        <Container>
          <GaleriaInteractiva trabajos={TRABAJOS} />
        </Container>
      </Section>
    </>
  );
}
