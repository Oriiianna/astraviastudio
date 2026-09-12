import { useTranslation } from 'react-i18next'
import { IconCheckCircle } from './icons.jsx'
import './Pricing.css'

// El mismo número que usa Contact.jsx.
const WHATSAPP_NUMBER = '5491168717233'

// Solo estructura: los textos y los precios viven en translation.json.
const PLANS = [
  { key: 'landing', accent: '#7c3aed', featured: false },
  { key: 'clasica', accent: '#9b6cf5', featured: true },
  { key: 'ecommerce', accent: '#7ec4ef', featured: false },
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
                <div className="plan__head">
                  <h3 className="plan__name">{name}</h3>
                  {featured && <span className="plan__badge">{t('pricing.featuredBadge')}</span>}
                </div>

                <ul className="plan__features">
                  {features.map((feature) => (
                    <li key={feature}>
                      <IconCheckCircle aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  className={`btn ${featured ? 'btn--primary' : 'btn--ghost'} plan__cta`}
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
      </div>
    </section>
  )
}
