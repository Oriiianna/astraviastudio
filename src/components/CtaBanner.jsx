import { useTranslation } from 'react-i18next'
import './CtaBanner.css'

export default function CtaBanner() {
  const { t } = useTranslation()

  return (
    <section className="cta-section grain">
      <div className="container container--full">
        <div className="cta" data-reveal>
          <div className="cta__copy">
            <h2 className="cta__title">
              {t('cta.title')} <span className="cta__accent">{t('cta.accent')}</span>
            </h2>

            <p>{t('cta.body')}</p>
            <a href="#contacto" className="btn btn--primary cta__btn">
              {t('cta.button')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
