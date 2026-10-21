import { useTranslation } from 'react-i18next'
import './Faq.css'

// Acordeón nativo (<details>): accesible por teclado y lector de pantalla sin JS.
export default function Faq() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true })

  return (
    <section className="faq section grain" id="faq">
      <div className="container container--full">
        <header className="section-head" data-reveal>
          <span className="kicker">{t('faq.kicker')}</span>
          <h2>
            {t('faq.title')} <span className="grad-text">{t('faq.titleHighlight')}</span>
          </h2>
          <p>{t('faq.description')}</p>
        </header>

        <div className="faq__list">
          {items.map(({ q, a }, i) => (
            <details
              className="faq__item glass-card glass-card--static"
              key={q}
              data-reveal
              style={{ '--delay': `${i * 60}ms` }}
            >
              <summary className="faq__q">
                <span>{q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <p className="faq__a">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
