/**
 * Extrae los colores dominantes del logo para derivar la paleta del sitio.
 *   node scripts/brand-palette.mjs
 * Solo imprime: no escribe nada. Sirve para elegir los tokens de global.css.
 */

import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
// node scripts/brand-palette.mjs [nombre-del-archivo-en-public/brand]
const LOGO = path.join(root, 'public/brand', process.argv[2] || 'logo-astravia.png')

const hex = (r, g, b) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

function toHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0))
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

const { data, info } = await sharp(LOGO).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

// Agrupar por celdas de color para encontrar los tonos dominantes
const buckets = new Map()
for (let i = 0; i < info.width * info.height; i++) {
  const o = i * info.channels
  if (data[o + 3] < 200) continue
  const r = data[o], g = data[o + 1], b = data[o + 2]
  const key = `${r >> 4}-${g >> 4}-${b >> 4}`
  const acc = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 }
  acc.n++; acc.r += r; acc.g += g; acc.b += b
  buckets.set(key, acc)
}

const total = [...buckets.values()].reduce((s, a) => s + a.n, 0)
const top = [...buckets.values()]
  .sort((a, b) => b.n - a.n)
  .slice(0, 14)
  .map((a) => {
    const r = Math.round(a.r / a.n), g = Math.round(a.g / a.n), b = Math.round(a.b / a.n)
    const [h, s, l] = toHsl(r, g, b)
    return { hex: hex(r, g, b), h, s, l, pct: ((a.n / total) * 100).toFixed(1) }
  })

console.log('hex        H    S%   L%   uso%')
for (const c of top) {
  console.log(
    `${c.hex}  ${String(c.h).padStart(3)}  ${String(c.s).padStart(3)}  ${String(c.l).padStart(3)}   ${c.pct.padStart(5)}`
  )
}
