import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { Container, Section, SectionHeading } from "@/components/ui";
import { HORARIO } from "@/lib/config";

export const metadata: Metadata = {
  title: "Agendar cita",
  description:
    "Elige tu servicio, el día y el horario, y escríbele a Menita por Instagram.",
};

export default function AgendarPage() {
  return (
    <>
      <Section className="pb-6 sm:pb-8">
        <Container>
          <SectionHeading
            eyebrow="Agendar"
            as="h1"
            title="Aparta tu cita en tres pasos."
            description="Elige servicio, día y horario. Al final te llevamos a mi Instagram para que me mandes un mensaje y te confirme."
          />
          <p className="mt-6 text-sm text-muted">
            {HORARIO.diasTexto} &middot;{" "}
            <span className="tabular">{HORARIO.horasTexto}</span> &middot; Domingo cerrado
          </p>
        </Container>
      </Section>

      <Section className="pt-0 pb-20 sm:pb-24">
        <Container>
          <BookingForm />
        </Container>
      </Section>
    </>
  );
}
