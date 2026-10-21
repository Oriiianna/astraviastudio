// Cloudflare Web Analytics: mide visitas, páginas, origen y países sin cookies
// ni datos personales, así que no necesita banner de consentimiento.
// El token sale del panel de Cloudflare (Web Analytics → Add a site) y se
// define en VITE_CF_BEACON_TOKEN. Sin token no se carga nada.

const TOKEN = import.meta.env.VITE_CF_BEACON_TOKEN

export function loadAnalytics() {
  if (!TOKEN || document.getElementById('cf-beacon')) return

  const script = document.createElement('script')
  script.id = 'cf-beacon'
  script.defer = true
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  script.dataset.cfBeacon = JSON.stringify({ token: TOKEN })
  document.head.appendChild(script)
}
