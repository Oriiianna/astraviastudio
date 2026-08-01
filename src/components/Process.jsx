import { IconBulb, IconPalette, IconCode, IconRocket } from './icons.jsx'
import './Process.css'

const STEPS = [
  {
    n: '01',
    icon: IconBulb,
    title: 'Estrategia',
    text: 'Definimos objetivos, analizamos la competencia y trazamos el plan de acción.',
  },
  {
    n: '02',
    icon: IconPalette,
    title: 'Diseño',
    text: 'Creamos prototipos visuales enfocados en la experiencia del usuario.',
  },
  {
    n: '03',
    icon: IconCode,
    title: 'Desarrollo',
    text: 'Escribimos código limpio, rápido y optimizado para buscadores.',
  },
  {
    n: '04',
    icon: IconRocket,
    title: 'Lanzamiento',
    text: 'Pruebas exhaustivas, publicación y monitoreo de resultados.',
  },
]

export default function Process() {
  return (
    <section className="process section grain" id="proceso">
      <div className="process__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <header className="section-head" data-reveal>
          <span className="kicker">Cómo trabajamos</span>
          <h2>Un proceso transparente</h2>
          <p>Sin sorpresas. Cada fase está diseñada para mantener el proyecto en tiempo y forma.</p>
        </header>

        <ol className="process__steps">
          <span className="process__line" aria-hidden="true" />

          {STEPS.map(({ n, icon: Icon, title, text }, i) => (
            <li className="step" key={n} data-reveal style={{ '--delay': `${i * 130}ms` }}>
              <span className="step__icon">
                <Icon />
                <i className="step__ring" aria-hidden="true" />
              </span>
              <span className="step__n">{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
