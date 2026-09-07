import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronUp, IconZap, IconDashboard } from './icons.jsx'
import './Hero.css'

// Mismo corte que usa el CSS: por debajo de este ancho el hero no muestra video,
// sirve una sola imagen fija.
const MOVIL = '(max-width: 860px)'

export default function Hero() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const videoRef = useRef(null)

  // En móvil el video no se sirve: se muestra una sola imagen en su lugar.
  const [esMovil, setEsMovil] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(MOVIL).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(MOVIL)
    const alCambiar = (e) => setEsMovil(e.matches)
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  // Velocidad de reproducción del video
  // NOTA: Se usa 1.0 (velocidad normal) para evitar trabas.
  // Velocidades menores a 1.0 pueden causar problemas en algunos navegadores
  // si no pueden mantener la tasa de frames a esa velocidad.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0
    }
  }, [])

  return (
    <section className="hero" id="inicio" ref={sectionRef}>
      <div className="hero__stage" ref={stageRef}>
        {esMovil ? (
          <img
            className="hero__still"
            src="/hero/mobile.jpg"
            alt=""
            aria-hidden="true"
            fetchpriority="high"
            decoding="async"
            width="1920"
            height="1080"
          />
        ) : (
          <video
            ref={videoRef}
            className="hero__video"
            src="/hero/hero-loop.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            poster="/hero/w1280/frame-001.webp"
          />
        )}

        {/* Overlay negro semitransparente para dar contraste al texto */}
        <div className="hero__overlay" aria-hidden="true" />
        <div className="hero__vignette" aria-hidden="true" />

        <div className="container container--full hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              <span className="hero__line" style={{ '--i': 0 }}>
                {t('hero.titleLine1')}
              </span>
              <span className="hero__line grad-text" style={{ '--i': 2 }}>
                {t('hero.titleLine3')}
              </span>
            </h1>

            <p className="hero__lead" style={{ '--i': 4 }}>
              {t('hero.lead')}
            </p>

            <div className="hero__actions" style={{ '--i': 5 }}>
              <a href="#contacto" className="btn btn--primary">
                {t('hero.primaryCta')} <IconZap />
              </a>
              <a href="#proceso" className="btn btn--ghost">
                {t('hero.secondaryCta')} <IconDashboard />
              </a>
            </div>
          </div>
        </div>

        <div className="hero__hint" aria-hidden="true">
          <span>{t('hero.hint')}</span>
          <IconChevronUp className="hero__hint-arrow" />
        </div>
      </div>
    </section>
  )
}
