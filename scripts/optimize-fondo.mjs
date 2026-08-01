/**
 * Prepara la secuencia de fondo (Vía Láctea) que corre desde la sección de
 * Servicios hasta el final de la página.
 *
 *   node scripts/optimize-fondo.mjs
 *
 * Va atenuada y tapada por las capas de cada sección, así que se comprime
 * mucho más fuerte que el hero: los artefactos no se llegan a ver y el peso
 * importa más, porque son frames que se suman a los del hero.
 *
 * Salida → public/fondo/
 */

import sharp from 'sharp'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'src/recursos/fondoastra')
const OUT = path.join(root, 'public/fondo')

// El recorrido es muy lento y cubre toda la página, así que alcanza con pocos
// frames: el scroll es larguísimo y la diferencia entre frames es mínima.
const STEP = 3

const SIZES = [
  { dir: 'w1280', width: 1280, quality: 38 },
  { dir: 'w760', width: 760, quality: 36 },
]

const md5 = (b) => crypto.createHash('md5').update(b).digest('hex')
const mb = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`

async function main() {
  const files = (await fs.readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f)).sort()
  if (!files.length) throw new Error(`No hay frames en ${SRC}`)

  const unique = []
  let prevHash = null
  let sourceBytes = 0
  for (const file of files) {
    const buf = await fs.readFile(path.join(SRC, file))
    sourceBytes += buf.length
    const hash = md5(buf)
    if (hash === prevHash) continue
    prevHash = hash
    unique.push(buf)
  }

  const kept = unique.filter((_, i) => i % STEP === 0)
  if (kept.at(-1) !== unique.at(-1)) kept.push(unique.at(-1))

  console.log(`Origen:    ${files.length} frames · ${mb(sourceBytes)}`)
  console.log(`Sin repes: ${unique.length} frames`)
  console.log(`1 de ${STEP}:   ${kept.length} frames finales`)

  await fs.rm(OUT, { recursive: true, force: true })

  for (const { dir, width, quality } of SIZES) {
    const target = path.join(OUT, dir)
    await fs.mkdir(target, { recursive: true })

    let bytes = 0
    for (const [i, buf] of kept.entries()) {
      const out = await sharp(buf)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 5, smartSubsample: true })
        .toBuffer()
      await fs.writeFile(path.join(target, `frame-${String(i + 1).padStart(3, '0')}.webp`), out)
      bytes += out.length
    }
    console.log(`${dir}:  ${kept.length} frames · ${mb(bytes)} (~${Math.round(bytes / kept.length / 1024)} KB c/u)`)
  }

  await fs.writeFile(
    path.join(OUT, 'manifest.json'),
    JSON.stringify({ frames: kept.length, sizes: SIZES.map((s) => s.dir) }, null, 2)
  )
  console.log(`\nListo → public/fondo/ (${kept.length} frames)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
