/**
 * Arma la imagen de previsualización para redes (Open Graph / Twitter).
 *
 *   node scripts/optimize-og.mjs
 *
 * Es la miniatura que aparece cuando alguien pega el link en WhatsApp, LinkedIn
 * o Slack. Sin ella el link se comparte como texto pelado.
 *
 * Se compone con piezas que ya están en el repo —un frame del render del hero
 * como fondo y el logo claro encima— así no hay que mantener un archivo suelto
 * en Figma: si cambia la marca, se vuelve a correr y listo.
 *
 * No lleva texto propio a propósito: sharp dibujaría el SVG con las fuentes que
 * tenga el sistema, y Poppins no está garantizada. El logo ya dice el nombre.
 *
 * Salida → public/brand/og-astravia.jpg (1200x630, el tamaño que piden todas
 * las plataformas)
 */

import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FONDO = path.join(root, 'public/hero/w1280/frame-024.webp')
const LOGO = path.join(root, 'public/brand/logo-astravia-light.png')
const OUT = path.join(root, 'public/brand/og-astravia.jpg')

const ANCHO = 1200
const ALTO = 630

async function main() {
  // Fondo: el frame recortado a 1200x630 y oscurecido, para que el logo respire.
  const fondo = await sharp(FONDO)
    .resize({ width: ANCHO, height: ALTO, fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.72, saturation: 1.12 })
    .toBuffer()

  // Velo violeta de marca + viñeta, en un solo SVG.
  const velo = Buffer.from(`
    <svg width="${ANCHO}" height="${ALTO}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="46%" r="62%">
          <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.16" />
          <stop offset="100%" stop-color="#05040a" stop-opacity="0.8" />
        </radialGradient>
      </defs>
      <rect width="${ANCHO}" height="${ALTO}" fill="url(#glow)" />
    </svg>`)

  const logo = await sharp(LOGO)
    .resize({ width: Math.round(ANCHO * 0.42), withoutEnlargement: false })
    .toBuffer()
  const { height: altoLogo } = await sharp(logo).metadata()

  await sharp(fondo)
    .composite([
      { input: velo, blend: 'over' },
      { input: logo, top: Math.round((ALTO - altoLogo) / 2), left: Math.round(ANCHO * 0.29) },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(OUT)

  const { size } = await fs.stat(OUT)
  console.log(`og-astravia.jpg: ${ANCHO}x${ALTO} · ${(size / 1024).toFixed(1)} KB`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
