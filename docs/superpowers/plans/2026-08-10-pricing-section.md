# Sección de planes y precios — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la sección `Differentiator` ("Por qué Astravia") por una sección de precios con tres tarjetas de plan que abren WhatsApp, respetando el sistema de diseño existente.

**Architecture:** Un componente presentacional nuevo, `Pricing`, que lee todo su contenido de i18n y no tiene estado. La estructura (qué planes hay, su color de acento, cuál va destacado) vive en un array constante en el JSX; los textos, precios y features viven en `translation.json`. Reusa los efectos compartidos que ya define `global.css` (`bg-layer`, `section-head`, `kicker`, `gradient-border`, `data-spotlight`, `data-reveal`, `btn--primary`) y el patrón de tarjeta de `Services.css`.

**Tech Stack:** React 18, Vite 6, react-i18next 17, CSS plano por componente (sin preprocesador, sin utilidades).

**Spec:** `docs/superpowers/specs/2026-08-10-pricing-section-design.md`

## Nota sobre verificación

El proyecto **no tiene test runner ni linter** (`package.json` solo expone `dev`, `build`, `preview` y scripts de optimización de assets). Agregar uno está fuera del alcance de esta entrega y el cliente no lo pidió.

Por eso los pasos de verificación de este plan no son ciclos TDD, sino:

1. `npm run build` — falla ante errores de sintaxis en JSX y ante JSON inválido, que es el modo de falla realista de estas tareas.
2. Verificación visual en `npm run dev`, con criterios de aceptación concretos y observables en cada tarea.

Esto es una desviación consciente del ciclo test-first. Si en algún momento el proyecto suma Vitest + Testing Library, las tarjetas son un buen primer candidato a testear (render de los tres planes, `href` de WhatsApp correcto por plan).

## Global Constraints

- **Número de WhatsApp:** `5491168717233`. Es el mismo que ya usa `Contact.jsx:83`; no inventar otro.
- **Idiomas:** todo texto nuevo va en `es/translation.json` **y** `en/translation.json`. Ninguna cadena literal en el JSX.
- **Precios:** en ambos idiomas quedan en pesos argentinos. El pase del inglés a dólares es un cambio posterior, fuera de alcance.
- **Sin dependencias nuevas.** Sin librerías de UI, sin utilidades CSS.
- **`id` de la sección:** `planes`.
- **Colores:** solo variables de `global.css` o los tres hex de acento que ya usa `Services.jsx` (`#7c3aed`, `#9b6cf5`, `#7ec4ef`). Nada del dorado/magenta de la captura de referencia.
- **Orden de los planes:** Landing Page → Clásica → E-Commerce. La destacada es Clásica.

---

### Task 1: Contenido i18n

Agrega la clave `pricing` a los dos archivos de traducción. `differentiator` se deja intacta en esta tarea — se borra en la Task 3, cuando ya no la use nadie. Después de esta tarea el sitio se ve exactamente igual: solo se sumó contenido que todavía nadie lee.

**Files:**
- Modify: `src/locales/es/translation.json` (insertar antes de `"differentiator"`, línea 141)
- Modify: `src/locales/en/translation.json` (insertar antes de `"differentiator"`, línea 141)

**Interfaces:**
- Consumes: nada.
- Produces: el árbol de claves que consume la Task 2:
  - `pricing.kicker`, `pricing.title`, `pricing.titleHighlight`, `pricing.description`
  - `pricing.featuredBadge`, `pricing.cta`
  - `pricing.ctaAriaLabel` y `pricing.whatsappMessage`, ambas con la interpolación `{{plan}}`
  - `pricing.plans.<landing|clasica|ecommerce>.name`
  - `pricing.plans.<key>.price.{currency,amount,amountSmall,note}`
  - `pricing.plans.<key>.features` → array de strings
  - `pricing.proof.<pagespeed|projects|uptime>.{value,unit,label}`

- [ ] **Step 1: Insertar el bloque `pricing` en `src/locales/es/translation.json`**

