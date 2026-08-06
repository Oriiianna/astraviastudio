import { useTranslation } from 'react-i18next'
import {
  LogoWordPress,
  LogoElementor,
  LogoWooCommerce,
  LogoJavascript,
  LogoReact,
  LogoTailwind,
} from './icons.jsx'
import './TechStack.css'

const TECHS = [
  { name: 'WordPress', Logo: LogoWordPress },
  { name: 'Elementor', Logo: LogoElementor },
  { name: 'WooCommerce', Logo: LogoWooCommerce },
  { name: 'JavaScript', Logo: LogoJavascript },
  { name: 'React', Logo: LogoReact },
  { name: 'Tailwind CSS', Logo: LogoTailwind },
]

export default function TechStack() {
  const { t } = useTranslation()

  return (
    <section className="tech grain">
      <div className="container container--full">
        <p className="tech__label" data-reveal>
          {t('techStack.label')}
        </p>

        <ul className="tech__row">
          {TECHS.map(({ name, Logo }, i) => (
            <li key={name} data-reveal style={{ '--delay': `${i * 60}ms` }}>
              <span className="tech__item" title={name}>
                <Logo />
                <span className="tech__name">{name}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
