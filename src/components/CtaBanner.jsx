import { useRef } from 'react'
import { IconArrowRight } from './icons.jsx'
import useFrameSequence from '../hooks/useFrameSequence.js'
import manifest from '../../public/astronauta/manifest.json'
import './CtaBanner.css'

const frameUrl = (set, i) => `/astronauta/${set}/frame-${String(i + 1).padStart(3, '0')}.webp`

export default function CtaBanner() {
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
            Tu web puede ser tu mejor <span className="cta__accent">vendedor.</span>
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
              <p>
                Deja de perder clientes por una web lenta o confusa y empieza a convertir visitas en
                oportunidades.
              </p>
              <a href="#contacto" className="btn btn--primary cta__btn">
                Empezar mi proyecto <IconArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
