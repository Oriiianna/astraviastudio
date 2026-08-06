import {
  IconArtboard,
  IconBrowserCode,
  IconSpeedometer,
  IconShieldGear,
} from './icons.jsx'
import { useTranslation } from 'react-i18next'
import './Services.css'

const SERVICES = [
  {
    accent: '#7c3aed',
    Icon: IconArtboard,
    key: 'one',
  },
  {
    accent: '#9b6cf5',
    Icon: IconBrowserCode,
    key: 'two',
  },
  {
    accent: '#8b9cf7',
    Icon: IconSpeedometer,
    key: 'three',
  },
  {
    accent: '#7ec4ef',
    Icon: IconShieldGear,
    key: 'four',
  },
]

export default function Services() {
  const { t } = useTranslation()

  return (
    <section className="services section grain" id="servicios">
      <div className="services__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <header className="section-head" data-reveal>
          <span className="kicker">{t('services.kicker')}</span>
          <h2>{t('services.title')}</h2>
          <p>{t('services.description')}</p>
        </header>

        <div className="services__grid">
          {SERVICES.map((service, i) => (
            <article
              className="service-card gradient-border"
              key={service.key}
              style={{ '--accent': service.accent, '--delay': `${i * 110}ms` }}
              data-reveal
              data-spotlight
            >
              <span className="service-card__icon">
                <service.Icon />
              </span>
              <h3>{t(`services.items.${service.key}.title`)}</h3>
              <p>{t(`services.items.${service.key}.text`)}</p>
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
