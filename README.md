# Menita&rsquo;s Beauty

Página web para Ximena (@_menitasbeauty_), con carta de servicios y agendado
de citas por Instagram.
Next.js 16 · TypeScript · Tailwind v4. Todo el contenido está en español (es-MX).

> Este repositorio existe para poder hacer cambios desde cualquier lado:
> clona, edita y publica siguiendo las instrucciones de abajo.

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

### Marcar horarios apartados (hoja de Google)

Menita marca las citas confirmadas en una hoja de Google desde el celular, y la
página de agendar las muestra tachadas como **Apartado**. Si un día tiene los dos
bloques apartados, el calendario lo marca como lleno. No hace falta volver a
publicar el sitio.

**Configuración (una sola vez, desde un navegador):**

1. Crea una hoja nueva en Google Sheets, por ejemplo *Horarios apartados*.
2. En la fila 1 escribe `Fecha` en la columna A y `Horario` en la B
   (hay una plantilla en `docs/plantilla-horarios-apartados.csv`).
3. *Archivo → Compartir → Publicar en la web*. Elige la pestaña de la hoja y el
   formato **Valores separados por comas (.csv)**, deja activado *Volver a
   publicar automáticamente* y pulsa *Publicar*.
4. Copia el enlace y pégalo en `URL_HOJA_APARTADOS` de `src/lib/config.ts`.

> La app de Google Sheets del celular no tiene la opción *Publicar en la web*:
> este paso se hace desde un navegador. Después, la hoja se edita normalmente
> desde la app.

> ⚠️ **La hoja publicada es pública.** Cualquiera con el enlace puede leerla.
> Escribe solo fecha y horario; **nunca nombres ni teléfonos** de clientas.

**Uso diario:** una fila por cada horario apartado. Para liberar un horario (por
ejemplo, si cancelan), borra la fila. Los cambios tardan hasta ~5 minutos en
verse, porque Google actualiza la hoja publicada cada pocos minutos.

| Fecha | Horario | Qué aparta |
| --- | --- | --- |
| `14/10/2026` | `15:00` | el bloque de las 15:00 |
| `14/10` | `5:30 pm` | el bloque de las 17:30 (sin año = el próximo 14/10) |
| `15 de octubre` | `tarde` / `noche` | el de las 15:00 / el de las 17:30 |
| `20/10/2026` | `todo el día` | los dos bloques (día lleno) |
| `21/10/2026` | *(vacío)* | los dos bloques: ante la duda, se bloquea el día |

Las filas que no se entienden se ignoran y se avisan en la consola del navegador.
Si la hoja no responde, el sitio sigue funcionando y avisa que la disponibilidad
se confirma por DM.

### Cambiar el horario

`src/lib/config.ts` → `HORARIO` (texto visible) y
`src/lib/availability.ts` → `BLOQUES` (los dos horarios reales: 15:00 y 17:30).

### Subir fotos a la galería

La galería es **solo de uñas**. Cada foto se abre en un visor a pantalla
completa (flechas, teclado, deslizar en el celular, `Esc` para cerrar).

1. Guarda la imagen en `public/galeria/` (WebP o JPG, idealmente &lt;200 KB).
2. Agrega una entrada en `src/lib/gallery.ts`:

```ts
{
  id: "almendra-nude",
  titulo: "Almendra nude",
  src: "/galeria/almendra-nude.webp",
  alt: "Uñas almendra en tono nude con acabado brillante",
  ancho: 900,   // dimensiones reales de la foto
  alto: 1400,
}
```

El orden de la lista es el orden en la galería. Las **dos primeras** salen en el
collage de la portada y de la **3.ª a la 5.ª** en la franja de galería de la
portada. El `alt` describe la foto para quien no puede verla — no lo dejes vacío.

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
