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
  brand-palette.mjs      Imprime los colores dominantes de un archivo de marca
public/
  hero/                  98 frames WebP en dos resoluciones (generados)
  astronauta/            50 frames WebP con transparencia (generados)
  brand/                 Logo, isotipo y favicon (generados)
```

`public/hero`, `public/astronauta` y `public/brand` son **generados**. Si cambian
los originales de `src/recursos`, corré los scripts de assets y volvé a commitear
la salida.

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

## Pendientes conocidos

- El formulario de contacto no envía a ningún lado (ver `TODO` en `Contact.jsx`).
- Los proyectos de "Clientes Recientes" usan mockups en CSS, no capturas reales;
  dos de los tres son inventados.
- El tercer logo de la franja de tecnologías (WooCommerce) fue una suposición:
  en el PDF de referencia no se distinguía.
