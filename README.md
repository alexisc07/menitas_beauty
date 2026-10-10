# Menita&rsquo;s Beauty

Sitio web con carta de servicios y agendado de citas por Instagram.
Next.js 16 · TypeScript · Tailwind v4. Todo el contenido está en español (es-MX).

## Arrancar el proyecto

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

Otros comandos: `npm run build` (producción), `npm run lint`.

## Sitio publicado

<https://menitas-beauty.netlify.app>

El sitio se exporta como HTML estático (`output: "export"` en
`next.config.ts`), así que se publica en Netlify sin adaptadores ni servidor.
`npm run build` genera la carpeta `out/`, que es lo que Netlify sirve.

Para volver a publicar después de un cambio, pide a Claude que despliegue, o
conecta el repositorio en el panel de Netlify para que cada push publique solo.

---

## ⚠️ Lo que falta configurar

Todo vive en **`src/lib/config.ts`**. No hace falta tocar ningún otro archivo.

| Dato | Dónde | Estado |
| --- | --- | --- |
| Usuario de Instagram | `INSTAGRAM_USUARIO` | ❌ Pendiente |
| Zona o ciudad | `NEGOCIO.zona` | ❌ Pendiente |

### El usuario de Instagram

Es lo único que impide que el botón de agendar funcione. Va sin la @:

```ts
export const INSTAGRAM_USUARIO = "menitas.beauty";
```

Mientras siga en `tu.usuario`, la página de agendar muestra un aviso
recordándolo. Ese aviso desaparece solo al poner el usuario real.

---

## Tareas del día a día

### Cambiar un precio o un servicio

`src/lib/services.ts`. Cada servicio es un objeto:

```ts
{
  id: "gelish",
  nombre: "Gelish",
  precioMin: 200,        // precioMax opcional -> se muestra como rango
  duracionMin: 60,       // informativo
  descripcion: "…",
  nota: "…",             // opcional
  categoria: "unas",     // "unas" | "cejas" | "pestanas"
  destacado: true,       // aparece en la portada
}
```

El precio, la duración y el rango se recalculan solos en todas las páginas.

### Bloquear días (vacaciones, cursos, asuntos personales)

`src/lib/availability.ts`, arriba del todo:

```ts
export const FECHAS_BLOQUEADAS: string[] = ["2026-12-24", "2026-12-25"];
```

Formato `AAAA-MM-DD`. Esos días aparecen en gris y no se pueden elegir.
Los domingos y las fechas pasadas ya se bloquean automáticamente.

### Cambiar el horario

`src/lib/config.ts` → `HORARIO` (texto visible) y
`src/lib/availability.ts` → `BLOQUES` (los dos horarios reales: 15:00 y 17:30).

### Subir fotos a la galería

1. Guarda las imágenes en `public/galeria/` (vertical 4:5, JPG o WebP, &lt;500 KB).
2. En `src/lib/gallery.ts`, agrega `src` y `alt` al trabajo:

```ts
{
  id: "esculturales-nude",
  titulo: "Esculturales nude",
  src: "/galeria/esculturales-nude.jpg",
  alt: "Uñas esculturales largas en tono nude con acabado brillante",
}
```

El marcador «Próximamente» desaparece solo. El `alt` describe la foto para
quien no puede verla — no lo dejes vacío.

---

## Cómo funciona el agendado

No hay base de datos ni backend. El flujo es:

1. La clienta elige servicio, día y uno de los dos bloques.
2. Copia la solicitud con un botón y abre el mensaje directo de Instagram.
3. Pega el mensaje y **Menita confirma manualmente.**

> **Por qué se copia y se pega:** Instagram no permite abrir un chat con el
> mensaje ya escrito. WhatsApp sí lo permitía (`wa.me/?text=`), pero Instagram
> no tiene equivalente, así que el sitio prepara el texto y lo copia al
> portapapeles para que la clienta solo lo pegue.

Por eso el calendario muestra el *horario* de Menita, no su agenda real: dos
personas podrían pedir el mismo bloque y ella decide. La página lo dice de
forma explícita para no prometer de más.

Si en el futuro se necesita disponibilidad real y evitar empalmes, hace falta
una base de datos y una pantalla privada para ella — es un cambio grande, no
un ajuste.

---

## Estructura

```
src/
  app/
    page.tsx            Inicio
    servicios/          Carta de precios
    galeria/            Trabajos (con marcadores)
    agendar/            Calendario y solicitud
    faq/                Preguntas y políticas
    globals.css         Tokens de color, tipografía, animaciones
  components/
    booking-form.tsx    Flujo de agendado (3 pasos)
    calendario.tsx      Calendario accesible por teclado
    site-header.tsx     Navegación + menú móvil
    …
  lib/
    config.ts           ← datos del negocio (editar aquí)
    services.ts         ← servicios y precios
    availability.ts     ← días bloqueados y horarios
    gallery.ts          ← fotos
```

## Accesibilidad

El calendario se maneja por teclado: flechas mueven un día o una semana,
`Inicio`/`Fin` van al extremo de la semana, `Re Pág`/`Av Pág` cambian de mes,
`Enter` selecciona. Los días cerrados se anuncian como «no disponible».
El menú móvil atrapa el foco y se cierra con `Esc`. Todas las animaciones se
desactivan si el sistema pide menos movimiento.
