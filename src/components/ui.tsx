import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* --------------------------------- Layout --------------------------------- */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as: Encabezado = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  /** Usa "h1" cuando este encabezado es el título de la página. */
  as?: "h1" | "h2";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow ? (
        <p
          className={`mb-3 text-xs font-medium uppercase tracking-[0.18em] ${
            tone === "dark" ? "text-accent" : "text-primary"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <Encabezado
        className={`text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] ${
          tone === "dark" ? "text-on-dark" : "text-ink"
        }`}
      >
        {title}
      </Encabezado>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            tone === "dark" ? "text-on-dark-soft" : "text-body"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* --------------------------------- Botones -------------------------------- */

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary active:translate-y-px";

const variantes = {
  primary: "bg-primary text-on-primary hover:bg-primary-active",
  secondary:
    "border border-hairline bg-canvas text-ink hover:border-primary hover:text-primary",
  onDark:
    "bg-canvas text-ink hover:bg-surface-card focus-visible:outline-canvas",
  ghost: "text-ink hover:text-primary",
} as const;

type Variante = keyof typeof variantes;

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variante }) {
  return (
    <Link href={href} className={`${base} ${variantes[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variante }) {
  return (
    <button className={`${base} ${variantes[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/* --------------------------------- Badges --------------------------------- */

export function Badge({
  children,
  tone = "soft",
}: {
  children: ReactNode;
  tone?: "soft" | "primary" | "dark";
}) {
  const tonos = {
    soft: "bg-surface-card text-ink",
    primary: "bg-primary text-on-primary",
    dark: "bg-surface-dark-elevated text-on-dark",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tonos[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------- Marca --------------------------------- */

/** Marca de Menita's Beauty: destello de cuatro puntas. */
export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 0c.5 6.2 5.3 11 11.5 11.5v1C17.3 13 12.5 17.8 12 24h-1C10.5 17.8 5.7 13 -.5 12.5v-1C5.7 11 10.5 6.2 11 0h1Z" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap ${className}`}>
      <Sparkle className="size-4 shrink-0 text-primary" />
      <span
        translate="no"
        className="font-[family-name:var(--font-display)] text-base tracking-[-0.01em] sm:text-lg"
      >
        Menita&rsquo;s Beauty
      </span>
    </span>
  );
}
