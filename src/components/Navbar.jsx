import { useEffect, useState } from 'react'
import { IconRocket, IconMenu, IconClose } from './icons.jsx'
import './Navbar.css'

const LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Clientes', href: '#clientes' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del body con el menú móvil abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container container--full nav__inner">
        <a className="nav__logo" href="#inicio" onClick={() => setOpen(false)}>
          <img
            src="/brand/astravia-logo-oficial.svg"
            alt="Astravia"
            width="635"
            height="160"
            fetchpriority="high"
          />
        </a>

        <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#contacto" className="btn btn--primary nav__cta nav__cta--mobile" onClick={() => setOpen(false)}>
            Quiero despegar <IconRocket className="nav__cta-icon" />
          </a>
        </nav>

        <a href="#contacto" className="btn btn--primary nav__cta">
          Quiero despegar <IconRocket className="nav__cta-icon" />
        </a>

        <button
          className="nav__burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>
    </header>
  )
}
