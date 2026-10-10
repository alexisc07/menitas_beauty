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
            description="Diseños hechos a mano, uno por uno. Toca cualquier foto para verla completa. Si viste algo que te gustó, mándamelo como referencia al agendar."
          />

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
          <GaleriaInteractiva trabajos={TRABAJOS} />
        </Container>
      </Section>
    </>
  );
}
