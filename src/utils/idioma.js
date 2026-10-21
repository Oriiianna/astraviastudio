// El idioma vive en la URL: /es/... y /en/... Estos helpers lo leen y lo reescriben.

const PREFIJO = /^\/(es|en)(?=\/|$)/

export function idiomaDeRuta(pathname) {
  const m = pathname.match(PREFIJO)
  return m ? m[1] : null
}

// '/es' -> '/', '/en/privacy' -> '/privacy', '/otra' -> '/otra'
export function rutaSinIdioma(pathname) {
  return pathname.replace(PREFIJO, '') || '/'
}

// ('en', '/privacy') -> '/en/privacy'; ('es', '/') -> '/es'
export function rutaConIdioma(lng, ruta = '/') {
  return `/${lng}${ruta === '/' ? '' : ruta}`
}

export function idiomaActual(i18n) {
  return i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'es'
}

// Para "/" y rutas sin prefijo: el detector de i18next puede no haber resuelto
// todavía en el primer render, así que se cae al idioma del navegador.
export function idiomaPreferido(i18n) {
  let crudo = i18n.resolvedLanguage || i18n.language
  if (!crudo) {
    try {
      crudo = localStorage.getItem('i18nextLng')
    } catch {
      /* sin storage */
    }
  }
  crudo = crudo || navigator.language || 'es'
  return crudo.startsWith('en') ? 'en' : 'es'
}
