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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), apiDev(env)],
    server: {
      port: 5173,
      open: true,
    },
  }
})
