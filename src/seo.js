// Metadatos SEO por idioma y página. Lo lee el plugin de build (vite.config.js)
// para escribir el <head> de cada ruta, y el cliente (aplicarMeta) para
// mantenerlo al navegar. Debe ser JS puro: se importa también desde Node.

export const SITIO = 'https://astraviastudio.com.ar'
export const IDIOMAS = ['es', 'en']

export const LOCALE_OG = { es: 'es_AR', en: 'en_US' }

export const PAGINAS = {
  home: { ruta: '' },
  privacy: { ruta: '/privacy' },
  terms: { ruta: '/terms' },
}

export const META = {
  es: {
    home: {
      title: 'Astravia Studio — Sitios y aplicaciones web a medida',
      description:
        'Equipo de diseño y desarrollo web. Creamos sitios y aplicaciones a medida: rápidos, pensados para convertir visitas en consultas y listos para crecer.',
    },
    privacy: {
      title: 'Política de privacidad — Astravia Studio',
      description:
        'Qué datos recoge Astravia Studio, para qué los usa y cómo puedes pedir que los borremos. Sin cookies de seguimiento.',
    },
    terms: {
      title: 'Términos y condiciones — Astravia Studio',
      description:
        'Condiciones de uso del sitio y de los servicios de diseño y desarrollo web de Astravia Studio.',
    },
  },
  en: {
    home: {
      title: 'Astravia Studio — Custom websites and web apps',
      description:
        'Web design and development team. We build custom websites and apps: fast, designed to turn visits into inquiries and ready to grow.',
    },
    privacy: {
      title: 'Privacy policy — Astravia Studio',
      description:
        'What data Astravia Studio collects, what it is used for and how you can ask us to delete it. No tracking cookies.',
    },
    terms: {
      title: 'Terms and conditions — Astravia Studio',
      description:
        'Terms of use for the Astravia Studio website and its web design and development services.',
    },
  },
}

export function urlDe(lng, pagina) {
  return `${SITIO}/${lng}${PAGINAS[pagina].ruta}`
}

// x-default: la home apunta a "/" (que redirige según idioma); el resto, al español.
export function alternativas(pagina) {
  return [
    ...IDIOMAS.map((lng) => ({ hreflang: lng, href: urlDe(lng, pagina) })),
    {
      hreflang: 'x-default',
      href: pagina === 'home' ? `${SITIO}/` : urlDe('es', pagina),
    },
  ]
}

export function paginaDeRuta(rutaSinIdioma) {
  const hallada = Object.entries(PAGINAS).find(([, p]) => (p.ruta || '/') === rutaSinIdioma)
  return hallada ? hallada[0] : 'home'
}

function ponerMeta(selector, atributo, valor) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(atributo, valor)
}

// Cliente: deja el <head> igual a lo que el build escribió para esa ruta.
export function aplicarMeta(lng, pagina) {
  const { title, description } = META[lng][pagina]
  const url = urlDe(lng, pagina)
  const otro = lng === 'es' ? 'en' : 'es'

  document.title = title
  ponerMeta('meta[name="description"]', 'content', description)
  ponerMeta('link[rel="canonical"]', 'href', url)
  ponerMeta('meta[property="og:title"]', 'content', title)
  ponerMeta('meta[property="og:description"]', 'content', description)
  ponerMeta('meta[property="og:url"]', 'content', url)
  ponerMeta('meta[property="og:locale"]', 'content', LOCALE_OG[lng])
  ponerMeta('meta[property="og:locale:alternate"]', 'content', LOCALE_OG[otro])
  ponerMeta('meta[property="og:image:alt"]', 'content', title)
  ponerMeta('meta[name="twitter:title"]', 'content', title)
  ponerMeta('meta[name="twitter:description"]', 'content', description)

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove())
  alternativas(pagina).forEach(({ hreflang, href }) => {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = hreflang
    link.href = href
    document.head.appendChild(link)
  })
}
