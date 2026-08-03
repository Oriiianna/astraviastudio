import { IconSparkle, IconCheckSquare, IconSpeedometer, IconUsers } from './icons.jsx'
import './Marquee.css'

/* Cada ítem tiene que ser algo que podamos sostener si nos preguntan. Nada de
   "+50 proyectos" ni "clientes satisfechos": son números que no podemos probar
   y lo primero que hace un cliente serio es pedirlos. */
const ITEMS = [
  { icon: IconSparkle, label: 'Sitios y aplicaciones web' },
  { icon: IconUsers, label: 'Diseño y desarrollo en un mismo equipo' },
  { icon: IconSpeedometer, label: 'Rendimiento y SEO desde el primer día' },
  { icon: IconCheckSquare, label: 'Respuesta en 24 horas' },
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
