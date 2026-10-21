import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconMenu, IconClose } from './icons.jsx'
import { scrollToHash, scrollToTop } from '../utils/scroll'
import { idiomaActual, rutaConIdioma, rutaSinIdioma } from '../utils/idioma'
import './Navbar.css'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  const lng = idiomaActual(i18n)
  const isHomePage = rutaSinIdioma(location.pathname) === '/'

  const handleNavigation = (e, hash) => {
    if (isHomePage) {
      e.preventDefault()
      if (hash === '#inicio' || hash === '/') {
        scrollToTop()
      } else {
        scrollToHash(hash)
      }
    } else {
      // Fuera del home: navegar dentro de la SPA (ScrollToHash hace el scroll)
      e.preventDefault()
      navigate(`${rutaConIdioma(lng)}${hash}`)
    }
    setOpen(false)
  }

  const handleLogoClick = (e) => {
    if (isHomePage) {
      e.preventDefault()
      scrollToTop()
    }
    setOpen(false)
  }

  const getHref = (hash) => isHomePage ? hash : `${rutaConIdioma(lng)}${hash}`

  // El idioma es parte de la URL: se cambia yendo a la misma página en el otro idioma.
  const cambiarIdioma = (nuevo) => {
    if (nuevo === lng) return
    navigate({
      pathname: rutaConIdioma(nuevo, rutaSinIdioma(location.pathname)),
      hash: window.location.hash,
    })
    setOpen(false)
  }

  const LINKS = [
    { label: t('nav.services'), hash: '#servicios' },
    { label: t('nav.process'), hash: '#proceso' },
    { label: t('nav.pricing'), hash: '#planes' },
    { label: t('nav.work'), hash: '#clientes' },
    { label: t('nav.contact'), hash: '#contacto' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Resalta el enlace de la sección que cruza la franja central de la pantalla.
  useEffect(() => {
    if (!isHomePage || !('IntersectionObserver' in window)) return
    const secciones = ['#servicios', '#proceso', '#planes', '#clientes', '#contacto']
      .map((hash) => document.querySelector(hash))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    secciones.forEach((el) => observer.observe(el))

    // En el hero (arriba del todo) no hay sección activa.
    const onScroll = () => {
      if (window.scrollY < 120) setActive('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [isHomePage])

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
        <Link className="nav__logo" to={rutaConIdioma(lng)} onClick={handleLogoClick}>
          <img
            src="/brand/astravia-logo-oficial.svg"
            alt="Astravia"
            width="635"
            height="160"
            fetchPriority="high"
          />
        </Link>

        <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label={t('nav.mainLabel')}>
          {LINKS.map((link) => (
            <a
              key={link.hash}
              href={getHref(link.hash)}
              onClick={(e) => handleNavigation(e, link.hash)}
              className={isHomePage && active === link.hash ? 'is-active' : undefined}
              aria-current={isHomePage && active === link.hash ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
          <a href={getHref('#contacto')} className="btn btn--primary nav__cta nav__cta--mobile" onClick={(e) => handleNavigation(e, '#contacto')}>
            {t('nav.cta')}
          </a>
        </nav>

        <div className="nav__actions">
          <div className="nav__langSwitch" role="group" aria-label={t('nav.languageLabel')} data-lang={i18n.language.startsWith('en') ? 'en' : 'es'}>
            <span className="nav__langThumb" aria-hidden="true" />
            <button
              type="button"
              aria-pressed={!i18n.language.startsWith('en')}
              className={`nav__langOption ${i18n.language.startsWith('en') ? '' : 'is-active'}`}
              onClick={() => cambiarIdioma('es')}
            >
              ES
            </button>
            <button
              type="button"
              aria-pressed={i18n.language.startsWith('en')}
              className={`nav__langOption ${i18n.language.startsWith('en') ? 'is-active' : ''}`}
              onClick={() => cambiarIdioma('en')}
            >
              EN
            </button>
          </div>
          <a href="#contacto" className="btn btn--primary nav__cta" onClick={(e) => handleNavigation(e, '#contacto')}>
            {t('nav.cta')}
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
