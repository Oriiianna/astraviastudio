import { useTranslation } from 'react-i18next'
import { IconCheckCircle, IconGauge, IconLayers, IconShield } from './icons.jsx'
import './Differentiator.css'

const METRICS = [
  { icon: IconGauge, value: '98', unit: '/100', key: 'pagespeed' },
  { icon: IconLayers, value: '+50', unit: '', key: 'projects' },
  { icon: IconShield, value: '99.9', unit: '%', key: 'uptime' },
]

export default function Differentiator() {
  const { t } = useTranslation()
  const POINTS = t('differentiator.points', { returnObjects: true })

  return (
    <section className="diff grain" id="nosotros">
      <div className="diff__bg bg-layer" aria-hidden="true" />

      <div className="container container--full diff__inner">
        <div className="diff__copy">
          <span className="kicker" data-reveal>
            {t('differentiator.kicker')}
          </span>
          <h2 data-reveal="wipe">
            {t('differentiator.title')}
            <br />
            {t('differentiator.titleAccent')} <span className="grad-text">{t('differentiator.titleHighlight')}</span>
          </h2>

          <p data-reveal style={{ '--delay': '90ms' }}>
            {t('differentiator.description')}
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
            <span>{t('differentiator.panelLabel')}</span>
          </div>

          <ul className="diff__metrics">
            {METRICS.map(({ icon: Icon, value, unit, key }) => (
              <li key={key}>
                <span className="diff__metric-icon">
                  <Icon />
                </span>
                <span className="diff__metric-value">
                  {value}
                  <small>{unit}</small>
                </span>
                <span className="diff__metric-label">{t(`differentiator.metrics.${key}.label`)}</span>
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
