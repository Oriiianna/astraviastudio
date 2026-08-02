# Astravia

Landing page de la agencia. React + Vite, CSS propio con variables (sin frameworks de estilos).

## Comandos

```bash
npm install     # una sola vez
npm run dev     # servidor de desarrollo en http://localhost:5173
npm run build   # build de producción en /dist
npm run preview # sirve el build de producción

npm run assets:hero        # regenera los frames del hero
npm run assets:astronauta  # regenera los frames del astronauta del CTA
npm run assets:fondo       # regenera los frames del fondo de galaxia
npm run assets:logo        # regenera los archivos de logo
npm run assets:proyectos   # regenera las capturas del portfolio
```

Los textos están en **español neutro/internacional** (sin voseo), para que
funcionen en cualquier mercado hispanohablante.

## Estructura

```
src/
  recursos/              Originales pesados (fuente de verdad, no se sirven)
    heroastravia/        240 frames JPG 1920x1080 del render del hero
    astronauta/          120 frames JPG del astronauta con la lámpara
    fondoastra/          240 frames JPG del travelling por la Vía Láctea
    logo/                logo_astravia.jpeg
    proyectos/           Capturas crudas de los sitios del portfolio
  hooks/
    useFrameSequence.js  Motor de secuencias atadas al scroll (hero y CTA)
  styles/global.css      Sistema de diseño: tokens, layout, botones, efectos
  components/
    Navbar / Hero / Marquee / Services / TechStack /
    Differentiator / Process / Clients / CtaBanner /
    Contact / Footer / BackToTop     → cada uno con su .css al lado
    icons.jsx            Iconos + logos de tecnologías
scripts/
  optimize-hero.mjs      Frames del hero → public/hero/
  optimize-astronaut.mjs Frames del astronauta (con recorte de fondo) → public/astronauta/
  optimize-logo.mjs      Logo → public/brand/
  capture-proyectos.mjs  Screenshots de los sitios → src/recursos/proyectos/
  optimize-proyectos.mjs Capturas → public/proyectos/
  brand-palette.mjs      Imprime los colores dominantes de un archivo de marca
public/
  hero/                  98 frames WebP en dos resoluciones (generados)
  astronauta/            50 frames WebP con transparencia (generados)
  brand/                 Logo, isotipo y favicon (generados)
  proyectos/             Capturas del portfolio en dos anchos (generados)
```

`public/hero`, `public/astronauta`, `public/brand` y `public/proyectos` son
**generados**. Si cambian los originales de `src/recursos`, corré los scripts de
assets y volvé a commitear la salida.

## Sistema de color

La paleta sale del logo, no de una elección arbitraria: `brand-palette.mjs`
muestra que el logotipo entero vive entre H240 y H262. De ahí:

- **Escala índigo→violeta** para fondos, superficies y los acentos de las cards.
- **Azul hielo** (`--ice`, del remolino del isotipo) como único acento frío.
- **Ámbar** (`--ember`, de los trails del render) como único acento cálido,
  usado una sola vez en toda la página: la palabra "vendedor" del CTA.

Todo está en el bloque `:root` de `src/styles/global.css`.

## Secuencias atadas al scroll

Hay tres, y las tres usan el mismo motor: `src/hooks/useFrameSequence.js`.
Precarga con concurrencia limitada, pinta en `<canvas>` según el scroll y, si el
frame que toca todavía no llegó, usa el más cercano que sí esté cargado.

| Dónde | Modo | Frames | Peso desktop / móvil |
|---|---|---|---|
| Hero (fondo del titular) | `sticky` | 98 | 4,5 MB / 2,0 MB |
| Astronauta del banner CTA | `through` | 50 | 3,0 MB / 1,4 MB |
| Fondo de galaxia (Servicios → footer) | `page` | 66 | 2,1 MB / 1,0 MB |

Los tres modos:
- `sticky` — la sección es más alta que el viewport y adentro hay un stage pegajoso.
- `through` — la sección tiene altura normal; avanza mientras cruza el viewport.
- `page` — el elemento marca dónde arranca; avanza hasta el final del documento.

**Prioridad de carga.** Las tres secuencias suman ~9,6 MB, así que no arrancan
juntas: cada una carga su primer frame enseguida y después espera (`startDelay`)
antes de tragarse el ancho de banda. Hero 0 ms, fondo 1800 ms, astronauta 3500 ms.
Si se sacan esos retardos, el hero se entrecorta en conexiones lentas.

**Para aligerar:** subí `STEP` en el script correspondiente (1 de cada 3 en vez de
1 de cada 2 baja el peso a la mitad) o bajá `quality`. Para más fluidez, al revés.

Con `prefers-reduced-motion` no hay scrub: se muestra un frame fijo.

## Fondo de galaxia: cómo se apila

El fondo se atenúa **una sola vez**, en `.backdrop__canvas` (filtro `brightness`).
Todo lo que va encima —el tinte, el cielo del `body`, las capas `.bg-layer` de
cada sección— tiene que quedar bien transparente. Es fácil equivocarse acá:
cuatro capas al 70% dejan pasar apenas un 2% de la imagen y el fondo desaparece.

