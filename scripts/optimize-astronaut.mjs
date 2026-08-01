/**
 * Prepara la secuencia del astronauta del banner CTA.
 *
 *   node scripts/optimize-astronaut.mjs
 *
 * Los frames originales vienen con fondo gris opaco, así que no se pueden
 * pegar sobre el degradado del CTA. El script:
 *   1. Descarta frames consecutivos idénticos y se queda con 1 de cada STEP.
 *   2. Recorta el fondo por crecimiento de región desde los bordes. No se usa
 *      un umbral de color global porque el fondo es un degradado: se compara
 *      cada píxel con su vecino, así el relleno acompaña el degradado y frena
 *      de golpe en el contorno blanco del sticker.
 *   3. Suaviza el alfa 3x3 para que el borde no quede dentado.
 *   4. Recorta todos los frames con la MISMA caja (la unión de todos) para que
 *      el astronauta no salte de posición entre frame y frame.
 *   5. Exporta WebP con transparencia en dos resoluciones.
 *
 * Salida → public/astronauta/
 */

import sharp from 'sharp'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'src/recursos/astronauta')
const OUT = path.join(root, 'public/astronauta')

const STEP = 2
const WORK_WIDTH = 1400 // se keyea a esta resolución: más rápido que a 1920 y da margen
const TOL = 22 // tolerancia de color entre píxeles vecinos al crecer la región

const SIZES = [
  { dir: 'w860', width: 860, quality: 76 },
  { dir: 'w520', width: 520, quality: 74 },
]

const md5 = (buf) => crypto.createHash('md5').update(buf).digest('hex')
const mb = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`

/**
 * Crecimiento de región desde los bordes de la imagen.
 * Devuelve un Uint8Array de alfa (0 = fondo, 255 = sujeto).
 */
function keyBackground(data, width, height, channels) {
  const n = width * height
  const isBg = new Uint8Array(n)
  const queue = new Int32Array(n)
  let head = 0
  let tail = 0

  const push = (i) => {
    if (!isBg[i]) {
      isBg[i] = 1
      queue[tail++] = i
    }
  }

  // Semillas: todo el perímetro
  for (let x = 0; x < width; x++) {
    push(x)
    push((height - 1) * width + x)
  }
  for (let y = 0; y < height; y++) {
    push(y * width)
    push(y * width + width - 1)
  }

  while (head < tail) {
    const i = queue[head++]
    const o = i * channels
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    const x = i % width
    const y = (i / width) | 0

    for (let d = 0; d < 4; d++) {
      const nx = x + (d === 0 ? -1 : d === 1 ? 1 : 0)
      const ny = y + (d === 2 ? -1 : d === 3 ? 1 : 0)
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue

      const j = ny * width + nx
      if (isBg[j]) continue

      const p = j * channels
      // Comparación LOCAL (contra el vecino, no contra una semilla global):
      // así el relleno sigue el degradado del fondo sin desbordarse al sujeto.
      const dist = Math.abs(data[p] - r) + Math.abs(data[p + 1] - g) + Math.abs(data[p + 2] - b)
      if (dist <= TOL) push(j)
    }
  }

  const alpha = new Uint8Array(n)
  for (let i = 0; i < n; i++) alpha[i] = isBg[i] ? 0 : 255
  return alpha
}

/** Suavizado 3x3 del canal alfa para matar el dentado */
function featherAlpha(alpha, width, height) {
  const out = new Uint8Array(alpha.length)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      let count = 0
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy
        if (yy < 0 || yy >= height) continue
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx
          if (xx < 0 || xx >= width) continue
          sum += alpha[yy * width + xx]
          count++
        }
      }
      out[y * width + x] = Math.round(sum / count)
    }
  }
  return out
}

async function main() {
  const files = (await fs.readdir(SRC)).filter((f) => /\.jpe?g$/i.test(f)).sort()
  if (!files.length) throw new Error(`No hay frames en ${SRC}`)

  // 1. Deduplicar y diezmar
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

  // 2. Keying
  const keyed = []
  let bbox = { left: Infinity, top: Infinity, right: -1, bottom: -1 }

  for (const [idx, buf] of kept.entries()) {
    const { data, info } = await sharp(buf)
      .resize({ width: WORK_WIDTH })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const { width, height, channels } = info
    let alpha = keyBackground(data, width, height, channels)

    // Caja del sujeto (antes del suavizado, con el alfa binario)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (alpha[y * width + x]) {
          if (x < bbox.left) bbox.left = x
          if (x > bbox.right) bbox.right = x
          if (y < bbox.top) bbox.top = y
          if (y > bbox.bottom) bbox.bottom = y
        }
      }
    }

    alpha = featherAlpha(alpha, width, height)
    for (let i = 0; i < width * height; i++) data[i * channels + 3] = alpha[i]

    keyed.push({ data, width, height, channels })
    if ((idx + 1) % 15 === 0) console.log(`  keyed ${idx + 1}/${kept.length}`)
  }

  // 3. Caja común con un poco de aire
  const pad = 12
  const cropLeft = Math.max(0, bbox.left - pad)
  const cropTop = Math.max(0, bbox.top - pad)
  const cropW = Math.min(keyed[0].width - cropLeft, bbox.right - bbox.left + 1 + pad * 2)
  const cropH = Math.min(keyed[0].height - cropTop, bbox.bottom - bbox.top + 1 + pad * 2)
  console.log(`Caja común: ${cropW}x${cropH} en (${cropLeft}, ${cropTop})`)

  // 4. Exportar
  await fs.rm(OUT, { recursive: true, force: true })

  for (const { dir, width, quality } of SIZES) {
    const target = path.join(OUT, dir)
    await fs.mkdir(target, { recursive: true })

    let bytes = 0
    for (const [i, frame] of keyed.entries()) {
      const out = await sharp(frame.data, {
        raw: { width: frame.width, height: frame.height, channels: frame.channels },
      })
        .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, alphaQuality: 90, effort: 5 })
        .toBuffer()

      await fs.writeFile(path.join(target, `frame-${String(i + 1).padStart(3, '0')}.webp`), out)
      bytes += out.length
    }
    console.log(`${dir}:  ${keyed.length} frames · ${mb(bytes)} (~${Math.round(bytes / keyed.length / 1024)} KB c/u)`)
  }

  await fs.writeFile(
    path.join(OUT, 'manifest.json'),
    JSON.stringify(
      { frames: keyed.length, sizes: SIZES.map((s) => s.dir), aspect: +(cropW / cropH).toFixed(4) },
      null,
      2
    )
  )
  console.log(`\nListo → public/astronauta/ (${keyed.length} frames)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
