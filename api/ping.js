// Ping diario a la base de datos (Vercel Cron, ver "crons" en vercel.json).
//
// El plan gratuito de Supabase pausa el proyecto tras una semana con poca
// actividad EN LA BASE. Este endpoint hace una consulta real (un select sobre
// `proyectos`), no solo una petición HTTP a la raíz, para que cuente como
// actividad. Responde 500 si la consulta falla, así el fallo queda a la vista en
// los logs de Vercel (Deployments → Functions / Cron Jobs).

const URL_BASE = process.env.VITE_SUPABASE_URL || 'https://xkambomhqdelfrsaalzn.supabase.co'
const CLAVE =
  process.env.VITE_SUPABASE_KEY || 'sb_publishable_dnyiAxwMgaBkRy-pHQFtIQ_r7mCjAsp'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  try {
    const r = await fetch(`${URL_BASE}/rest/v1/proyectos?select=slug&limit=1`, {
      headers: { apikey: CLAVE },
    })
    if (!r.ok) throw new Error(`Supabase respondió ${r.status}`)
    const filas = await r.json()
    console.log(`[ping] ok · ${filas.length} fila(s) · ${new Date().toISOString()}`)
    res.statusCode = 200
    res.end(JSON.stringify({ ok: true, filas: filas.length }))
  } catch (err) {
    console.error('[ping] falló:', err.message)
    res.statusCode = 500
    res.end(JSON.stringify({ ok: false, error: err.message }))
  }
}
