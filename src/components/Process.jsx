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
      <div className="container container--full">
        <header className="section-head" data-reveal>
          <span className="kicker">{t('process.kicker')}</span>
          <h2>{t('process.title')}</h2>
          <p>{t('process.description')}</p>
        </header>

        <ol className="process__steps" data-reveal>
          {/* El riel se dibuja de punta a punta cuando la seccion entra en cuadro. */}
          <span className="process__rail" aria-hidden="true">
            <i />
          </span>

          {STEPS.map(({ n, icon: Icon, key }, i) => (
            <li className="step" key={n} data-reveal style={{ '--delay': `${i * 130}ms` }}>
              {/* El orden lo lleva el <ol>: el numeral es decorativo. */}
              <span className="step__cifra" aria-hidden="true">{n}</span>

              <span className="step__nodo">
                <Icon />
              </span>

              <h3>{t(`process.steps.${key}.title`)}</h3>
              <p>{t(`process.steps.${key}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
