import { IconMail, IconPin } from './icons.jsx'
import './Footer.css'

/* Cada enlace lleva a una sección que existe. Antes los quince apuntaban a
   #contacto, incluidos un "Blog" y tres páginas legales que no están escritas:
   prometer una página y llevar a otra es la forma más barata de perder a
   alguien que estaba mirando en serio. */
const COLUMNS = [
  {
    title: 'Servicios',
    links: [
      { label: 'Diseño UI/UX', href: '#servicios' },
      { label: 'Sitios web', href: '#servicios' },
      { label: 'Aplicaciones web', href: '#servicios' },
      { label: 'Rendimiento y SEO', href: '#servicios' },
    ],
  },
  {
    title: 'Estudio',
    links: [
      { label: 'Por qué Astravia', href: '#nosotros' },
      { label: 'Proceso', href: '#proceso' },
      { label: 'Trabajo', href: '#clientes' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },
]

/* El teléfono que había (+54 11 1234 5678) era el placeholder de manual.
   Queda afuera hasta que haya uno real: un número que no atiende cuesta más
   que no mostrar ninguno. */
const CONTACT = [
  { icon: IconMail, text: 'hola@astravia.digital', href: 'mailto:hola@astravia.digital' },
  { icon: IconPin, text: 'Buenos Aires, Argentina', href: null },
]

export default function Footer() {
  return (
    <footer className="footer grain">
      <div className="footer__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <div className="footer__grid">
          <div className="footer__brand">
            <a className="footer__logo" href="#inicio">
              <img
                src="/brand/astravia-logo-oficial.svg"
                alt="Astravia"
                width="635"
                height="160"
                loading="lazy"
              />
            </a>
            <p>
              Equipo de diseño y desarrollo. Hacemos sitios y aplicaciones web a medida, de la
              primera idea al despegue.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer__col">
            <h3>Contacto</h3>
            <ul className="footer__contact">
              {CONTACT.map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <Icon />
                  {href ? <a href={href}>{text}</a> : <span>{text}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Astravia. Todos los derechos reservados.</p>
          <p className="footer__made">
            Hecho con <span aria-label="amor">💜</span> para el universo digital
          </p>
        </div>
      </div>
    </footer>
  )
}
