import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { IconChevronUp } from './icons.jsx'
import useFrameSequence from '../hooks/useFrameSequence.js'
// El manifiesto lo genera scripts/optimize-hero.mjs. Se importa en build time
// (no cuesta un request) para que el conteo de frames nunca quede desfasado.
import manifest from '../../public/hero/manifest.json'
import './Hero.css'

const frameUrl = (set, i) => `/hero/${set}/frame-${String(i + 1).padStart(3, '0')}.webp`
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export default function Hero() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)

  // El texto se va antes de que la escena se ponga densa: a mitad de camino
  // ya no compite con el render y se evita el estado "medio transparente".
  const handleProgress = useCallback((p) => {
    const stage = stageRef.current
    if (!stage) return
    stage.style.setProperty('--p', p.toFixed(4))
    stage.style.setProperty('--copy', clamp((0.55 - p) / 0.2, 0, 1).toFixed(4))
  }, [])

  const loaded = useFrameSequence({
    canvasRef,
    sectionRef,
    frames: manifest.frames,
    frameUrl,
    sets: { query: '(max-width: 860px)', small: 'w720', large: 'w1280' },
    fit: 'cover',
    mode: 'sticky',
    onProgress: handleProgress,
  })

  return (
    <section className="hero" id="inicio" ref={sectionRef}>
      <div className="hero__stage" ref={stageRef}>
        <canvas className="hero__canvas" ref={canvasRef} aria-hidden="true" />

        {/* Oscurecido para que el texto se lea sobre el render */}
        <div className="hero__scrim" aria-hidden="true" />
        <div className="hero__vignette" aria-hidden="true" />

        <div className="container container--full hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              <span className="hero__line" style={{ '--i': 0 }}>
                {t('hero.titleLine1')}
              </span>
              <span className="hero__line" style={{ '--i': 1 }}>
                {t('hero.titleLine2')}
              </span>
              <span className="hero__line grad-text" style={{ '--i': 2 }}>
                {t('hero.titleLine3')}
              </span>
              <span className="hero__line grad-text" style={{ '--i': 3 }}>
                {t('hero.titleLine4')}
              </span>
            </h1>

            <p className="hero__lead" style={{ '--i': 4 }}>
              {t('hero.lead')}
            </p>

            <div className="hero__actions" style={{ '--i': 5 }}>
              <a href="#contacto" className="btn btn--primary btn--rect">
                {t('hero.primaryCta')}
              </a>
              <a href="#proceso" className="btn btn--ghost btn--rect">
                {t('hero.secondaryCta')}
              </a>
            </div>
          </div>
        </div>

        <div className="hero__hint" aria-hidden="true">
          <span>{t('hero.hint')}</span>
          <IconChevronUp className="hero__hint-arrow" />
        </div>

        {/* Barra fina de precarga: desaparece cuando terminó */}
        <div
          className={`hero__loader ${loaded >= 1 ? 'is-done' : ''}`}
          style={{ '--loaded': loaded }}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
