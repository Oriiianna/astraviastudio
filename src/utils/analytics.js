// Google Analytics no se carga hasta que hay consentimiento explícito
// (ver CookieConsent.jsx). El id vivía hardcodeado en index.html; ahora
// vive acá, junto con la lógica que decide si corresponde cargarlo.

const GA_ID = 'G-3MC7WMBBX0'
const CONSENT_KEY = 'cookie_consent'

export function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {
    // Storage bloqueado (modo privado, etc.): no hay nada más que hacer,
    // el banner simplemente va a volver a aparecer en la próxima visita.
  }
}

export function loadAnalytics() {
  if (document.getElementById('ga-script')) return

  const script = document.createElement('script')
  script.id = 'ga-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
}
