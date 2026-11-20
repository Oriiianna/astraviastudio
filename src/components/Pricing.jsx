import { useTranslation } from 'react-i18next'
import PricingV2 from './PricingV2.jsx'
import './Pricing.css'

export default function Pricing() {
  const { t } = useTranslation()

  return (
    <section className="pricing section grain" id="planes">
      <div className="container container--full">
        <header className="section-head">
          <h2 data-reveal="wipe" style={{ '--delay': '90ms' }}>
            {t('pricing.title')} <span className="grad-text">{t('pricing.titleHighlight')}</span>
          </h2>
          <p data-reveal style={{ '--delay': '180ms' }}>{t('pricing.description')}</p>
        </header>

        <PricingV2 />
      </div>
    </section>
  )
}
