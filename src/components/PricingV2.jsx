import { useTranslation } from 'react-i18next'
import { IconRocket, IconLayers, IconShoppingBag } from './icons.jsx'
import './PricingV2.css'

// El mismo número que usa Pricing.jsx y Contact.jsx.
const WHATSAPP_NUMBER = '5491168717233'

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)

// Solo estructura: los textos viven en translation.json (pricing.plans.*).
const PLANS = [
  { key: 'landing', accent: '#a78bfa', featured: false, Medal: IconRocket },
  { key: 'clasica', accent: '#00e5c8', featured: true, Medal: IconLayers },
  { key: 'ecommerce', accent: '#9fd4f7', featured: false, Medal: IconShoppingBag },
]

// Variante de tarjetas con medallón. Vive debajo de las originales mientras se evalúa.
export default function PricingV2() {
  const { t } = useTranslation()

  return (
    <div className="plans2">
      <div className="plans2__grid">
        {PLANS.map(({ key, accent, featured, Medal }, i) => {
          const name = t(`pricing.plans.${key}.name`)
          const features = t(`pricing.plans.${key}.features`, { returnObjects: true })
          const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            t('pricing.whatsappMessage', { plan: name })
          )}`

          return (
            <article
              className={`plan2${featured ? ' plan2--featured' : ''}`}
              key={key}
              style={{ '--accent': accent, '--delay': `${i * 110}ms`, '--i': i }}
              data-reveal
              data-icon-hover
            >
              <div className="plan2__medal" aria-hidden="true">
                <Medal alEntrar />
              </div>

              <header className="plan2__head">
                <span className="plan2__pill">{t(`pricing.plans.${key}.stage`)}</span>
                <h3 className="plan2__name">{name}</h3>
                <p className="plan2__tagline">{t(`pricing.plans.${key}.tagline`)}</p>
              </header>

              <ul className="plan2__features">
                {features.map((feature) => (
                  <li key={feature}>
                    <span className="plan2__check">
                      <Check />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                className={`btn ${featured ? 'btn--primary' : 'btn--ghost'} plan2__cta`}
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('pricing.ctaAriaLabel', { cta: t('pricing.cta'), plan: name })}
              >
                {t('pricing.cta')}
              </a>

              {featured && <p className="plan2__note">{t('pricing.featuredBadge')}</p>}
            </article>
          )
        })}
      </div>
    </div>
  )
}
