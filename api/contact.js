// Endpoint del formulario de contacto.
//
// Recibe el POST del front y manda el aviso por la API HTTP de Mailtrap.
// Corre como función serverless en Vercel y, en desarrollo, lo monta el plugin
// de vite.config.js sobre el mismo servidor de Vite. Por eso usa sólo la API
// de Node (req/res crudos) y nada específico de Vercel.

const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const SEND_URL = 'https://send.api.mailtrap.io/api/send'
const sandboxUrl = (inboxId) => `https://sandbox.api.mailtrap.io/api/send/${inboxId}`

// Tope por campo: evita que alguien nos mande un mail de 10 MB.
const LIMITES = { nombre: 120, telefono: 40, email: 200, mensaje: 4000, servicio: 40 }
// Sin espacios ni caracteres que no tienen sentido en una dirección real
// (< > " , ; : \ ( ) [ ]): el valor igual se escapa, pero mejor no aceptarlo.
const EMAIL_RE = /^[^\s@<>",;:\\()[\]]+@[^\s@<>",;:\\()[\]]+\.[^\s@<>",;:\\()[\]]{2,}$/
// Mismos values que manda el dropdown de Contact.jsx (SERVICIOS, líneas 11-16);
// el texto es el que se muestra en el aviso a Astravia.
const SERVICIOS_LABEL = {
  landing: 'Landing Page',
  corporativo: 'Corporativa',
  ecommerce: 'E-Commerce',
  otro: 'Otro',
}
const SERVICIOS_VALIDOS = Object.keys(SERVICIOS_LABEL)
const IDIOMAS_LABEL = { es: 'Español', en: 'English' }
const COLOR_MARCA = '#7c3aed'
// Los correos no pueden usar rutas relativas: el isotipo se sirve desde el sitio.
const SITIO_URL = 'https://astraviastudio.com.ar'
const LOGO_URL = `${SITIO_URL}/brand/isotipo-astravia.png`
const WHATSAPP_URL = 'https://wa.me/5491168717233'
const WHATSAPP_TEXTO = '+54 11 6871-7233'
const EMAIL_CONTACTO = 'studioastravia@gmail.com'

// Rate limit en memoria: vive por instancia serverless, no distribuido entre
// instancias — igual frena los floods típicos de una misma IP/bot, que es el
// caso común (no hay Redis/KV en el proyecto para uno distribuido de verdad).
const intentos = new Map()
const VENTANA_MS = 15 * 60 * 1000
const MAX_INTENTOS = 5
// La confirmación sale hacia una dirección que escribe quien llena el formulario:
// se limita por destinatario para que no sirva de relé contra un tercero.
const VENTANA_EMAIL_MS = 60 * 60 * 1000
const MAX_CONFIRMACIONES = 2

// Si el navegador manda Origin, tiene que ser el mismo host que sirve la API
// (sirve en producción, previews y localhost). Sin Origin (curl, scripts) pasa:
// es una barrera best-effort, no reemplaza a un CAPTCHA.
function origenValido(req) {
  const origen = req.headers.origin
  if (!origen) return true
  try {
    return new URL(origen).host === req.headers.host
  } catch {
    return false
  }
}

function obtenerIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

function excedeLimite(clave, max = MAX_INTENTOS, ventana = VENTANA_MS) {
  const ahora = Date.now()
  const previos = (intentos.get(clave) || []).filter((t) => ahora - t < ventana)
  previos.push(ahora)
  intentos.set(clave, previos)
  if (intentos.size > 5000) intentos.clear() // resguardo contra crecimiento sin límite
  return previos.length > max
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

  if (!origenValido(req)) {
    return json(res, 403, { ok: false, error: 'Origen no permitido.' })
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

  if (excedeLimite(obtenerIp(req))) {
    return json(res, 429, { ok: false, error: 'Demasiados intentos. Prueba de nuevo en unos minutos.' })
  }

  let body
  try {
    body = await leerJson(req)
  } catch {
    return json(res, 400, { ok: false, error: 'Solicitud inválida.' })
  }
  // JSON válido pero que no es un objeto (null, [], 5...): no hay campos que leer.
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
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

  // Turnstile: el token lo genera el navegador y solo Cloudflare puede validarlo.
  const verificacion = await verificarTurnstile(body.turnstileToken, obtenerIp(req))
  if (verificacion === 'sin_config') {
    return json(res, 500, { ok: false, error: 'El formulario no está configurado.' })
  }
  if (verificacion !== 'ok') {
    return json(res, 400, { ok: false, code: 'captcha', error: 'No pudimos verificar que eres una persona.' })
  }

  const inboxId = process.env.MAILTRAP_INBOX_ID
  const url = inboxId ? sandboxUrl(inboxId) : SEND_URL

  const nombreVisible = nombreDisplay(nombre)
  const datos = { nombre: nombreVisible, telefono, email, mensaje, servicio, lang, recibida: fechaRecepcion() }

  const payload = {
    from: {
      email: fromEmail,
      name: 'Formulario Astravia',
    },
    to: [{ email: toEmail }],
    // Respondemos desde el cliente de mail directo a quien consultó.
    reply_to: { email, name: nombreVisible },
    subject: `Nueva consulta de ${nombreVisible} — ${SERVICIOS_LABEL[servicio]}`,
    text: textoPlano(datos),
    html: html(datos),
    category: 'contacto-web',
  }

  try {
    const resultado = await enviarMailtrap(url, token, payload, 10000)
    if (!resultado.ok) {
      logError('mailtrap_rechazo', { status: resultado.status, detalle: resultado.detalle })
      return json(res, 502, { ok: false, error: 'No pudimos enviar el mensaje.' })
    }
  } catch (err) {
    logError('mailtrap_excepcion', { mensaje: err.message })
    return json(res, 502, { ok: false, error: 'No pudimos enviar el mensaje.' })
  }

  // La consulta ya llegó a Astravia: la confirmación al cliente es best-effort.
  // Se espera antes de responder porque Vercel puede cortar la función al responder.
  // Si ese destinatario ya recibió varias, se omite (el aviso a Astravia ya salió).
  if (!excedeLimite(`email:${email.toLowerCase()}`, MAX_CONFIRMACIONES, VENTANA_EMAIL_MS)) {
    await enviarConfirmacion({ url, token, fromEmail, toEmail, email, nombre: nombreVisible, lang, servicio })
  }

  return json(res, 200, { ok: true })
}

// Devuelve 'ok', 'invalido' o 'sin_config'. Si Cloudflare no responde se rechaza
// (falla cerrado): es preferible pedir que reintenten a dejar pasar bots.
// Sin TURNSTILE_SECRET_KEY: en producción es un error de configuración; fuera de
// producción (local, previews) se omite para poder probar sin la clave.
async function verificarTurnstile(token, ip) {
  const secreto = process.env.TURNSTILE_SECRET_KEY
  if (!secreto) {
    if (process.env.VERCEL_ENV === 'production') {
      logError('config_faltante', { variable: 'TURNSTILE_SECRET_KEY' })
      return 'sin_config'
    }
    return 'ok'
  }
  if (typeof token !== 'string' || !token || token.length > 2048) return 'invalido'

  try {
    const respuesta = await fetch(TURNSTILE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secreto, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    })
    const datos = await respuesta.json().catch(() => ({}))
    if (!datos.success) logError('turnstile_rechazo', { codigos: datos['error-codes'] })
    return datos.success ? 'ok' : 'invalido'
  } catch (err) {
    logError('turnstile_excepcion', { mensaje: err.message })
    return 'invalido'
  }
}

async function enviarMailtrap(url, token, payload, timeoutMs) {
  const respuesta = await fetch(url, {
    method: 'POST',
    headers: {
      'Api-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => '')
    return { ok: false, status: respuesta.status, detalle }
  }
  return { ok: true }
}

// La confirmación no repite el mensaje del cliente: es texto libre que acaba en
// la bandeja de quien puso esa dirección, y no tiene que poder usarse para
// mandarle contenido arbitrario con nuestra marca.
async function enviarConfirmacion({ url, token, fromEmail, toEmail, email, nombre, lang, servicio }) {
  const payload = {
    from: { email: fromEmail, name: 'Astravia' },
    to: [{ email }],
    // Si el cliente responde la confirmación, le llega a Astravia.
    reply_to: { email: toEmail },
    subject: lang === 'en' ? 'We received your message' : 'Recibimos tu consulta',
    text: textoConfirmacion(nombre, lang, servicio),
    html: htmlConfirmacion(nombre, lang, servicio),
    category: 'confirmacion-cliente',
  }

  try {
    const resultado = await enviarMailtrap(url, token, payload, 5000)
    if (!resultado.ok) {
      logError('confirmacion_fallo', { status: resultado.status, detalle: resultado.detalle })
    }
  } catch (err) {
    logError('confirmacion_fallo', { mensaje: err.message })
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

// Sólo hay es/en en el sitio; cualquier otro valor cae a español.
const SERVICIOS_LABEL_EN = {
  landing: 'Landing Page',
  corporativo: 'Corporate website',
  ecommerce: 'E-Commerce',
  otro: 'Other',
}

function textosConfirmacion(nombre, lang) {
  if (lang === 'en') {
    return {
      htmlLang: 'en',
      titulo: 'We received your message',
      saludo: `Hi ${nombre},`,
      cuerpo: 'Thanks for getting in touch. We received your message and will get back to you within 48 business hours.',
      resumen: 'Your inquiry',
      servicio: 'Service',
      urgente: 'Need an answer sooner? Message us on WhatsApp:',
      cierre: 'The Astravia Studio team',
      servicios: SERVICIOS_LABEL_EN,
    }
  }
  return {
    htmlLang: 'es',
    titulo: 'Recibimos tu consulta',
    saludo: `Hola ${nombre},`,
    cuerpo: 'Gracias por escribirnos. Recibimos tu consulta y nos comunicaremos contigo en un plazo no mayor a 48 horas hábiles.',
    resumen: 'Tu consulta',
    servicio: 'Servicio',
    urgente: '¿Es urgente? Escríbenos por WhatsApp:',
    cierre: 'El equipo de Astravia Studio',
    servicios: SERVICIOS_LABEL,
  }
}

function textoConfirmacion(nombre, lang, servicio) {
  const t = textosConfirmacion(nombre, lang)
  return [
    t.saludo,
    '',
    t.cuerpo,
    '',
    `${t.resumen.toUpperCase()}`,
    `${t.servicio}: ${t.servicios[servicio] || '—'}`,
    '',
    `${t.urgente} ${WHATSAPP_TEXTO} (${WHATSAPP_URL})`,
    '',
    t.cierre,
    SITIO_URL,
  ].join('\n')
}

// Nombres con capitalización de nombre propio sólo si vinieron todo en minúscula
// o todo en mayúscula; si ya traen mezcla se respetan. También aplana espacios y
// saltos de línea porque el nombre va en el asunto.
function nombreDisplay(nombre) {
  const limpio = nombre.replace(/\s+/g, ' ').trim()
  if (limpio !== limpio.toLowerCase() && limpio !== limpio.toUpperCase()) return limpio
  return limpio
    .toLowerCase()
    .replace(/(^|[\s\-'’])(\p{L})/gu, (_, separador, letra) => separador + letra.toUpperCase())
}

function fechaRecepcion() {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date())
}

// wa.me exige número internacional sin '+': sólo armamos el link si el cliente
// lo cargó con '+', para no mandar a un chat equivocado.
function enlaceWhatsapp(telefono) {
  if (!telefono.startsWith('+')) return ''
  const digitos = telefono.replace(/\D/g, '')
  return digitos.length >= 7 ? `https://wa.me/${digitos}` : ''
}

function enlaceTel(telefono) {
  const marcable = telefono.replace(/[^\d+]/g, '')
  return marcable.replace(/\D/g, '').length >= 3 ? `tel:${marcable}` : ''
}

function layoutCorreo(idioma, contenido) {
  return `<!doctype html>
<html lang="${idioma}">
  <body style="margin:0;padding:24px 12px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f1f2b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;border:1px solid #e4e4ea;border-radius:8px;">
      <tr>
        <td style="padding:18px 28px;background:#0b091e;border-top:3px solid ${COLOR_MARCA};border-radius:8px 8px 0 0;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:14px;vertical-align:middle;">
                <img src="${LOGO_URL}" width="44" height="44" alt="Astravia Studio" style="display:block;border:0;border-radius:10px;">
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;font-size:14px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#efecff;">Astravia Studio</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
${contenido}
    </table>
  </body>
</html>`
}

function htmlConfirmacion(nombre, lang, servicio) {
  const t = textosConfirmacion(nombre, lang)
  const enlace = (href, texto) =>
    `<a href="${escapar(href)}" style="color:${COLOR_MARCA};text-decoration:none;font-weight:600;">${escapar(texto)}</a>`
  return layoutCorreo(
    t.htmlLang,
    `      <tr>
        <td style="padding:28px 28px 8px;">
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#1f1f2b;">${t.titulo}</h1>
          <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#1f1f2b;">${escapar(t.saludo)}</p>
          <p style="margin:0;font-size:15px;line-height:1.6;color:#1f1f2b;">${t.cuerpo}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px 0;">
          <div style="border:1px solid #e4e4ea;border-radius:6px;padding:16px;background:#faf9ff;">
            <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${COLOR_MARCA};">${t.resumen}</p>
            <p style="margin:0;font-size:14px;line-height:1.5;color:#1f1f2b;"><span style="color:#6b6b7b;">${t.servicio}:</span> ${escapar(t.servicios[servicio] || '—')}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 0;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#1f1f2b;">${t.urgente} ${enlace(WHATSAPP_URL, WHATSAPP_TEXTO)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 24px;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#6b6b7b;">${t.cierre}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:14px 28px;border-top:1px solid #eeeef2;font-size:12px;line-height:1.6;color:#6b6b7b;">
          ${enlace(SITIO_URL, 'astraviastudio.com.ar')} &nbsp;·&nbsp; ${enlace(`mailto:${EMAIL_CONTACTO}`, EMAIL_CONTACTO)}
        </td>
      </tr>`,
  )
}

function textoPlano({ nombre, telefono, email, mensaje, servicio, lang, recibida }) {
  const whatsapp = enlaceWhatsapp(telefono)
  return [
    'NUEVA CONSULTA — Astravia Studio',
    `Recibida: ${recibida}`,
    '',
    `Nombre:   ${nombre}`,
    `Email:    ${email}`,
    `Teléfono: ${telefono || '—'}`,
    `Servicio: ${SERVICIOS_LABEL[servicio] || '—'}`,
    `Idioma:   ${IDIOMAS_LABEL[lang] || '—'}`,
    '',
    'Mensaje:',
    mensaje,
    ...(whatsapp ? ['', `WhatsApp: ${whatsapp}`] : []),
  ].join('\n')
}

function filaDato(etiqueta, valorHtml) {
  return `            <tr>
              <td style="padding:10px 12px 10px 0;border-bottom:1px solid #eeeef2;width:96px;font-size:13px;color:#6b6b7b;vertical-align:top;">${etiqueta}</td>
              <td style="padding:10px 0;border-bottom:1px solid #eeeef2;font-size:15px;color:#1f1f2b;vertical-align:top;">${valorHtml}</td>
            </tr>`
}

function html({ nombre, telefono, email, mensaje, servicio, lang, recibida }) {
  const enlace = (href, texto) =>
    `<a href="${escapar(href)}" style="color:${COLOR_MARCA};text-decoration:none;">${escapar(texto)}</a>`
  const whatsapp = enlaceWhatsapp(telefono)
  const tel = telefono ? enlaceTel(telefono) : ''
  const telefonoHtml = !telefono ? '—' : tel ? enlace(tel, telefono) : escapar(telefono)
  const asunto = lang === 'en' ? 'Your inquiry with Astravia' : 'Tu consulta en Astravia'
  const responder = `mailto:${email}?subject=${encodeURIComponent(asunto)}`
  const boton = 'display:inline-block;padding:11px 20px;font-size:14px;font-weight:600;text-decoration:none;border-radius:6px;'

  return layoutCorreo(
    'es',
    `      <tr>
        <td style="padding:12px 28px 4px;">
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#1f1f2b;">Nueva consulta</h1>
          <p style="margin:6px 0 0;font-size:14px;color:#6b6b7b;">${escapar(recibida)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 28px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${filaDato('Nombre', escapar(nombre))}
${filaDato('Email', enlace(`mailto:${email}`, email))}
${filaDato('Teléfono', telefonoHtml)}
${filaDato('Servicio', escapar(SERVICIOS_LABEL[servicio] || '—'))}
${filaDato('Idioma', escapar(IDIOMAS_LABEL[lang] || '—'))}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px 0;">
          <p style="margin:0 0 8px;font-size:13px;color:#6b6b7b;">Mensaje</p>
          <div style="white-space:pre-wrap;font-size:15px;line-height:1.6;color:#1f1f2b;border:1px solid #e4e4ea;border-radius:6px;padding:16px;">${escapar(mensaje)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px 28px;">
          <a href="${escapar(responder)}" style="${boton}background:${COLOR_MARCA};color:#ffffff;margin-right:8px;">Responder a ${escapar(nombre.split(' ')[0])}</a>${
            whatsapp
              ? `<a href="${escapar(whatsapp)}" style="${boton}border:1px solid ${COLOR_MARCA};color:${COLOR_MARCA};">WhatsApp</a>`
              : ''
          }
        </td>
      </tr>`,
  )
}
