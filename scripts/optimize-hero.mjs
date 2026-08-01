/**
 * Convierte la secuencia de frames del hero (src/recursos/heroastravia/*.jpg)
 * en WebP optimizados dentro de public/hero/.
 *
 *   node scripts/optimize-hero.mjs
 *
 * - Descarta frames consecutivos idénticos (el GIF original repetía varios).
 * - Se queda con 1 de cada STEP frames: el scrub va atado al scroll, no a 30fps,
 *   así que con ~100 frames el movimiento ya se ve continuo y pesa la mitad.
 * - Genera dos resoluciones: 1280px (desktop) y 720px (móvil).
 * - Escribe public/hero/manifest.json con el conteo final de frames.
 *
 * Si querés más fluidez a cambio de peso, bajá STEP a 1.
 * Si querés que pese menos, subí STEP a 3 o bajá `quality`.
 */

import sharp from 'sharp'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'src/recursos/heroastravia')
const OUT = path.join(root, 'public/hero')

const STEP = 2

const SIZES = [
  { dir: 'w1280', width: 1280, quality: 48 },
  { dir: 'w720', width: 720, quality: 45 },
]

const md5 = (buf) => crypto.createHash('md5').update(buf).digest('hex')
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

async function main() {
  const files = (await fs.readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f)).sort()
  if (!files.length) throw new Error(`No hay frames en ${SRC}`)

  // 1. Leer y descartar repeticiones consecutivas
  const unique = []
  let prevHash = null
  let sourceBytes = 0

  for (const file of files) {
    const buf = await fs.readFile(path.join(SRC, file))
    sourceBytes += buf.length
    const hash = md5(buf)
    if (hash === prevHash) continue
    prevHash = hash
    unique.push({ file, buf })
  }

  // 2. Quedarse con 1 de cada STEP, garantizando que el último frame entre
  const kept = unique.filter((_, i) => i % STEP === 0)
  if (kept.at(-1) !== unique.at(-1)) kept.push(unique.at(-1))

  console.log(`Origen:    ${files.length} frames · ${mb(sourceBytes)}`)
  console.log(`Sin repes: ${unique.length} frames (se descartaron ${files.length - unique.length})`)
  console.log(`1 de ${STEP}:   ${kept.length} frames finales`)

  // 3. Reescalar y codificar
  await fs.rm(OUT, { recursive: true, force: true })

  for (const { dir, width, quality } of SIZES) {
    const target = path.join(OUT, dir)
    await fs.mkdir(target, { recursive: true })

    let bytes = 0
    for (const [i, { buf }] of kept.entries()) {
      const name = `frame-${String(i + 1).padStart(3, '0')}.webp`
      const out = await sharp(buf)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 5, smartSubsample: true })
        .toBuffer()
      await fs.writeFile(path.join(target, name), out)
      bytes += out.length
    }

    console.log(`${dir}:  ${kept.length} frames · ${mb(bytes)} (~${Math.round(bytes / kept.length / 1024)} KB c/u)`)
  }

  // 4. Manifiesto para que el componente sepa cuántos frames hay
  await fs.writeFile(
    path.join(OUT, 'manifest.json'),
    JSON.stringify({ frames: kept.length, sizes: SIZES.map((s) => s.dir) }, null, 2)
  )

  console.log(`\nListo → public/hero/ (manifest: ${kept.length} frames)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
