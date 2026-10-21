/**
 * Genera los activos de marca que referencia index.html y que no se pueden
 * servir directamente desde los originales:
 *
 *   node scripts/optimize-og.mjs
 *
 *   public/brand/og-astravia.jpg      1200x630 · Open Graph / Twitter / JSON-LD
 *   public/brand/isotipo-astravia.png  512x512 · apple-touch-icon y logo JSON-LD
 *   public/brand/favicon-{48,192}.png y public/favicon.ico · favicon (casco sobre un círculo con el degradado)
 *
 * WhatsApp y LinkedIn no leen WebP de forma fiable, por eso el OG es JPG.
 * Fuentes: og-portada.webp (portada con el sello) y favicon.png (casco blanco).
 */

import sharp from 'sharp'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const p = (...a) => path.join(root, ...a)

// Degradado de la portada (muestreado de og-portada.webp).
const degradado = (w, h) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
       <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="rgb(130,63,254)"/>
         <stop offset="1" stop-color="rgb(34,20,63)"/>
       </linearGradient></defs>
       <rect width="${w}" height="${h}" fill="url(#g)"/>
     </svg>`,
  )

async function og() {
  const ANCHO = 1200
  const ALTO = 630
  const sello = await sharp(p('public/brand/og-portada.webp'))
    .resize({ height: ALTO - 30, fit: 'inside' })
    .toBuffer()
  await sharp(degradado(ANCHO, ALTO))
    .composite([{ input: sello, gravity: 'centre' }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(p('public/brand/og-astravia.jpg'))
}

async function isotipo() {
  const T = 512
  const casco = await sharp(p('public/brand/favicon.png'))
    .resize({ width: 360, height: 360, fit: 'inside' })
    .toBuffer()
  await sharp(degradado(T, T))
    .composite([{ input: casco, gravity: 'centre' }])
    .png()
    .toFile(p('public/brand/isotipo-astravia.png'))
}

// Favicon: Google lo exige cuadrado y en múltiplos de 48 px, y lo muestra sobre
// fondo claro. Por eso no sirve el casco blanco transparente (se pierde) ni el
// isotipo completo (a 48 px el texto del sello no se lee): va solo el casco,
// grande, sobre un círculo con el degradado de marca.
async function favicons() {
  const casco = await sharp(p('public/brand/favicon.png'))
    .extract({ left: 900, top: 1100, width: 1870, height: 2170 }) // solo el casco, sin el sello
    .toBuffer()

  const hacer = async (T) => {
    // Archivo cuadrado (lo exige Google) con el fondo redondo: las esquinas quedan transparentes.
    const marca = await sharp(casco)
      .resize({ width: Math.round(T * 0.7), height: Math.round(T * 0.7), fit: 'inside' })
      .toBuffer()
    const circulo = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${T}" height="${T}"><circle cx="${T / 2}" cy="${T / 2}" r="${T / 2}"/></svg>`,
    )
    return sharp(degradado(T, T))
      .composite([
        { input: marca, gravity: 'centre' },
        { input: circulo, blend: 'dest-in' },
      ])
      .png({ compressionLevel: 9 })
      .toBuffer()
  }

  const [t16, t32, t48, t192] = await Promise.all([16, 32, 48, 192].map(hacer))
  await fs.writeFile(p('public/brand/favicon-48.png'), t48)
  await fs.writeFile(p('public/brand/favicon-192.png'), t192)

  // .ico con PNG incrustados (16, 32 y 48): lo piden los navegadores en /favicon.ico.
  const imgs = [
    [16, t16],
    [32, t32],
    [48, t48],
  ]
  const cab = Buffer.alloc(6)
  cab.writeUInt16LE(1, 2)
  cab.writeUInt16LE(imgs.length, 4)
  let offset = 6 + imgs.length * 16
  const entradas = imgs.map(([t, buf]) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(t, 0)
    e.writeUInt8(t, 1)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(buf.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += buf.length
    return e
  })
  await fs.writeFile(p('public/favicon.ico'), Buffer.concat([cab, ...entradas, ...imgs.map(([, b]) => b)]))
}

await Promise.all([og(), isotipo(), favicons()])
console.log('og-astravia.jpg, isotipo-astravia.png y favicons listos')
