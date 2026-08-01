import { IconArrowUpRight } from './icons.jsx'
import './Clients.css'

/* Mockups de proyecto renderizados en CSS/SVG.
   Para usar capturas reales: poné el archivo en /public y
   reemplazá <ProjectMock/> por <img src="/mi-captura.png" alt="..." /> */
const PROJECTS = [
  {
    title: 'Fintech Dashboard',
    tag: 'UI/UX · Desarrollo',
    result: 'Cashback up to 40%',
    accent: '#7c3aed',
  },
  {
    title: 'Estudio Jurídico',
    tag: 'WordPress · SEO',
    result: '+180% consultas orgánicas',
    accent: '#8b9cf7',
  },
  {
    title: 'E-commerce Deportivo',
    tag: 'WooCommerce · CRO',
    result: '2.4x tasa de conversión',
    accent: '#7ec4ef',
  },
]

function ProjectMock({ accent }) {
  return (
    <div className="mock" style={{ '--accent': accent }} aria-hidden="true">
      <div className="mock__bar">
        <span />
        <span />
        <span />
      </div>
      <div className="mock__body">
        <div className="mock__side">
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="mock__main">
          <div className="mock__hero" />
          <div className="mock__row">
            <div className="mock__tile" />
            <div className="mock__tile mock__tile--alt" />
          </div>
          <div className="mock__chart">
            {[40, 68, 52, 84, 60, 92].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Clients() {
  return (
    <section className="clients section grain" id="clientes">
      <div className="clients__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <header className="clients__head">
          <div data-reveal>
            <span className="kicker">Portfolio</span>
            <h2>Clientes Recientes</h2>
            <p>
              Proyectos reales. Resultados medibles. Explora cómo hemos ayudado a otras marcas a
              destacar en su sector.
            </p>
          </div>

          <a href="#proceso" className="btn btn--ghost" data-reveal style={{ '--delay': '120ms' }}>
            Ver cómo trabajamos
          </a>
        </header>

        <div className="clients__grid">
          {PROJECTS.map((project, i) => (
            <article
              className="project"
              key={project.title}
              style={{ '--accent': project.accent, '--delay': `${i * 120}ms` }}
              data-reveal
              data-spotlight
            >
              <div className="project__thumb">
                <ProjectMock accent={project.accent} />
                <span className="project__overlay">
                  <span className="project__result">{project.result}</span>
                  <span className="project__go">
                    <IconArrowUpRight />
                  </span>
                </span>
              </div>

              <div className="project__meta">
                <h3>{project.title}</h3>
                <span className="project__tag">{project.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
