import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), apiDev(env), cssNoBloqueante()],
    server: {
      port: 5173,
      open: true,
    },
  }
})
