/**
 * Optimiza la imagen de la sección ServicesLight.
 *
 *   node scripts/optimize-services.mjs
 *
 * Lee src/recursos/services-img.jpg (el original en alta resolución) y
 * exporta un WebP liviano a src/recursos/services-img.webp, que es el que
 * importa el componente. El original se conserva para poder re-generar.
 *
 * En desktop la imagen se ve a ~900 px de ancho como máximo dentro de la
 * columna de intro; 1920 cubre pantallas retina (2x).
 */

import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ENTRADA = path.join(root, 'src/recursos/services-img.jpg')
const SALIDA = path.join(root, 'src/recursos/services-img.webp')

const ANCHO = 1920
const QUALITY = 78

async function main() {
  const { width, height } = await sharp(ENTRADA).metadata()
  const pesoOriginal = (await fs.stat(ENTRADA)).size
  console.log(`Original:  ${width}x${height} · ${(pesoOriginal / 1024 / 1024).toFixed(2)} MB`)

  const buf = await sharp(ENTRADA)
    .resize({ width: ANCHO, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer()

  await fs.writeFile(SALIDA, buf)

  const m = await sharp(buf).metadata()
  const ahorro = 100 - (buf.length / pesoOriginal) * 100
  console.log(`Optimizada: ${m.width}x${m.height} · ${(buf.length / 1024).toFixed(1)} KB → ${path.relative(root, SALIDA)}`)
  console.log(`Ahorro: ${ahorro.toFixed(1)}%`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})