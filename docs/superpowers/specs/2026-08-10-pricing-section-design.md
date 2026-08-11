# Sección de planes y precios

**Fecha:** 2026-08-10
**Estado:** aprobado, pendiente de implementación

## Objetivo

Reemplazar la sección "Por qué Astravia" (`Differentiator`) por una sección de
precios con tres tarjetas de plan, respetando la paleta y la tipografía del
sistema de diseño existente.

La referencia visual que trajo el cliente viene de otro sitio (fondo claro,
dorado y magenta). Se toma su **estructura** — nombre de plan, precio grande,
lista de features, botón — y se traduce al lenguaje visual de Astravia:
Poppins, escala índigo→violeta, `--grad-brand` para los números, y los mismos
efectos de hover que ya usan las tarjetas de Servicios.

## Alcance

**Se elimina**

- `src/components/Differentiator.jsx`
- `src/components/Differentiator.css`
- La clave `differentiator` en ambos `translation.json`

**Se crea**

- `src/components/Pricing.jsx`
- `src/components/Pricing.css`
- La clave `pricing` en `es/translation.json` y `en/translation.json`

**Se modifica**

- `src/App.jsx`: cambiar el import y la posición en el `<main>`. `Pricing` ocupa
  el mismo lugar que ocupaba `Differentiator`, entre `TechStack` y `Process`.

`#nosotros` (el `id` de la sección eliminada) no está enlazado desde el navbar
ni desde el footer, así que la eliminación no rompe navegación. El `id` nuevo
es `#planes`.

## Estructura

```
<section className="pricing section grain" id="planes">
  <div className="pricing__bg bg-layer" />          ← hereda el fondo de .diff__bg
  <div className="container container--full">
    <header className="section-head">              ← kicker + h2 + p
    <div className="pricing__grid">                ← 3 × <article className="plan">
    <ul className="pricing__proof">                ← franja de 3 métricas
  </div>
</section>
```

### Anatomía de una tarjeta

1. **Cabecera:** nombre del plan sobre una franja superior tenue.
2. **Precio:** `currency` chico + `amount` grande en `--grad-brand` +
   `amountSmall` en superíndice + `note` en itálica.
   El superíndice se renderiza solo si `amountSmall` tiene contenido, para que
   un precio sin miles (ej. `USD 390`) no deje un hueco.
3. **Separador** (`--grad-hair`).
4. **Features:** `<ul>` con el check violeta de `IconCheckCircle`, mismo
   tratamiento que la lista de `Differentiator` (19px, `--violet-soft`, glow).
5. **CTA:** `<a className="btn btn--primary">` a WhatsApp.

La tarjeta destacada (Clásica) lleva `gradient-border` encendido de forma
permanente y un badge "Más elegido". Las tres llevan `data-spotlight` y
`data-reveal` con `--delay` escalonado (`i * 110ms`), igual que
`Services.jsx`.

Las tarjetas se estiran a igual altura y el botón se ancla abajo con
`margin-top: auto`, de modo que el plan E-Commerce (6 features) no descuadre a
los otros dos (5 features).

### Franja de métricas

Debajo de la grilla, una fila fina de tres datos reciclados del panel que se
elimina: **98/100** PageSpeed promedio, **+50** proyectos entregados,
**99.9%** uptime garantizado. Iconos `IconGauge`, `IconLayers` e `IconShield`,
que ya existen en `icons.jsx`. Es una franja de refuerzo, no tarjetas: sin
fondo propio, separada por una hairline superior.

## Datos

El array `PLANS` en el JSX solo lleva estructura; todo el texto sale de i18n.

```js
const PLANS = [
  { key: 'landing',   accent: '#7c3aed', featured: false },
  { key: 'clasica',   accent: '#9b6cf5', featured: true  },
  { key: 'ecommerce', accent: '#7ec4ef', featured: false },
]
```

Las features se leen con `t('pricing.plans.<key>.features', { returnObjects: true })`,
igual que `differentiator.points` hoy.

### Esquema i18n

```json
"pricing": {
  "kicker": "Planes y precios",
  "title": "Un plan para cada",
  "titleHighlight": "etapa de tu negocio.",
  "description": "Tres formas de empezar, todas con pago único y sin abonos mensuales. Elegí la que va con tu proyecto hoy: podés escalar después sin rehacer nada.",
  "featuredBadge": "Más elegido",
  "cta": "Contratar",
  "ctaAriaLabel": "Consultar por el plan {{plan}} por WhatsApp",
  "whatsappMessage": "¡Hola! Me interesa el plan {{plan}} y quiero coordinar una consulta.",
  "plans": {
    "landing": {
      "name": "Landing Page",
      "price": { "currency": "Pesos", "amount": "330", "amountSmall": "000", "note": "pago único" },
      "features": [ ... ]
    },
    "clasica":   { ... },
    "ecommerce": { ... }
  },
  "proof": {
    "pagespeed": { "value": "98",   "unit": "/100", "label": "PageSpeed promedio" },
    "projects":  { "value": "+50",  "unit": "",     "label": "Proyectos entregados" },
    "uptime":    { "value": "99.9", "unit": "%",    "label": "Uptime garantizado" }
  }
}
```

