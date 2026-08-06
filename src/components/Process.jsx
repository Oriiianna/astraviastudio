import { useTranslation } from 'react-i18next'
import { IconBulb, IconPalette, IconCode, IconRocket } from './icons.jsx'
import './Process.css'

const STEPS = [
  {
    n: '01',
    icon: IconBulb,
    key: 'one',
  },
  {
    n: '02',
    icon: IconPalette,
    key: 'two',
  },
  {
    n: '03',
    icon: IconCode,
    key: 'three',
  },
  {
    n: '04',
    icon: IconRocket,
    key: 'four',
  },
]

export default function Process() {
  const { t } = useTranslation()

  return (
    <section className="process section grain" id="proceso">
      <div className="process__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <header className="section-head" data-reveal>
          <span className="kicker">{t('process.kicker')}</span>
          <h2>{t('process.title')}</h2>
          <p>{t('process.description')}</p>
        </header>

        <ol className="process__steps">
          <span className="process__line" aria-hidden="true" />

          {STEPS.map(({ n, icon: Icon, key }, i) => (
            <li className="step" key={n} data-reveal style={{ '--delay': `${i * 130}ms` }}>
              <span className="step__icon">
                <Icon />
                <i className="step__ring" aria-hidden="true" />
              </span>
              <span className="step__n">{n}</span>
              <h3>{t(`process.steps.${key}.title`)}</h3>
              <p>{t(`process.steps.${key}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
