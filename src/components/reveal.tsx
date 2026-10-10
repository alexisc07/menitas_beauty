"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Aparición suave al entrar en pantalla.
 * Si el sistema pide menos movimiento, el contenido se muestra de inmediato
 * (la clase .reveal ya lo neutraliza en CSS).
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    // Sin IntersectionObserver mostramos el contenido tocando el DOM
    // directamente, sin disparar otro render.
    if (typeof IntersectionObserver === "undefined") {
      nodo.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(nodo);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — ref polimórfico sobre un conjunto acotado de etiquetas.
      ref={ref}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
