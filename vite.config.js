import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import {
  IDIOMAS,
  LOCALE_OG,
  META,
  PAGINAS,
  alternativas,
  urlDe,
} from './src/seo.js'

// En producción las funciones de /api las sirve Vercel. En desarrollo Vite no
// sabe nada de esa carpeta, así que la montamos a mano sobre su servidor: mismo
// origen, mismo handler, sin necesidad de `vercel dev`.
function apiDev(env) {
  return {
    name: 'astravia-api-dev',
    apply: 'serve',
    configureServer(server) {
      // Las variables sin prefijo VITE_ no llegan al cliente; acá estamos en
      // Node, así que el token nunca sale del servidor.
      Object.assign(process.env, env)

      server.middlewares.use('/api/contact', async (req, res, next) => {
        try {
          const mod = await server.ssrLoadModule('/api/contact.js')
          await mod.default(req, res)
        } catch (err) {
          next(err)
        }
      })
    },
  }
}

// El CSS del bundle es lo unico que sigue bloqueando el primer pintado: la
// precarga ya pinta con su <style> inline, asi que esperar 37 KB de hoja antes
// de mostrar nada no compra nada. Se baja con media="print" (no bloquea) y se
// activa en onload. La bandera __cssLista deja que la precarga lo espere, para
// que el telon nunca se levante sobre una pagina sin estilos.
// Solo toca los .css emitidos por Vite: la hoja de Google Fonts no termina en
// ".css", asi que no entra en el reemplazo.
function cssNoBloqueante() {
  return {
    name: 'astravia-css-no-bloqueante',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet"([^>]*?)href="([^"]+\.css)"([^>]*)>/g,
        (_m, antes, href, despues) =>
          `<link rel="preload" as="style"${antes}href="${href}"${despues}>` +
          `<link rel="stylesheet"${antes}href="${href}"${despues} media="print" ` +
          `onload="this.media='all';window.__cssLista=1">` +
          `<noscript><link rel="stylesheet"${antes}href="${href}"${despues}></noscript>`
      )
    },
  }
}

const escapar = (txt) =>
  txt.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// Cambia el atributo content="" de un <meta> (el formato de index.html lo
// parte en varias lineas, de ahi los \s+).
function cambiarMeta(html, atributo, nombre, valor) {
  const re = new RegExp(`(<meta\\s+${atributo}="${nombre}"\\s+content=")[^"]*(")`)
  return html.replace(re, `$1${escapar(valor)}$2`)
}

// El cuerpo es la SPA de siempre, pero cada ruta sale con su propio <head>
// (titulo, descripcion, canonical, hreflang, Open Graph, <html lang>), asi que
// los rastreadores y las vistas previas de redes lo leen sin ejecutar JS.
// Los textos viven en src/seo.js, que el cliente tambien usa al navegar.
// Tambien escribe el sitemap, con los pares hreflang entre idiomas.
function seoPorRuta() {
  let outDir = 'dist'
  return {
    name: 'astravia-seo-por-ruta',
    apply: 'build',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir)
    },
    closeBundle() {
      const base = readFileSync(join(outDir, 'index.html'), 'utf-8')

      for (const lng of IDIOMAS) {
        for (const pagina of Object.keys(PAGINAS)) {
          const { title, description } = META[lng][pagina]
          const otro = IDIOMAS.find((l) => l !== lng)
          const enlaces = alternativas(pagina)
            .map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
            .join('\n    ')

          let html = base
            .replace(/<html lang="[^"]*"/, `<html lang="${lng}"`)
            .replace(/<title>[^<]*<\/title>/, `<title>${escapar(title)}</title>`)
            .replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>\s*/g, '')
            .replace(
              /<link rel="canonical" href="[^"]*" \/>/,
              `<link rel="canonical" href="${urlDe(lng, pagina)}" />\n    ${enlaces}`
            )
          html = cambiarMeta(html, 'property', 'og:locale', LOCALE_OG[lng])
          html = cambiarMeta(html, 'property', 'og:locale:alternate', LOCALE_OG[otro])
          html = cambiarMeta(html, 'name', 'description', description)
          html = cambiarMeta(html, 'property', 'og:title', title)
          html = cambiarMeta(html, 'property', 'og:description', description)
          html = cambiarMeta(html, 'property', 'og:url', urlDe(lng, pagina))
          html = cambiarMeta(html, 'property', 'og:image:alt', title)
          html = cambiarMeta(html, 'name', 'twitter:title', title)
          html = cambiarMeta(html, 'name', 'twitter:description', description)

          const destino = join(outDir, lng, PAGINAS[pagina].ruta, 'index.html')
          mkdirSync(dirname(destino), { recursive: true })
          writeFileSync(destino, html)
        }
      }

      const hoy = new Date().toISOString().slice(0, 10)
      const urls = IDIOMAS.flatMap((lng) =>
        Object.keys(PAGINAS).map((pagina) => {
          const pares = alternativas(pagina)
            .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
            .join('\n')
          return `  <url>\n    <loc>${urlDe(lng, pagina)}</loc>\n    <lastmod>${hoy}</lastmod>\n${pares}\n  </url>`
        })
      )
      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), apiDev(env), cssNoBloqueante(), seoPorRuta()],
    server: {
      port: 5173,
      open: true,
    },
  }
})
