import { IconSparkle, IconCheckSquare, IconFile, IconUsers } from './icons.jsx'
import './Marquee.css'

const ITEMS = [
  { icon: IconSparkle, label: 'Tecnologías modernas' },
  { icon: IconCheckSquare, label: 'Resultados reales' },
  { icon: IconFile, label: '+50 proyectos' },
  { icon: IconUsers, label: 'Clientes satisfechos' },
]

function Track({ ariaHidden }) {
  return (
    <div className="marquee__track" aria-hidden={ariaHidden || undefined}>
      {ITEMS.map(({ icon: Icon, label }) => (
        <span className="marquee__item" key={label}>
          <Icon className="marquee__icon" />
          {label}
          <i className="marquee__dot" />
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee__viewport">
        <Track />
        <Track ariaHidden />
        <Track ariaHidden />
      </div>
    </div>
  )
}
