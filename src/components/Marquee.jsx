import { useTranslation } from 'react-i18next'
import { IconSparkle, IconCheckSquare, IconFile, IconUsers } from './icons.jsx'
import './Marquee.css'

const ICONS = [IconSparkle, IconCheckSquare, IconFile, IconUsers]

function Track({ ariaHidden, items }) {
  return (
    <div className="marquee__track" aria-hidden={ariaHidden || undefined}>
      {items.map((label, index) => {
        const Icon = ICONS[index]
        return (
          <span className="marquee__item" key={label}>
            <Icon className="marquee__icon" />
            {label}
            <i className="marquee__dot" />
          </span>
        )
      })}
    </div>
  )
}

export default function Marquee() {
  const { t } = useTranslation()
  const items = t('marquee.items', { returnObjects: true })

  return (
    <div className="marquee">
      <div className="marquee__viewport">
        <Track items={items} />
        <Track ariaHidden items={items} />
        <Track ariaHidden items={items} />
      </div>
    </div>
  )
}
