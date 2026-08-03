import { IconArtboard, IconBrowserCode, IconLayers, IconSpeedometer } from './icons.jsx'
import './Services.css'

/* Los cuatro acentos son una progresión dentro de la escala de marca:
   violeta → iris → periwinkle → hielo. Nada se sale del sistema. */
const SERVICES = [
  {
    title: 'Diseño UI/UX',
    text: 'Ordenamos el mensaje y el recorrido para que se entienda en cinco segundos.',
    accent: '#7c3aed',
    Icon: IconArtboard,
  },
  {
    title: 'Sitios web',
    text: 'Institucionales, landings y tiendas. En WordPress o a código, según convenga.',
    accent: '#9b6cf5',
    Icon: IconBrowserCode,
  },
  {
    title: 'Aplicaciones web',
    text: 'Catálogos, buscadores y paneles con lógica propia, hechos en React.',
    accent: '#8b9cf7',
    Icon: IconLayers,
  },
  {
    title: 'Rendimiento y SEO',
    text: 'Carga rápida, SEO técnico y mantenimiento para que no pierdas terreno.',
    accent: '#7ec4ef',
    Icon: IconSpeedometer,
  },
]

export default function Services() {
  return (
    <section className="services section grain" id="servicios">
      <div className="services__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <header className="section-head" data-reveal>
          <span className="kicker">Qué hacemos</span>
          <h2>Sitios y aplicaciones web, de punta a punta</h2>
          <p>
            Del primer boceto al sitio publicado y andando. Un solo equipo para diseño, código y
            todo lo que viene después.
          </p>
        </header>

        <div className="services__grid">
          {SERVICES.map((service, i) => (
            <article
              className="service-card gradient-border"
              key={service.title}
              style={{ '--accent': service.accent, '--delay': `${i * 110}ms` }}
              data-reveal
              data-spotlight
            >
              <span className="service-card__icon">
                <service.Icon />
              </span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className="service-card__index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
