import type { Metadata } from "next";
import { HORARIO } from "@/lib/config";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Preguntas y políticas",
  description:
    "Cómo agendar, política de cancelación, retardos, retiro gratis y cuidados posteriores en Menita's Beauty.",
};

type Pregunta = { p: string; r: string };

const GRUPOS: { titulo: string; preguntas: Pregunta[] }[] = [
  {
    titulo: "Citas",
    preguntas: [
      {
        p: "¿Cómo agendo una cita?",
        r: "Desde la página de agendar: eliges el servicio, el día y uno de los dos bloques disponibles. Al final te llevamos a mi Instagram para que me mandes un mensaje directo. Si quieres, puedes copiar el resumen de tu cita con un botón y pegarlo en el chat: así no tengo que preguntarte los datos. Tu cita queda apartada cuando yo te confirmo.",
      },
      {
        p: "¿Por qué solo hay dos horarios por día?",
        r: "Atiendo de 15:00 a 20:00 y trabajo con una clienta a la vez. Un set completo puede tomar hasta dos horas y media, así que el día se divide en dos bloques: 15:00 y 17:30. Así nadie espera y a nadie se le corta el servicio.",
      },
      {
        p: "¿Qué pasa si no me confirman?",
        r: "Si no te respondo en unas horas, escríbeme de nuevo por Instagram. Revisa que tu mensaje no haya caído en solicitudes, sobre todo si no me sigues. El horario que elegiste no queda apartado hasta que yo te confirme.",
      },
      {
        p: "¿Puedo cancelar o cambiar mi cita?",
        r: "Sí. Avísame con al menos 4 horas de anticipación por Instagram y la reprogramamos sin problema. Cancelar sobre la hora deja el espacio vacío y ya no alcanzo a ofrecérselo a alguien más.",
      },
      {
        p: "¿Qué pasa si llego tarde?",
        r: "Tengo una tolerancia de 15 minutos. Después de ese tiempo puede que tenga que hacer un servicio más corto o reprogramar, porque el siguiente bloque ya está apartado.",
      },
    ],
  },
  {
    titulo: "Servicios y precios",
    preguntas: [
      {
        p: "¿El retiro tiene costo?",
        r: "El retiro cuesta $150, pero es gratis si el set que traes te lo hice yo. Si vienes de otro lugar, se cobra aparte del servicio nuevo.",
      },
      {
        p: "¿Por qué las esculturales y el acrygel tienen un rango de precio?",
        r: "Porque el precio depende del largo y del diseño. Un nude corto queda en el precio base; un largo con decoración a mano, encapsulado o pedrería sube hacia el máximo. Si me mandas tu referencia antes, te digo el precio exacto.",
      },
      {
        p: "¿Puedo llevar una foto de referencia?",
        r: "Por favor hazlo. Mándamela por Instagram junto con tu solicitud y así reservo el tiempo y los materiales correctos para tu diseño.",
      },
      {
        p: "¿Cuánto dura cada servicio?",
        r: "Cada servicio muestra su duración aproximada en la carta. Un gelish toma alrededor de una hora; un set de esculturales o acrygel, hasta dos horas y media.",
      },
    ],
  },
  {
    titulo: "Cuidados",
    preguntas: [
      {
        p: "¿Cuánto me duran las uñas?",
        r: "Un set bien cuidado dura de tres a cuatro semanas. A partir de ahí conviene el relleno, porque la uña natural ya creció y el punto de estrés se recorre.",
      },
      {
        p: "¿Qué cuidados necesito en casa?",
        r: "Usa guantes para limpiar, no las utilices para abrir cosas y aplica aceite de cutícula a diario. Si se levanta un borde, no lo jales: avísame y lo reparamos.",
      },
      {
        p: "¿Puedo mojarme las pestañas?",
        r: "Espera 24 horas después de la aplicación. Después, evita productos con aceite en el área de los ojos y péinalas con el cepillito para que mantengan su forma.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Section className="pb-6">
        <Container>
          <SectionHeading
            eyebrow="Preguntas frecuentes"
            as="h1"
            title="Todo lo que suelen preguntarme."
            description="Si tu duda no está aquí, escríbeme por Instagram al agendar y con gusto te explico."
          />
          <p className="mt-6 text-sm text-muted">
            {HORARIO.diasTexto} &middot;{" "}
            <span className="tabular">{HORARIO.horasTexto}</span> &middot; Domingo cerrado
          </p>
        </Container>
      </Section>

      {GRUPOS.map((grupo, indice) => (
        <Section
          key={grupo.titulo}
          className={`py-10 sm:py-12 ${indice % 2 === 1 ? "bg-surface-soft" : ""}`}
        >
          <Container>
            <h2 className="text-2xl text-ink sm:text-3xl">{grupo.titulo}</h2>

            <div className="mt-6 max-w-3xl divide-y divide-hairline border-y border-hairline">
              {grupo.preguntas.map((pregunta) => (
                <details key={pregunta.p} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base text-ink transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-lg">
                    <span>{pregunta.p}</span>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="size-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <p className="pb-5 pr-8 text-sm leading-relaxed text-body sm:text-base">
                    {pregunta.r}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </Section>
      ))}

      <Section>
        <Container>
          <div className="rounded-2xl border border-hairline bg-surface-card px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl text-ink sm:text-3xl">¿Seguimos con tu cita?</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-body">
              Elige servicio, día y horario. Cualquier duda me la puedes escribir en el
              mismo mensaje.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/agendar">Agendar cita</ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