Los `...` del esquema son abreviaturas de este documento: el contenido completo
de los tres planes está transcrito en la sección siguiente, y es el que va al
JSON.

El precio va partido en cuatro piezas a propósito: cuando la versión en inglés
pase a dólares, se editan los valores (`"currency": "USD"`, `"amount": "390"`,
`"amountSmall": ""`) sin tocar el JSX ni el CSS.

El mensaje de WhatsApp interpola solo el nombre del plan, no el precio, para no
tener que mantener dos formatos de moneda dentro de un string.

### Contenido (español)

**Landing Page — Pesos 330.000, pago único**

- Diseño personalizado
- Redacción de contenidos persuasivos con IA incluidos.
- Una portada con toda la info (Inicio, Quiénes somos, Servicios, Contacto, etc.).
- Formulario de contacto y botón de WhatsApp directo.
- Soporte técnico y mantenimiento post-entrega.

**Clásica — Pesos 400.000, pago único** *(destacado)*

- Diseño personalizado y auto administrable (WordPress).
- Redacción de contenidos persuasivos con IA incluidos.
- Hasta 5 secciones (Inicio, Quiénes somos, Servicios, Contacto, etc.).
- Formulario de contacto y botón de WhatsApp directo.
- Soporte técnico y mantenimiento post-entrega.

**E-Commerce — Pesos 450.000, pago único**

- Todo lo del Plan Clásica.
- Carrito de compras y pasarelas de pago (Mercado Pago, tarjetas, transferencias).
- Configuración de envíos (Correo Argentino, Andreani, etc.).
- Optimización masiva de descripciones de productos con IA para mejorar tu SEO en Google.
- Retoque digital inteligente de iluminación para las fotos de tu catálogo (exclusivo para que tus productos luzcan impecables).
- Te enseñamos a subir tus productos.

> El último ítem del plan E-Commerce estaba parcialmente tapado en la captura de
> referencia. Se transcribe lo visible; el cliente lo corrige después editando
> el JSON.

### Contenido (inglés)

Mismos textos traducidos. **Los precios quedan en pesos argentinos por ahora**;
el pase a dólares es un cambio posterior, fuera del alcance de esta entrega.

## CTA

Cada botón abre WhatsApp al número que ya usa el sitio (`Contact.jsx`):

```
https://wa.me/5491168717233?text=<pricing.whatsappMessage con el plan interpolado, URL-encoded>
```

Con `target="_blank"` y `rel="noopener noreferrer"`, y un `aria-label` que
nombra el plan — el texto visible "Contratar" se repite tres veces y solo no
alcanza para distinguirlos.

## Responsive

| Ancho | Grilla |
|---|---|
| > 1100px | 3 columnas |
| 700–1100px | 2 columnas (la tercera baja y ocupa el ancho de una) |
| < 700px | 1 columna apilada, en el orden Landing → Clásica → E-Commerce |

La franja de métricas pasa de 3 columnas a 1 por debajo de 560px.

## Accesibilidad

- Las features van en `<ul>`/`<li>` reales; los iconos de check son
  decorativos (`aria-hidden`), el texto lo lleva el `<li>`.
- El badge "Más elegido" es texto, no una imagen.
- Contraste: el número del precio usa `--grad-brand` sobre `--bg-card`, la
  misma combinación ya validada en `.diff__metric-value`.
- Todo el movimiento (reveal, spotlight, hover) queda cubierto por el bloque
  `prefers-reduced-motion` que ya existe en `global.css`.

## Fuera de alcance

- Cambiar los precios de la versión en inglés a dólares.
- Agregar un link "Planes" al navbar.
- Cualquier lógica de checkout o pago online.
- Tocar `Contact.jsx`: la decisión de ir directo a WhatsApp lo deja intacto.

## Criterios de aceptación

1. `Differentiator.jsx`, `Differentiator.css` y la clave `differentiator` de
   ambos JSON ya no existen en el repo.
2. La sección `#planes` renderiza tres tarjetas con los nombres, precios y
   features listados arriba, en español y en inglés.
3. La tarjeta Clásica se ve destacada (borde de gradiente + badge).
4. Los tres botones abren WhatsApp al +54 11 6871-7233 con el mensaje
   correspondiente a su plan.
5. Las tres tarjetas terminan a la misma altura con el botón alineado abajo,
   pese a tener distinta cantidad de features.
6. La franja de métricas muestra 98/100, +50 y 99.9%.
7. `npm run build` pasa sin errores ni warnings nuevos.
8. No hay regresión visual en las secciones vecinas (`TechStack` arriba,
   `Process` abajo): el fundido de `bg-layer` entre secciones se mantiene.
