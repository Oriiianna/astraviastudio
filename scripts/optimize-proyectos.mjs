/**
 * Prepara las capturas del portfolio para web.
 *
 *   node scripts/optimize-proyectos.mjs
 *
 * Lee los PNG crudos de src/recursos/proyectos/ (los genera
 * scripts/capture-proyectos.mjs) y exporta un WebP por proyecto en dos anchos:
 * uno para desktop y otro liviano para móvil.
 *
 * Las capturas son tiras verticales de varias pantallas del sitio, así que son
 * altas: el ancho manda y la altura sale sola.
 *
 * Salida → public/proyectos/
 */

import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'src/recursos/proyectos')
const OUT = path.join(root, 'public/proyectos')

// El desktop se ve a ~620 px de ancho en la tarjeta; 1240 cubre pantallas 2x.
const ANCHOS = [
  { sufijo: '', width: 1240, quality: 74 },
  { sufijo: '-sm', width: 720, quality: 70 },
]

async function main() {
  await fs.mkdir(OUT, { recursive: true })

  const archivos = (await fs.readdir(SRC)).filter((f) => f.endsWith('.png'))
  if (!archivos.length) {
    throw new Error(`No hay PNG en ${path.relative(root, SRC)} — corré capture-proyectos.mjs primero`)
  }

  for (const archivo of archivos) {
    const slug = path.basename(archivo, '.png')
    const entrada = path.join(SRC, archivo)
    const { width, height } = await sharp(entrada).metadata()
    console.log(`\n${slug}: original ${width}x${height}`)

    for (const { sufijo, width: w, quality } of ANCHOS) {
      const buf = await sharp(entrada)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality, effort: 6 })
        .toBuffer()

      const nombre = `${slug}${sufijo}.webp`
      await fs.writeFile(path.join(OUT, nombre), buf)

      const m = await sharp(buf).metadata()
      console.log(`  ${nombre}: ${m.width}x${m.height} · ${(buf.length / 1024).toFixed(1)} KB`)
    }
  }

  console.log('\nListo → public/proyectos/')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
