/**
 * Prepara el logo de marca para web.
 *
 *   node scripts/optimize-logo.mjs
 *
 * El original (src/recursos/logo/logo_astravia.jpeg) viene en JPEG con fondo
 * blanco y mucho margen. Este script:
 *   1. Convierte el blanco en transparencia (con borde suavizado).
 *   2. Recorta el margen sobrante.
 *   3. Detecta el hueco entre isotipo y wordmark para separarlos bien.
 *   4. Exporta el lockup, una variante clara para fondos oscuros y el isotipo.
 *
 * Salida → public/brand/
 */

import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'src/recursos/logo/logo_astravia.jpeg')
const OUT = path.join(root, 'public/brand')

// Umbrales del recorte de fondo: por debajo de NEAR es blanco puro (transparente),
// por encima de SOLID es tinta (opaco); en el medio se interpola para no dejar borde duro.
const NEAR = 14
const SOLID = 44

/** Reemplaza el fondo blanco por alpha */
async function removeWhite(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * info.channels
    const d = Math.hypot(255 - data[o], 255 - data[o + 1], 255 - data[o + 2])
    let a = 255
    if (d <= NEAR) a = 0
    else if (d < SOLID) a = Math.round(((d - NEAR) / (SOLID - NEAR)) * 255)
    data[o + 3] = Math.min(data[o + 3], a)
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .png()
    .toBuffer()
}

/**
 * Busca el primer corredor de columnas vacías lo bastante ancho.
 * Es el espacio entre el hexágono y la palabra ASTRAVIA.
 */
async function findGap(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  const columnHasInk = new Array(width).fill(false)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (data[(y * width + x) * channels + 3] > 8) {
        columnHasInk[x] = true
        break
      }
    }
  }

  const minGap = Math.round(width * 0.015)
  let run = 0
  for (let x = Math.round(width * 0.05); x < width; x++) {
    if (!columnHasInk[x]) {
      run++
    } else {
      if (run >= minGap) return { start: x - run, end: x }
      run = 0
    }
  }
  return null
}

async function main() {
  await fs.mkdir(OUT, { recursive: true })

  const original = await sharp(SRC).metadata()
  console.log(`Original: ${original.width}x${original.height} (${original.format})`)

  const transparent = await removeWhite(SRC)
  const lockup = await sharp(transparent).trim({ threshold: 1 }).toBuffer()
  const { width: lw, height: lh } = await sharp(lockup).metadata()
  console.log(`Lockup recortado: ${lw}x${lh}`)

  const gap = await findGap(lockup)
  if (!gap) throw new Error('No se encontró el hueco entre isotipo y wordmark')
  console.log(`Hueco isotipo/wordmark: x ${gap.start} → ${gap.end}`)

  // --- Isotipo solo ---
  const iso = await sharp(lockup)
    .extract({ left: 0, top: 0, width: gap.start, height: lh })
    .trim({ threshold: 1 })
    .toBuffer()

  // --- Variante clara: se aclara solo el wordmark, el isotipo queda intacto ---
  const wordLeft = gap.end
  const wordWidth = lw - wordLeft
  const wordBright = await sharp(lockup)
    .extract({ left: wordLeft, top: 0, width: wordWidth, height: lh })
    .modulate({ brightness: 1.62, saturation: 1.12 })
    .png()
    .toBuffer()

  const lockupLight = await sharp(lockup)
    .composite([{ input: wordBright, left: wordLeft, top: 0 }])
    .png()
    .toBuffer()

  // --- Exportar ---
  const outputs = [
    { buf: lockup, name: 'logo-astravia', height: 160 },
    { buf: lockupLight, name: 'logo-astravia-light', height: 160 },
    { buf: iso, name: 'isotipo-astravia', height: 256 },
  ]

  for (const { buf, name, height } of outputs) {
    const resized = sharp(buf).resize({ height, withoutEnlargement: true })
    const png = await resized.clone().png({ compressionLevel: 9 }).toBuffer()
    const webp = await resized.clone().webp({ quality: 92, alphaQuality: 100 }).toBuffer()

    await fs.writeFile(path.join(OUT, `${name}.png`), png)
    await fs.writeFile(path.join(OUT, `${name}.webp`), webp)

    const m = await sharp(png).metadata()
    console.log(
      `${name}: ${m.width}x${m.height} · png ${(png.length / 1024).toFixed(1)} KB · webp ${(webp.length / 1024).toFixed(1)} KB`
    )
  }

  const favicon = await sharp(iso)
    .resize({ width: 64, height: 64, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  await fs.writeFile(path.join(OUT, 'favicon.png'), favicon)
  console.log(`favicon.png: 64x64 · ${(favicon.length / 1024).toFixed(1)} KB`)

  console.log('\nListo → public/brand/')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