Va inmediatamente antes de la línea `"differentiator": {`:

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
        "price": {
          "currency": "Pesos",
          "amount": "330",
          "amountSmall": "000",
          "note": "pago único"
        },
        "features": [
          "Diseño personalizado",
          "Redacción de contenidos persuasivos con IA incluidos.",
          "Una portada con toda la info (Inicio, Quiénes somos, Servicios, Contacto, etc.).",
          "Formulario de contacto y botón de WhatsApp directo.",
          "Soporte técnico y mantenimiento post-entrega."
        ]
      },
      "clasica": {
        "name": "Clásica",
        "price": {
          "currency": "Pesos",
          "amount": "400",
          "amountSmall": "000",
          "note": "pago único"
        },
        "features": [
          "Diseño personalizado y auto administrable (WordPress).",
          "Redacción de contenidos persuasivos con IA incluidos.",
          "Hasta 5 secciones (Inicio, Quiénes somos, Servicios, Contacto, etc.).",
          "Formulario de contacto y botón de WhatsApp directo.",
          "Soporte técnico y mantenimiento post-entrega."
        ]
      },
      "ecommerce": {
        "name": "E-Commerce",
        "price": {
          "currency": "Pesos",
          "amount": "450",
          "amountSmall": "000",
          "note": "pago único"
        },
        "features": [
          "Todo lo del Plan Clásica.",
          "Carrito de compras y pasarelas de pago (Mercado Pago, tarjetas, transferencias).",
          "Configuración de envíos (Correo Argentino, Andreani, etc.).",
          "Optimización masiva de descripciones de productos con IA para mejorar tu SEO en Google.",
          "Retoque digital inteligente de iluminación para las fotos de tu catálogo (exclusivo para que tus productos luzcan impecables).",
          "Te enseñamos a subir tus productos."
        ]
      }
    },
    "proof": {
      "pagespeed": { "value": "98", "unit": "/100", "label": "PageSpeed promedio" },
      "projects": { "value": "+50", "unit": "", "label": "Proyectos entregados" },
      "uptime": { "value": "99.9", "unit": "%", "label": "Uptime garantizado" }
    }
  },