## Efectos

- Spotlight que sigue al cursor en cards (`data-spotlight`, el listener vive en `App.jsx`).
- Borde con degradado al hover (`.gradient-border`).
- Reveal al entrar en viewport (`data-reveal`), con variante de barrido (`data-reveal="wipe"`).
  El barrido usa `mask`, **no** `clip-path`: clip-path recorta la caja a ancho cero
  y el IntersectionObserver deja de ver el elemento.
- Barrido de luz en los botones primarios, marquee infinito, hairlines luminosas.

## Portfolio: cómo se capturan los sitios

La sección "Trabajo Reciente" muestra **capturas reales**, no mockups. Cada
proyecto es una fila a dos columnas: la captura dentro de un marco de ventana
(con el dominio real en la barra) y al lado la ficha con stack y link al sitio.

La captura no es una imagen fija: es una **tira vertical de dos pantallas** del
sitio. En reposo se ve la primera y al hover sube hasta la segunda, como si
alguien scrolleara. El recorrido se calcula con `container-type: size` y
`translateY(calc(100cqh - 100%))`, así que no depende de saber el alto de la
imagen. Con `prefers-reduced-motion` la captura no se mueve.

### Rehacer las capturas

Playwright **no** es dependencia del proyecto: son ~150 MB de browsers para algo
que se rehace una vez al año. Se instala al vuelo y no se guarda en el
`package.json`:

```bash
npm i -D playwright --no-save
npx playwright install chromium      # sólo la primera vez
node scripts/capture-proyectos.mjs   # → src/recursos/proyectos/*.png
npm run assets:proyectos             # → public/proyectos/*.webp
```

Para agregar un proyecto, sumalo al array `PROYECTOS` de
`scripts/capture-proyectos.mjs` (URL + posiciones de scroll) y al de
`src/components/Clients.jsx` (título, stack, descripción). El layout ya alterna
el lado de la captura en las filas pares.

**Por qué el script captura pantalla por pantalla** y no un `fullPage: true`: el
sitio de Altamira tiene el fondo —un `<canvas>` atado al scroll— en un
contenedor `fixed`. En una captura full-page ese fondo cubre sólo el primer
viewport y todo lo de abajo queda con texto claro sobre fondo claro, es decir
invisible. Así que se scrollea, se espera a que terminen las animaciones de
entrada y se cose cada pantalla con sharp.

## Formulario de contacto (Mailtrap)

El formulario postea a `/api/contact`, una función serverless que manda el aviso
por la API HTTP de Mailtrap a **studioastravia@gmail.com**.

```
src/components/Contact.jsx  → fetch POST /api/contact
api/contact.js              → valida, arma el mail y llama a Mailtrap
vite.config.js              → monta /api/contact en el dev server de Vite
```

En producción la función la sirve Vercel; en desarrollo la monta un plugin de
Vite sobre el mismo origen, así que `npm run dev` alcanza (no hace falta
`vercel dev`).

### Variables de entorno

Copiá `.env.example` a `.env` y cargá los mismos valores en
**Vercel → Settings → Environment Variables**. El `.env` está en `.gitignore`:
el token nunca se commitea y, al no llevar prefijo `VITE_`, nunca llega al
bundle del cliente.

| Variable | Para qué |
|---|---|
| `MAILTRAP_API_TOKEN` | Token de API (Mailtrap → Settings → API Tokens). |
| `MAILTRAP_INBOX_ID` | Si está cargado, el mail **no** se entrega: queda en el Sandbox. Vacío = envío real. |
| `MAILTRAP_FROM_EMAIL` | Remitente. Tiene que ser de un dominio verificado en Mailtrap. |
| `MAILTRAP_TO_EMAIL` | Casilla que recibe las consultas. |

### Estado del dominio

Todavía no hay dominio propio verificado, así que el remitente sale del dominio
demo de la cuenta (`formulario@demomailtrap.co`). **El demo sólo entrega a la
casilla dueña de la cuenta**, que justamente es `studioastravia@gmail.com`, así
que funciona. Cuando se verifique `astravia.digital` en Mailtrap (Sending
Domains → cargar los CNAME/TXT en el DNS), cambiá `MAILTRAP_FROM_EMAIL` a
`formulario@astravia.digital`: recién ahí se puede escribir a cualquier destino
y el mail deja de salir con un remitente ajeno a la marca.

Para probar sin tocar el correo real, cargá `MAILTRAP_INBOX_ID=4831206` y los
envíos quedan en el Sandbox de Mailtrap.

### Anti-spam

El form tiene un honeypot (`website`, oculto por CSS). Si viene completo, el
endpoint responde `200` y descarta el mensaje en silencio. No hay rate limiting:
si empieza a entrar basura, ese es el próximo paso.

## Pendientes conocidos

- El portfolio tiene un solo proyecto. Salieron los dos mockups inventados que
  lo acompañaban; en cuanto haya un segundo sitio real, la sección ya lo apila.
- El tercer logo de la franja de tecnologías (WooCommerce) fue una suposición:
  en el PDF de referencia no se distinguía.
