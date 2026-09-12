// Endpoint del formulario de contacto.
//
// Recibe el POST del front y manda el aviso por la API HTTP de Mailtrap.
// Corre como función serverless en Vercel y, en desarrollo, lo monta el plugin
// de vite.config.js sobre el mismo servidor de Vite. Por eso usa sólo la API
// de Node (req/res crudos) y nada específico de Vercel.

const SEND_URL = 'https://send.api.mailtrap.io/api/send'
const sandboxUrl = (inboxId) => `https://sandbox.api.mailtrap.io/api/send/${inboxId}`

// Tope por campo: evita que alguien nos mande un mail de 10 MB.
const LIMITES = { nombre: 120, telefono: 40, email: 200, mensaje: 4000, servicio: 40 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// Mismos values que manda el dropdown de Contact.jsx (SERVICIOS, líneas 11-16).
const SERVICIOS_VALIDOS = ['landing', 'corporativo', 'ecommerce', 'otro']

// Rate limit en memoria: vive por instancia serverless, no distribuido entre
// instancias — igual frena los floods típicos de una misma IP/bot, que es el
// caso común (no hay Redis/KV en el proyecto para uno distribuido de verdad).
const intentos = new Map()
const VENTANA_MS = 15 * 60 * 1000
const MAX_INTENTOS = 5

function obtenerIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

function excedeLimite(ip) {
  const ahora = Date.now()
  const previos = (intentos.get(ip) || []).filter((t) => ahora - t < VENTANA_MS)
  previos.push(ahora)
  intentos.set(ip, previos)
  if (intentos.size > 5000) intentos.clear() // resguardo contra crecimiento sin límite
  return previos.length > MAX_INTENTOS
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { ok: false, error: 'Método no permitido.' })
  }

  const contentType = req.headers['content-type'] || ''
  if (!contentType.includes('application/json')) {
    return json(res, 415, { ok: false, error: 'Content-Type inválido.' })
  }

  if (excedeLimite(obtenerIp(req))) {
    return json(res, 429, { ok: false, error: 'Demasiados intentos. Probá de nuevo en unos minutos.' })
  }

  const token = process.env.MAILTRAP_API_TOKEN
  if (!token) {
    logError('config_faltante', { variable: 'MAILTRAP_API_TOKEN' })
    return json(res, 500, { ok: false, error: 'El formulario no está configurado.' })
  }

  const fromEmail = process.env.MAILTRAP_FROM_EMAIL
  const toEmail = process.env.MAILTRAP_TO_EMAIL
  if (!fromEmail || !toEmail) {
    logError('config_faltante', { variable: !fromEmail ? 'MAILTRAP_FROM_EMAIL' : 'MAILTRAP_TO_EMAIL' })
    return json(res, 500, { ok: false, error: 'El formulario no está configurado.' })
  }

  let body
  try {
    body = await leerJson(req)
  } catch {
    return json(res, 400, { ok: false, error: 'Solicitud inválida.' })
  }

  // Honeypot: campo oculto que sólo completan los bots. Devolvemos 200 para
  // que el bot crea que funcionó y no reintente.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return json(res, 200, { ok: true })
  }

  const nombre = limpiar(body.nombre, LIMITES.nombre)
  const telefono = limpiar(body.telefono, LIMITES.telefono)
  const email = limpiar(body.email, LIMITES.email)
  const mensaje = limpiar(body.mensaje, LIMITES.mensaje)
  const servicio = limpiar(body.servicio, LIMITES.servicio)
  const lang = typeof body.lang === 'string' ? body.lang.slice(0, 2) : ''

  if (!nombre || !email || !mensaje || !SERVICIOS_VALIDOS.includes(servicio)) {
    return json(res, 400, { ok: false, error: 'Faltan campos obligatorios.' })
  }
  if (!EMAIL_RE.test(email)) {
    return json(res, 400, { ok: false, error: 'El email no parece válido.' })
  }

  const inboxId = process.env.MAILTRAP_INBOX_ID
  const url = inboxId ? sandboxUrl(inboxId) : SEND_URL

  const payload = {
    from: {
      email: fromEmail,
      name: 'Formulario Astravia',
    },
    to: [{ email: toEmail }],
    // Respondemos desde el cliente de mail directo a quien consultó.
    reply_to: { email, name: nombre },
    subject: `Nueva consulta de ${nombre}`,
    text: textoPlano({ nombre, telefono, email, mensaje, servicio, lang }),
    html: html({ nombre, telefono, email, mensaje, servicio, lang }),
    category: 'contacto-web',
  }

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Api-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })

    if (!respuesta.ok) {
      const detalle = await respuesta.text().catch(() => '')
      logError('mailtrap_rechazo', { status: respuesta.status, detalle })
      return json(res, 502, { ok: false, error: 'No pudimos enviar el mensaje.' })
    }

    return json(res, 200, { ok: true })
  } catch (err) {
    logError('mailtrap_excepcion', { mensaje: err.message })
    return json(res, 502, { ok: false, error: 'No pudimos enviar el mensaje.' })
  }
}

function json(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function logError(evento, detalle) {
  console.error(JSON.stringify({ nivel: 'error', evento, ...detalle, ts: new Date().toISOString() }))
}

// En Vercel el body ya viene parseado; en el middleware de Vite llega como
// stream. Cubrimos los dos casos.
async function leerJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body)

  let crudo = ''
  for await (const chunk of req) {
    crudo += chunk
    if (crudo.length > 100_000) throw new Error('body demasiado grande')
  }
  return crudo ? JSON.parse(crudo) : {}
}

function limpiar(valor, max) {
  if (typeof valor !== 'string') return ''
  return valor.trim().slice(0, max)
}

function escapar(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function textoPlano({ nombre, telefono, email, mensaje, servicio, lang }) {
  return [
    `Nombre:   ${nombre}`,
    `Email:    ${email}`,
    `Teléfono: ${telefono || '—'}`,
    `Servicio: ${servicio || '—'}`,
    `Idioma:   ${lang || '—'}`,
    '',
    'Mensaje:',
    mensaje,
  ].join('\n')
}

function html({ nombre, telefono, email, mensaje, servicio, lang }) {
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;background:#0b0b16;padding:32px 16px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#13132a;border:1px solid #2a2a4d;border-radius:16px;">
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8b8bc4;">Astravia</p>
          <h1 style="margin:8px 0 0;font-size:20px;color:#f2f2ff;">Nueva consulta del sitio</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#d7d7f0;">
            <tr><td style="padding:6px 0;color:#8b8bc4;width:90px;">Nombre</td><td style="padding:6px 0;">${escapar(nombre)}</td></tr>
            <tr><td style="padding:6px 0;color:#8b8bc4;">Email</td><td style="padding:6px 0;"><a href="mailto:${escapar(email)}" style="color:#9db9ff;">${escapar(email)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#8b8bc4;">Teléfono</td><td style="padding:6px 0;">${escapar(telefono) || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#8b8bc4;">Servicio</td><td style="padding:6px 0;">${escapar(servicio) || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#8b8bc4;">Idioma</td><td style="padding:6px 0;">${escapar(lang) || '—'}</td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px 32px;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8b8bc4;">Mensaje</p>
          <div style="white-space:pre-wrap;font-size:15px;line-height:1.6;color:#f2f2ff;background:#0f0f22;border:1px solid #2a2a4d;border-radius:12px;padding:16px;">${escapar(mensaje)}</div>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
