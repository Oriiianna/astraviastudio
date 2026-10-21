import { useTranslation } from 'react-i18next'
import './Process.css'
import img1 from '../recursos/proceso-1.webp'
import img2 from '../recursos/proceso-2.webp'
import img3 from '../recursos/proceso-3.webp'
import img4 from '../recursos/proceso-4.webp'

const STEPS = [
  { n: '01', img: img1, key: 'one' },
  { n: '02', img: img2, key: 'two' },
  { n: '03', img: img3, key: 'three' },
  { n: '04', img: img4, key: 'four' },
]

export default function Process() {
  const { t } = useTranslation()

  return (
    <section className="process section grain" id="proceso">
      <div className="container container--full">
        <header className="section-head process__head">
          <span className="kicker" data-reveal>{t('process.kicker')}</span>
          <h2 data-reveal="wipe" style={{ '--delay': '90ms' }}>
            {t('process.title')}
            <br />
            {t('process.accent')}
          </h2>
          <p data-reveal style={{ '--delay': '180ms' }}>{t('process.description')}</p>
        </header>

        <ol className="process__steps">
          {STEPS.map(({ n, img, key }, i) => (
            <li className="step glass-card" key={n} data-reveal data-spotlight style={{ '--delay': `${i * 110}ms` }}>
              <span className="step__num" aria-hidden="true">{n}</span>

              <img
                className="step__img"
                src={img}
                alt={t(`process.steps.${key}.alt`)}
                width="640"
                height="400"
                loading="lazy"
                decoding="async"
              />

              <h3>{t(`process.steps.${key}.title`)}</h3>
              <p>{t(`process.steps.${key}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