```

- [ ] **Step 2: Insertar el bloque `pricing` en `src/locales/en/translation.json`**

Misma posición, inmediatamente antes de `"differentiator": {`. Los precios quedan en pesos argentinos; la etiqueta de moneda pasa a `ARS`, que es lo que entiende un lector en inglés.

```json
  "pricing": {
    "kicker": "Plans and pricing",
    "title": "A plan for every",
    "titleHighlight": "stage of your business.",
    "description": "Three ways to start, all one-time payments with no monthly fees. Pick the one that fits your project today: you can scale later without rebuilding anything.",
    "featuredBadge": "Most chosen",
    "cta": "I want this plan",
    "ctaAriaLabel": "Ask about the {{plan}} plan on WhatsApp",
    "whatsappMessage": "Hi! I'm interested in the {{plan}} plan and I'd like to schedule a consultation.",
    "plans": {
      "landing": {
        "name": "Landing Page",
        "price": {
          "currency": "ARS",
          "amount": "330",
          "amountSmall": "000",
          "note": "one-time payment"
        },
        "features": [
          "Custom design",
          "Persuasive AI-assisted copywriting included.",
          "A single page with all the info (Home, About us, Services, Contact, etc.).",
          "Contact form and direct WhatsApp button.",
          "Technical support and post-delivery maintenance."
        ]
      },
      "clasica": {
        "name": "Classic",
        "price": {
          "currency": "ARS",
          "amount": "400",
          "amountSmall": "000",
          "note": "one-time payment"
        },
        "features": [
          "Custom, self-manageable design (WordPress).",
          "Persuasive AI-assisted copywriting included.",
          "Up to 5 sections (Home, About us, Services, Contact, etc.).",
          "Contact form and direct WhatsApp button.",
          "Technical support and post-delivery maintenance."
        ]
      },
      "ecommerce": {
        "name": "E-Commerce",
        "price": {
          "currency": "ARS",
          "amount": "450",
          "amountSmall": "000",
          "note": "one-time payment"
        },
        "features": [
          "Everything in the Classic plan.",
          "Shopping cart and payment gateways (Mercado Pago, cards, bank transfers).",
          "Shipping setup (Correo Argentino, Andreani, etc.).",
          "Bulk AI optimization of product descriptions to improve your SEO on Google.",
          "Smart digital lighting retouch for your catalog photos, so your products look flawless.",
          "We teach you how to upload your products."
        ]
      }
    },
    "proof": {
      "pagespeed": { "value": "98", "unit": "/100", "label": "Average PageSpeed" },
      "projects": { "value": "+50", "unit": "", "label": "Projects delivered" },
      "uptime": { "value": "99.9", "unit": "%", "label": "Guaranteed uptime" }
    }
  },
```

- [ ] **Step 3: Verificar que los dos JSON siguen siendo válidos**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/locales/es/translation.json','utf8')); JSON.parse(require('fs').readFileSync('src/locales/en/translation.json','utf8')); console.log('JSON OK')"
```

Esperado: imprime `JSON OK`. Si tira `SyntaxError`, casi siempre es una coma de más o de menos en el punto de inserción.

- [ ] **Step 4: Verificar que las dos claves `pricing` tienen la misma forma**

Un idioma con una clave que al otro le falta produce texto crudo tipo `pricing.plans.landing.name` en pantalla, y no lo detecta ningún build.

```bash
node -e "const f=p=>JSON.parse(require('fs').readFileSync(p,'utf8')).pricing; const walk=(o,pre='')=>Object.entries(o).flatMap(([k,v])=>Array.isArray(v)?[pre+k+'['+v.length+']']:typeof v==='object'?walk(v,pre+k+'.'):[pre+k]); const a=walk(f('src/locales/es/translation.json')).sort(), b=walk(f('src/locales/en/translation.json')).sort(); console.log(JSON.stringify(a)===JSON.stringify(b)?'ESTRUCTURA OK':'DIFIERE:\n'+a.filter(x=>!b.includes(x)).concat(b.filter(x=>!a.includes(x))).join('\n'))"
```

Esperado: imprime `ESTRUCTURA OK`.

- [ ] **Step 5: Commit**

```bash
git add src/locales/es/translation.json src/locales/en/translation.json
git commit -m "feat(pricing): agregar contenido i18n de los tres planes"
```

---

### Task 2: Componente `Pricing` montado en el sitio

Crea el componente y su hoja de estilos, y lo monta en `App.jsx` en el lugar que ocupaba `Differentiator`. Al terminar esta tarea la sección de precios ya se ve en el sitio y `Differentiator` deja de renderizarse, aunque sus archivos todavía existan.

**Files:**
- Create: `src/components/Pricing.jsx`
- Create: `src/components/Pricing.css`
- Modify: `src/App.jsx:6` (import) y `src/App.jsx:64` (uso en el `<main>`)

**Interfaces:**
- Consumes: las claves `pricing.*` de la Task 1. De `./icons.jsx`: `IconCheckCircle`, `IconGauge`, `IconLayers`, `IconShield` — todos son `(p) => <svg {...base} {...p} />`, así que aceptan props.
- Produces: `export default function Pricing()`, sin props. La Task 3 no depende de nada de acá salvo de que `Differentiator` ya no se importe en `App.jsx`.

- [ ] **Step 1: Crear `src/components/Pricing.jsx`**

```jsx
import { useTranslation } from 'react-i18next'
import { IconCheckCircle, IconGauge, IconLayers, IconShield } from './icons.jsx'
import './Pricing.css'

// El mismo número que usa Contact.jsx.
const WHATSAPP_NUMBER = '5491168717233'

// Solo estructura: los textos y los precios viven en translation.json.
const PLANS = [
  { key: 'landing', accent: '#7c3aed', featured: false },
  { key: 'clasica', accent: '#9b6cf5', featured: true },
  { key: 'ecommerce', accent: '#7ec4ef', featured: false },
]

const PROOF = [
  { key: 'pagespeed', Icon: IconGauge },
  { key: 'projects', Icon: IconLayers },
  { key: 'uptime', Icon: IconShield },
]

export default function Pricing() {
  const { t } = useTranslation()

  return (
    <section className="pricing section grain" id="planes">
      <div className="pricing__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <header className="section-head" data-reveal>
          <span className="kicker">{t('pricing.kicker')}</span>
          <h2>
            {t('pricing.title')}{' '}
            <span className="grad-text">{t('pricing.titleHighlight')}</span>
          </h2>
          <p>{t('pricing.description')}</p>
        </header>

        <div className="pricing__grid">
          {PLANS.map(({ key, accent, featured }, i) => {
            const name = t(`pricing.plans.${key}.name`)
            const features = t(`pricing.plans.${key}.features`, { returnObjects: true })
            // Puede venir vacío: un precio sin miles (ej. USD 390) no debe
            // dejar un superíndice colgando.
            const amountSmall = t(`pricing.plans.${key}.price.amountSmall`)
            const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              t('pricing.whatsappMessage', { plan: name })
            )}`

            return (
              <article
                className={`plan gradient-border${featured ? ' plan--featured' : ''}`}
                key={key}
                style={{ '--accent': accent, '--delay': `${i * 110}ms` }}
                data-reveal
                data-spotlight
              >
                {featured && <span className="plan__badge">{t('pricing.featuredBadge')}</span>}

                <h3 className="plan__name">{name}</h3>

                <p className="plan__price">
                  <span className="plan__currency">
                    {t(`pricing.plans.${key}.price.currency`)}
                  </span>
                  <span className="plan__amount">
                    {t(`pricing.plans.${key}.price.amount`)}
                    {amountSmall ? <sup>{amountSmall}</sup> : null}
                  </span>
                  <span className="plan__note">{t(`pricing.plans.${key}.price.note`)}</span>
                </p>

                <ul className="plan__features">
                  {features.map((feature) => (
                    <li key={feature}>
                      <IconCheckCircle aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  className="btn btn--primary plan__cta"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('pricing.ctaAriaLabel', { plan: name })}
                >
                  {t('pricing.cta')}
                </a>
              </article>
            )
          })}
        </div>

        <ul className="pricing__proof" data-reveal style={{ '--delay': '260ms' }}>
          {PROOF.map(({ key, Icon }) => (
            <li key={key}>
              <span className="pricing__proof-icon">
                <Icon aria-hidden="true" />
              </span>
              <span className="pricing__proof-value">
                {t(`pricing.proof.${key}.value`)}
                <small>{t(`pricing.proof.${key}.unit`)}</small>
              </span>
              <span className="pricing__proof-label">{t(`pricing.proof.${key}.label`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Crear `src/components/Pricing.css`**

```css
/* Sin fondo propio: lo pone .pricing__bg, que se funde en los bordes.
   Hereda el degradado que tenía la sección anterior para que la transición
   con TechStack (arriba) y Process (abajo) no cambie. */
.pricing__bg {
  background: radial-gradient(80% 75% at 4% 18%, rgba(98, 26, 226, 0.42) 0%, transparent 62%),
    radial-gradient(65% 65% at 94% 90%, rgba(74, 159, 224, 0.2) 0%, transparent 66%),
    linear-gradient(180deg, rgba(13, 10, 51, 0.46) 0%, rgba(17, 12, 59, 0.4) 45%, rgba(9, 7, 42, 0.48) 100%);
}

.pricing .container {
  position: relative;
  z-index: 2;
}

.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(18px, 1.8vw, 28px);
  align-items: stretch;
}

/* --- Tarjeta de plan --- */
.plan {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  padding: clamp(28px, 2.4vw, 40px) clamp(22px, 2vw, 32px) clamp(28px, 2.4vw, 36px);
  border-radius: var(--radius-lg);
  background: linear-gradient(165deg, rgba(28, 24, 62, 0.9) 0%, rgba(13, 11, 38, 0.95) 100%);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  transition: transform 0.5s var(--ease), border-color 0.5s var(--ease),
    box-shadow 0.5s var(--ease);
}

.plan:hover {
  transform: translateY(-8px);
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
  box-shadow: 0 34px 66px -32px color-mix(in srgb, var(--accent) 70%, transparent);
}

/* La destacada deja el borde de gradiente siempre encendido.
   Va con doble clase a propósito: así le gana en especificidad a
   .gradient-border::after de global.css sin depender del orden en que
   Vite inyecte las hojas de estilo. */
.plan.plan--featured::after {
  opacity: 1;
}

.plan--featured {
  border-color: transparent;
  box-shadow: 0 30px 70px -34px rgba(124, 58, 237, 0.75);
}

/* Absoluto y no en el flujo: así los tres nombres de plan quedan a la
   misma altura aunque solo una tarjeta tenga badge. */
.plan__badge {
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--grad-violet);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: var(--shadow-violet);
}

.plan__name {
  font-size: clamp(1.05rem, 1.2vw, 1.22rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
}

/* Reserva el ancho del badge para que no se le encime al nombre. */
.plan--featured .plan__name {
  padding-right: 104px;
}

/* --- Precio --- */
.plan__price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 9px;
  margin: 18px 0 24px;
}

.plan__currency {
  font-size: 0.86rem;
  font-weight: 400;
  color: var(--text-muted);
}

.plan__amount {
  font-size: clamp(2.5rem, 3.2vw, 3.3rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  background: var(--grad-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.plan__amount sup {
  font-size: 0.36em;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.plan__note {
  font-size: 0.74rem;
  font-style: italic;
  color: var(--text-dim);
}

/* --- Features ---
   La hairline superior va como background y no como border para poder
   usar el degradado --grad-hair que ya define el sistema. */
.plan__features {
  display: grid;
  gap: 13px;
  padding-top: 24px;
  margin-bottom: 30px;
  background-image: var(--grad-hair);
  background-repeat: no-repeat;
  background-size: 100% 1px;
  background-position: top left;
}

.plan__features li {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  font-size: 0.84rem;
  font-weight: 300;
  line-height: 1.62;
  color: var(--text-soft);
}

.plan__features svg {
  width: 17px;
  height: 17px;
  margin-top: 3px;
  flex-shrink: 0;
  color: var(--violet-soft);
  filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.5));
}

/* El auto empuja el botón al fondo: las tres tarjetas terminan parejas
   aunque una tenga 6 features y las otras 5. */
.plan__cta {
  margin-top: auto;
  width: 100%;
}

/* --- Franja de respaldo --- */
.pricing__proof {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2vw, 40px);
  margin-top: clamp(40px, 4vw, 64px);
  padding-top: clamp(26px, 2.6vw, 38px);
  background-image: var(--grad-hair);
  background-repeat: no-repeat;
  background-size: 100% 1px;
  background-position: top left;
}

.pricing__proof li {
  display: grid;
  justify-items: center;
  gap: 7px;
  text-align: center;
}

.pricing__proof-icon {
  color: var(--ice);
}

.pricing__proof-icon svg {
  width: 20px;
  height: 20px;
}

.pricing__proof-value {
  font-size: 1.45rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  background: var(--grad-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.pricing__proof-value small {
  font-size: 0.72rem;
  font-weight: 600;
}

.pricing__proof-label {
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--text-dim);
}

/* --- Responsive --- */
@media (max-width: 1100px) {
  .pricing__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .pricing__grid {
    grid-template-columns: 1fr;
  }

  /* Apiladas ya no hay nada con qué alinear, así que el badge vuelve al
     flujo y el nombre recupera su ancho completo. */
  .plan__badge {
    position: static;
    align-self: flex-start;
    margin-bottom: 14px;
  }

  .plan--featured .plan__name {
    padding-right: 0;
  }
}

@media (max-width: 560px) {
  .pricing__proof {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
```

- [ ] **Step 3: Montar el componente en `src/App.jsx`**

Cambiar la línea 6:

```jsx
import Differentiator from './components/Differentiator.jsx'
```

por:

```jsx
import Pricing from './components/Pricing.jsx'
```

Y la línea 64, dentro del `<main>`:

```jsx
        <Differentiator />
```

por:

```jsx
        <Pricing />
```

El `<main>` queda así:

```jsx
        <Hero />
        <Services />
        <TechStack />
        <Pricing />
        <Process />
        <Clients />
        <CtaBanner />
        <Contact />
```

- [ ] **Step 4: Verificar que compila**

```bash
npm run build
```

Esperado: termina en `✓ built in ...` sin errores. Si aparece `Failed to resolve import "./components/Differentiator.jsx"`, quedó una referencia sin cambiar en `App.jsx`.

- [ ] **Step 5: Verificación visual**

```bash
npm run dev
```

Abrir la home y comprobar, en este orden:

1. Entre TechStack y Process aparece la sección de precios, con el kicker "Planes y precios".
2. Hay **tres** tarjetas: Landing Page $330.000, Clásica $400.000, E-Commerce $450.000, en ese orden.
3. La tarjeta Clásica tiene el badge "Más elegido" arriba a la derecha y el borde de degradado encendido **sin** pasar el mouse.
4. Los tres botones terminan alineados en la misma línea horizontal, pese a que E-Commerce tiene 6 features y las otras 5.
5. Al pasar el mouse sobre una tarjeta: se eleva, aparece el spotlight que sigue al cursor y el borde toma el color de acento.
6. Click en el botón de Clásica → abre WhatsApp en pestaña nueva, al +54 11 6871-7233, con el mensaje "¡Hola! Me interesa el plan Clásica y quiero coordinar una consulta." ya escrito.
7. Cambiar el idioma a inglés desde el navbar: los tres planes se traducen, no aparece ningún texto crudo tipo `pricing.plans.landing.name`, y los precios siguen en pesos con la etiqueta `ARS`.
8. Achicar la ventana: a ~1000px pasa a 2 columnas, a ~650px a 1 columna y el badge se acomoda arriba del nombre sin encimarse.
9. Debajo de las tarjetas está la franja con 98/100, +50 y 99.9%.

- [ ] **Step 6: Commit**

```bash
git add src/components/Pricing.jsx src/components/Pricing.css src/App.jsx
git commit -m "feat(pricing): sección de planes con CTA directo a WhatsApp"
```

---

### Task 3: Baja de `Differentiator`

Elimina el componente viejo y su contenido i18n. Se hace al final, cuando ya nadie lo referencia, para que el sitio nunca quede en un estado roto entre commits.

**Files:**
- Delete: `src/components/Differentiator.jsx`
- Delete: `src/components/Differentiator.css`
- Modify: `src/locales/es/translation.json` (quitar la clave `differentiator`)
- Modify: `src/locales/en/translation.json` (quitar la clave `differentiator`)

**Interfaces:**
- Consumes: que la Task 2 ya haya sacado el import y el uso en `App.jsx`.
- Produces: nada.

- [ ] **Step 1: Confirmar que nadie referencia `Differentiator`**

```bash
grep -rn "Differentiator\|differentiator\|#nosotros" src/
```

Esperado: **cero resultados fuera de** los dos archivos que se van a borrar y las dos claves de traducción que se van a quitar. Si aparece una referencia en `App.jsx`, la Task 2 quedó incompleta — corregirla antes de seguir.

(El `id="nosotros"` de la sección vieja no estaba enlazado desde ningún lado: el navbar no lo lista y los links del footer apuntan todos a `#contacto`.)

- [ ] **Step 2: Borrar los archivos del componente**

```bash
git rm src/components/Differentiator.jsx src/components/Differentiator.css
```

- [ ] **Step 3: Quitar la clave `differentiator` de los dos JSON**

En `src/locales/es/translation.json` y en `src/locales/en/translation.json`, borrar el bloque completo que empieza en `"differentiator": {` y termina en el `},` anterior a `"techStack"`. Son 24 líneas en cada archivo.

Después del borrado, `"pricing"` queda inmediatamente seguido de `"techStack"`.

- [ ] **Step 4: Verificar los JSON y el build**

```bash
node -e "for (const l of ['es','en']) { const j=JSON.parse(require('fs').readFileSync('src/locales/'+l+'/translation.json','utf8')); if (j.differentiator) throw new Error(l+': quedó la clave differentiator'); if (!j.pricing) throw new Error(l+': falta la clave pricing'); } console.log('LOCALES OK')" && npm run build
```

Esperado: imprime `LOCALES OK` y después el build termina sin errores.

- [ ] **Step 5: Verificación visual final**

```bash
npm run dev
```

La home se ve igual que al final de la Task 2 — la baja no debe cambiar nada visible. En la consola del navegador no debe haber errores nuevos.

- [ ] **Step 6: Commit**

```bash
git add -A src/components src/locales
git commit -m "chore: dar de baja la sección Differentiator, reemplazada por Pricing"
```

---

## Criterios de aceptación (del spec)

Al terminar las tres tareas, verificar la lista completa del spec:

1. `Differentiator.jsx`, `Differentiator.css` y la clave `differentiator` ya no existen. → Task 3
2. `#planes` renderiza tres tarjetas con los nombres, precios y features del spec, en español y en inglés. → Task 1 + 2
3. La tarjeta Clásica se ve destacada. → Task 2, Step 5.3
4. Los tres botones abren WhatsApp al +54 11 6871-7233 con el mensaje de su plan. → Task 2, Step 5.6
5. Las tres tarjetas terminan a la misma altura con el botón alineado abajo. → Task 2, Step 5.4
6. La franja de métricas muestra 98/100, +50 y 99.9%. → Task 2, Step 5.9
7. `npm run build` pasa sin errores ni warnings nuevos. → Task 3, Step 4
8. Sin regresión visual en `TechStack` (arriba) ni `Process` (abajo). → Task 3, Step 5
