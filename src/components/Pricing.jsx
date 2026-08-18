import { useTranslation } from 'react-i18next'
import { IconCheckCircle, IconGauge, IconLayers, IconShield } from './icons.jsx'
import './Pricing.css'

// El mismo número que usa Contact.jsx.
const WHATSAPP_NUMBER = '5491168717233'

// Solo estructura: los textos y los precios viven en translation.json.
const PLANS = [
  { key: 'landing', accent: '#7c3aed', featured: false },
  { key: 'clasica', accent: '#9b6cf5', featured: true },
  { key: 'ecommerce', accent: '#7ec4ef', featured: false },
]

const PROOF = [
  { key: 'pagespeed', Icon: IconGauge },
  { key: 'projects', Icon: IconLayers },
  { key: 'uptime', Icon: IconShield },
]

export default function Pricing() {
  const { t } = useTranslation()

  return (
    <section className="pricing section grain" id="planes">
      <div className="container container--full">
        <header className="section-head" data-reveal>
          <span className="kicker">{t('pricing.kicker')}</span>
          <h2>
            {t('pricing.title')} <span className="grad-text">{t('pricing.titleHighlight')}</span>
          </h2>
          <p>{t('pricing.description')}</p>
        </header>

        <div className="pricing__grid">
          {PLANS.map(({ key, accent, featured }, i) => {
            const name = t(`pricing.plans.${key}.name`)
            const features = t(`pricing.plans.${key}.features`, { returnObjects: true })
            // Puede venir vacío: un precio sin miles (ej. USD 390) no debe
            // dejar un superíndice colgando.
            const amountSmall = t(`pricing.plans.${key}.price.amountSmall`)
            const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              t('pricing.whatsappMessage', { plan: name })
            )}`

            return (
              <article
                className={`plan gradient-border${featured ? ' plan--featured' : ''}`}
                key={key}
                style={{ '--accent': accent, '--delay': `${i * 110}ms` }}
                data-reveal
                data-spotlight
              >
                {featured && <span className="plan__badge">{t('pricing.featuredBadge')}</span>}

                <h3 className="plan__name">{name}</h3>

                <p className="plan__price">
                  <span className="plan__currency">
                    {t(`pricing.plans.${key}.price.currency`)}
                  </span>
                  <span className="plan__amount">
                    {t(`pricing.plans.${key}.price.amount`)}
                    {amountSmall ? <sup>{amountSmall}</sup> : null}
                  </span>
                  <span className="plan__note">{t(`pricing.plans.${key}.price.note`)}</span>
                </p>

                <ul className="plan__features">
                  {features.map((feature) => (
                    <li key={feature}>
                      <IconCheckCircle aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  className="btn btn--primary plan__cta"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('pricing.ctaAriaLabel', { plan: name })}
                >
                  {t('pricing.cta')}
                </a>
              </article>
            )
          })}
        </div>

        <ul className="pricing__proof" data-reveal style={{ '--delay': '260ms' }}>
          {PROOF.map(({ key, Icon }) => (
            <li key={key}>
              <span className="pricing__proof-icon">
                <Icon aria-hidden="true" />
              </span>
              <span className="pricing__proof-value">
                {t(`pricing.proof.${key}.value`)}
                <small>{t(`pricing.proof.${key}.unit`)}</small>
              </span>
              <span className="pricing__proof-label">{t(`pricing.proof.${key}.label`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
