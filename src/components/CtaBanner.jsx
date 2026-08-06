import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IconArrowRight } from './icons.jsx'
import useFrameSequence from '../hooks/useFrameSequence.js'
import manifest from '../../public/astronauta/manifest.json'
import './CtaBanner.css'

const frameUrl = (set, i) => `/astronauta/${set}/frame-${String(i + 1).padStart(3, '0')}.webp`

export default function CtaBanner() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)

  // Misma mecánica que el hero, pero en modo 'through': la sección tiene altura
  // normal y la secuencia avanza mientras cruza el viewport.
  useFrameSequence({
    canvasRef,
    sectionRef,
    frames: manifest.frames,
    frameUrl,
    sets: { query: '(max-width: 860px)', small: 'w520', large: 'w860' },
    fit: 'contain',
    alpha: true,
    mode: 'through',
    concurrency: 4,
    startDelay: 3500, // está al final de la página: puede esperar
  })

  return (
    <section className="cta-section grain" ref={sectionRef}>
      <div className="container container--full">
        <div className="cta" data-reveal data-spotlight>
          <div className="cta__glow" aria-hidden="true" />
          <div className="stars cta__stars" aria-hidden="true" />

          <h2 className="cta__title">
            {t('cta.title')} <span className="cta__accent">{t('cta.accent')}</span>
          </h2>

          <div className="cta__body">
            <div className="cta__art">
              <div className="cta__art-glow" aria-hidden="true" />
              <canvas
                className="cta__canvas"
                ref={canvasRef}
                style={{ aspectRatio: manifest.aspect }}
                role="img"
                aria-label="Astronauta flotando con una lámpara encendida y una laptop"
              />
            </div>

            <div className="cta__copy">
              <p>{t('cta.body')}</p>
              <a href="#contacto" className="btn btn--primary cta__btn">
                {t('cta.button')} <IconArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
