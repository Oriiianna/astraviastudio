import { IconCheckCircle, IconGauge, IconLayers, IconShield } from './icons.jsx'
import './Differentiator.css'

const POINTS = [
  'Cada pantalla pensada para que te escriban',
  'Rápida en el teléfono, que es donde te buscan',
  'Preparada para crecer sin rehacerla de cero',
]

const METRICS = [
  { icon: IconGauge, value: '98', unit: '/100', label: 'PageSpeed promedio' },
  { icon: IconLayers, value: '+50', unit: '', label: 'Proyectos entregados' },
  { icon: IconShield, value: '99.9', unit: '%', label: 'Uptime garantizado' },
]

export default function Differentiator() {
  return (
    <section className="diff grain">
      <div className="diff__bg bg-layer" aria-hidden="true" />

      <div className="container container--full diff__inner">
        <div className="diff__copy">
          <span className="kicker" data-reveal>
            Por qué Astravia
          </span>
          <h2 data-reveal="wipe">
            Una web linda no alcanza.
            <br />
            La tuya tiene que <span className="grad-text">vender.</span>
          </h2>

          <p data-reveal style={{ '--delay': '90ms' }}>
            Con una plantilla tendrás un sitio que se ve bien, y nada más. Nosotros estudiamos a
            quién le vendes, ordenamos el mensaje para que se entienda en cinco segundos y armamos
            cada pantalla con un objetivo: que la visita termine en una consulta.
          </p>

          <ul className="diff__list">
            {POINTS.map((point, i) => (
              <li key={point} data-reveal style={{ '--delay': `${180 + i * 90}ms` }}>
                <IconCheckCircle />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Panel de métricas (reemplazable por una captura real) */}
        <aside className="diff__panel" data-reveal data-spotlight style={{ '--delay': '160ms' }}>
          <div className="diff__panel-glow" aria-hidden="true" />

          <div className="diff__panel-head">
            <span className="diff__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>rendimiento.astravia</span>
          </div>

          <ul className="diff__metrics">
            {METRICS.map(({ icon: Icon, value, unit, label }) => (
              <li key={label}>
                <span className="diff__metric-icon">
                  <Icon />
                </span>
                <span className="diff__metric-value">
                  {value}
                  <small>{unit}</small>
                </span>
                <span className="diff__metric-label">{label}</span>
              </li>
            ))}
          </ul>

          <div className="diff__bars" aria-hidden="true">
            {[62, 88, 74, 96, 58, 82, 100].map((h, i) => (
              <span key={i} style={{ '--h': `${h}%`, '--i': i }} />
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
