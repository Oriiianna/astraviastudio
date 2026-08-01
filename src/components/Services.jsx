import {
  IconArtboard,
  IconBrowserCode,
  IconSpeedometer,
  IconShieldGear,
} from './icons.jsx'
import './Services.css'

/* Los cuatro acentos son una progresión dentro de la escala de marca:
   violeta → iris → periwinkle → hielo. Nada se sale del sistema. */
const SERVICES = [
  {
    title: 'Diseño UI/UX',
    text: 'Diseñamos experiencias que guían al usuario y aumentan la conversión.',
    accent: '#7c3aed',
    Icon: IconArtboard,
  },
  {
    title: 'Desarrollo Web',
    text: 'Construimos con WordPress, Elementor, React, HTML, CSS, JS y más.',
    accent: '#9b6cf5',
    Icon: IconBrowserCode,
  },
  {
    title: 'Optimización',
    text: 'Velocidad, rendimiento y SEO para que tu web no pierda clientes.',
    accent: '#8b9cf7',
    Icon: IconSpeedometer,
  },
  {
    title: 'Mantenimiento',
    text: 'Nos encargamos de todo para que tú solo te enfoques en crecer.',
    accent: '#7ec4ef',
    Icon: IconShieldGear,
  },
]

export default function Services() {
  return (
    <section className="services section grain" id="servicios">
      <div className="services__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <header className="section-head" data-reveal>
          <span className="kicker">Qué hacemos</span>
          <h2>Nuestros Servicios</h2>
          <p>Soluciones integrales diseñadas para posicionar tu marca y escalar tu negocio digital.</p>
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
