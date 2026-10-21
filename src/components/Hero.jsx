import { Fragment, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronUp, IconArrowRight } from './icons.jsx'
import './Hero.css'

// Con "reducir movimiento" o ahorro de datos activos no se baja ni reproduce el
// video: queda el póster (el primer fotograma).
const soloPoster =
  typeof window !== 'undefined' &&
  (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    navigator.connection?.saveData === true)

// Cada palabra sube desde una máscara; `inicio` continúa el escalonado de la línea anterior.
const palabras = (texto, inicio) =>
  texto
    .trim()
    .split(/\s+/)
    .map((palabra, n) => (
      <Fragment key={palabra + n}>
        <span className="hero__word">
          <span className="hero__word-in" style={{ '--w': inicio + n }}>
            {palabra}
          </span>
        </span>{' '}
      </Fragment>
    ))

export default function Hero() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const videoRef = useRef(null)

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
        <video
          ref={videoRef}
          className="hero__video"
          src={soloPoster ? undefined : '/hero/hero-loop.mp4'}
          muted
          loop
          playsInline
          autoPlay={!soloPoster}
          preload={soloPoster ? 'none' : 'metadata'}
          aria-hidden="true"
          poster="/hero/w1280/frame-001.webp"
        />

        {/* Overlay negro semitransparente para dar contraste al texto */}
        <div className="hero__overlay" aria-hidden="true" />
        <div className="hero__vignette" aria-hidden="true" />

        <div className="container container--full hero__inner">
          <div className="hero__copy">
            <h1
              className="hero__title"
              aria-label={`${t('hero.titleLine1')}${t('hero.titleLine3')}`}
            >
              <span className="hero__line" aria-hidden="true">
                {palabras(t('hero.titleLine1'), 0)}
              </span>
              <span className="hero__line hero__line--grad" aria-hidden="true">
                <span className="hero__word">
                  <span
                    className="hero__word-in"
                    style={{ '--w': t('hero.titleLine1').trim().split(/\s+/).length }}
                  >
                    {t('hero.titleLine3').trim()}
                  </span>
                </span>
              </span>
            </h1>

            <p className="hero__lead" style={{ '--i': 4 }}>
              {t('hero.lead')}
            </p>

            <div className="hero__actions" style={{ '--i': 5 }}>
              <a href="#contacto" className="btn btn--primary hero__cta">
                {t('hero.primaryCta')}
                <IconArrowRight aria-hidden="true" />
              </a>
              <a href="#clientes" className="btn btn--ghost">
                {t('hero.secondaryCta')}
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
