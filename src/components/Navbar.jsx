import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconRocket, IconMenu, IconClose } from './icons.jsx'
import './Navbar.css'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const LINKS = [
    { label: t('nav.services'), href: '#servicios' },
    { label: t('nav.process'), href: '#proceso' },
    { label: t('nav.work'), href: '#clientes' },
    { label: t('nav.contact'), href: '#contacto' },
  ]

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
            {t('nav.cta')} <IconRocket className="nav__cta-icon" />
          </a>
        </nav>

        <div className="nav__actions">
          <div className="nav__langSwitch" role="group" aria-label={t('nav.languageLabel')}>
            <button
              type="button"
              className={`nav__langOption ${i18n.language.startsWith('en') ? '' : 'is-active'}`}
              onClick={() => i18n.changeLanguage('es')}
            >
              ES
            </button>
            <button
              type="button"
              className={`nav__langOption ${i18n.language.startsWith('en') ? 'is-active' : ''}`}
              onClick={() => i18n.changeLanguage('en')}
            >
              EN
            </button>
          </div>
          <a href="#contacto" className="btn btn--primary nav__cta">
            {t('nav.cta')} <IconRocket className="nav__cta-icon" />
          </a>
        </div>

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
