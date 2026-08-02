// Captura las pantallas de los proyectos del portfolio.
//
// Playwright NO es dependencia del proyecto: son ~150 MB de browsers para una
// captura que se rehace una vez al año. Se instala al vuelo y no se guarda:
//
//   npm i -D playwright --no-save
//   npx playwright install chromium      # sólo la primera vez
//   node scripts/capture-proyectos.mjs
//   npm run assets:proyectos             # PNG -> WebP en public/
//
// Por qué no un `fullPage: true` y listo: el sitio de Altamira tiene el fondo
// (un <canvas> de secuencia atada al scroll) en un contenedor `fixed inset-0`.
// En una captura full-page ese fondo cubre sólo el primer viewport y todo lo de
// abajo queda con el texto marfil sobre el crema del body, es decir invisible.
// Así que capturamos pantalla por pantalla —cada una en su posición de scroll,
// con el fondo y las animaciones ya resueltas— y las cosemos con sharp.

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { chromium } from 'playwright'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DESTINO = path.join(RAIZ, 'src/recursos/proyectos')

const ANCHO = 1440
const ALTO = 900

const PROYECTOS = [
  {
    slug: 'altamira',
    url: 'https://astraviastudio-inmobiliaria.vercel.app/',
    // Arranque de cada sección de la home, en px. Si el sitio cambia, sacalos de:
    //   [...document.querySelectorAll('section')].map(s => s.offsetTop)
    //
    // Van sólo el hero y las propiedades destacadas. El manifiesto (905) queda
    // afuera a propósito: su texto anima desde abajo de una máscara y con el
    // scroll instantáneo del script nunca llega a subir, así que se captura en
    // blanco. Dos pantallas alcanzan para el recorrido del hover.
    pantallas: [0, 1805],
  },
]

async function capturarPantalla(page, y) {
  await page.evaluate((destino) => window.scrollTo(0, destino), y)
  // Las secciones animan al entrar en viewport (framer-motion, `once: true`) y
  // los títulos lo hacen línea por línea con stagger. Sin esta espera se
  // capturan a medio escribir.
  await page.waitForTimeout(2200)
  // Sin `clip` ni `fullPage`: la captura es el viewport tal cual, que después
  // del scroll es justo la pantalla que queremos. Un `clip` con y fuera del
  // viewport no sirve —Playwright lo recorta contra el área visible—, y es
  // además lo único que preserva bien el fondo `fixed`.
  return page.screenshot()
}

const navegador = await chromium.launch()
const contexto = await navegador.newContext({
  viewport: { width: ANCHO, height: ALTO },
  deviceScaleFactor: 2,
})

await mkdir(DESTINO, { recursive: true })

for (const { slug, url, pantallas } of PROYECTOS) {
  const page = await contexto.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)

  const tomas = []
  for (const y of pantallas) tomas.push(await capturarPantalla(page, y))

  // deviceScaleFactor: 2 ⇒ los buffers vienen al doble de tamaño.
  const salida = path.join(DESTINO, `${slug}.png`)
  await sharp({
    create: {
      width: ANCHO * 2,
      height: ALTO * 2 * tomas.length,
      channels: 3,
      background: '#0b0f18',
    },
  })
    .composite(tomas.map((input, i) => ({ input, top: i * ALTO * 2, left: 0 })))
    .png()
    .toFile(salida)

  console.log(`✓ ${slug} · ${tomas.length} pantallas → ${path.relative(RAIZ, salida)}`)
  await page.close()
}

await navegador.close()
