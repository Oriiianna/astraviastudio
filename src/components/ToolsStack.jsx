import { useTranslation } from 'react-i18next'
import {
  LogoWordPress,
  LogoElementor,
  LogoWooCommerce,
  LogoJavascript,
  LogoReact,
  LogoTailwind,
} from './icons.jsx'
import './ToolsStack.css'

// Distribución espejada como en la referencia: tarjeta grande arriba,
// chica al medio (pegada al borde) y mediana abajo, en zigzag horizontal.
const TOOLS = [
  { name: 'React', Logo: LogoReact, side: 'left', position: 'top', tint: 'ice', size: 'lg' },
  { name: 'WordPress', Logo: LogoWordPress, side: 'left', position: 'mid', tint: 'violet', size: 'sm' },
  { name: 'Tailwind CSS', Logo: LogoTailwind, side: 'left', position: 'bottom', tint: 'ember', size: 'md' },
  { name: 'Elementor', Logo: LogoElementor, side: 'right', position: 'top', tint: 'periwinkle', size: 'md' },
  { name: 'JavaScript', Logo: LogoJavascript, side: 'right', position: 'mid', tint: 'ember', size: 'sm' },
  { name: 'WooCommerce', Logo: LogoWooCommerce, side: 'right', position: 'bottom', tint: 'violet', size: 'lg' },
]

export default function ToolsStack() {
  const { t } = useTranslation()
  const leftCards = TOOLS.filter((tool) => tool.side === 'left')
  const rightCards = TOOLS.filter((tool) => tool.side === 'right')

  return (
    <section className="tools-section grain" id="technologies">
      <div className="tools-decoration tools-decoration--left" aria-hidden="true">
        {leftCards.map((tool) => (
          <div
            key={tool.name}
            className={`tools-card tools-card--${tool.position} tools-card--${tool.size} tools-card--${tool.tint}`}
            data-tooltip={tool.name}
          >
            <tool.Logo />
          </div>
        ))}
      </div>

      <div className="tools-content" data-reveal="wipe">
        <span className="tools-badge">
          <span className="tools-badge-dot" />
          {t('tools.pill')}
        </span>

        <h2 className="tools-title">{t('tools.title')}</h2>

        <p className="tools-description">{t('tools.text')}</p>

        <a href="#contacto" className="tools-cta btn btn--primary">
          {t('tools.cta')}
        </a>
      </div>

      <div className="tools-decoration tools-decoration--right" aria-hidden="true">
        {rightCards.map((tool) => (
          <div
            key={tool.name}
            className={`tools-card tools-card--${tool.position} tools-card--${tool.size} tools-card--${tool.tint}`}
            data-tooltip={tool.name}
          >
            <tool.Logo />
          </div>
        ))}
      </div>
    </section>
  )
}
