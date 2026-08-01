import { IconMail, IconPhone, IconPin } from './icons.jsx'
import './Footer.css'

const COLUMNS = [
  {
    title: 'Servicios',
    links: [
      'Desarrollo WordPress',
      'Diseño con Elementor',
      'Diseño UI/UX',
      'Optimización WPO',
      'Mantenimiento Web',
    ],
  },
  {
    title: 'Agencia',
    links: ['Sobre nosotros', 'Proceso', 'Clientes', 'Blog', 'Contacto'],
  },
]

const CONTACT = [
  { icon: IconMail, text: 'hola@astravia.digital', href: 'mailto:hola@astravia.digital' },
  { icon: IconPhone, text: '+54 11 1234 5678', href: 'tel:+541112345678' },
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
              Agencia digital especializada en desarrollo web estratégico. Transformamos visiones en
              despegues digitales.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#contacto">{link}</a>
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
          <ul className="footer__legal">
            <li>
              <a href="#contacto">Privacidad</a>
            </li>
            <li>
              <a href="#contacto">Términos</a>
            </li>
            <li>
              <a href="#contacto">Cookies</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
