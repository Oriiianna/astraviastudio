import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconRocket, IconMenu, IconClose } from './icons.jsx'
import './Navbar.css'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const isHomePage = location.pathname === '/'

  const handleNavigation = (e, hash) => {
    if (isHomePage) {
      e.preventDefault()
      if (hash === '#inicio' || hash === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    setOpen(false)
  }

  const handleLogoClick = (e) => {
    if (isHomePage) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setOpen(false)
  }

  const getHref = (hash) => isHomePage ? hash : `/${hash}`

  const LINKS = [
    { label: t('nav.services'), hash: '#servicios' },
    { label: t('nav.process'), hash: '#proceso' },
    { label: t('nav.work'), hash: '#clientes' },
    { label: t('nav.contact'), hash: '#contacto' },
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
        <Link className="nav__logo" to="/" onClick={handleLogoClick}>
          <img
            src="/brand/astravia-logo-oficial.svg"
            alt="Astravia"
            width="635"
            height="160"
            fetchpriority="high"
          />
        </Link>

        <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          {LINKS.map((link) => (
            <a key={link.hash} href={getHref(link.hash)} onClick={(e) => handleNavigation(e, link.hash)}>
              {link.label}
            </a>
          ))}
          <a href={getHref('#contacto')} className="btn btn--primary nav__cta nav__cta--mobile" onClick={(e) => handleNavigation(e, '#contacto')}>
            {t('nav.cta')} <IconRocket className="nav__cta-icon" />
          </a>
        </nav>

        <div className="nav__actions">
          <div className="nav__langSwitch" role="group" aria-label={t('nav.languageLabel')} data-lang={i18n.language.startsWith('en') ? 'en' : 'es'}>
            <span className="nav__langThumb" aria-hidden="true" />
            <button
              type="button"
              aria-pressed={!i18n.language.startsWith('en')}
              className={`nav__langOption ${i18n.language.startsWith('en') ? '' : 'is-active'}`}
              onClick={() => i18n.changeLanguage('es')}
            >
              ES
            </button>
            <button
              type="button"
              aria-pressed={i18n.language.startsWith('en')}
              className={`nav__langOption ${i18n.language.startsWith('en') ? 'is-active' : ''}`}
              onClick={() => i18n.changeLanguage('en')}
            >
              EN
            </button>
          </div>
          <a href="#contacto" className="btn btn--primary nav__cta" onClick={(e) => handleNavigation(e, '#contacto')}>
            {t('nav.cta')} <IconRocket className="nav__cta-icon" />
          </a>
        </div>

        <button
          className="nav__burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={open}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>
    </header>
  )
}
