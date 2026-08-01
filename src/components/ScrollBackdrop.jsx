import { useCallback, useEffect, useRef, useState } from 'react'
import useFrameSequence from '../hooks/useFrameSequence.js'
import manifest from '../../public/fondo/manifest.json'
import './ScrollBackdrop.css'

const frameUrl = (set, i) => `/fondo/${set}/frame-${String(i + 1).padStart(3, '0')}.webp`

/**
 * Fondo de Vía Láctea que avanza con el scroll desde la sección de Servicios
 * hasta el final de la página.
 *
 * El canvas va fijo al viewport, detrás de todo. Durante el hero está en
 * opacidad 0 (ahí manda el render del hero) y entra progresivamente al llegar
 * a Servicios, que es donde el usuario pidió que arranque.
 */
export default function ScrollBackdrop({ startSelector = '#servicios' }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const startRef = useRef(null)
  const [ready, setReady] = useState(false)

  // useFrameSequence necesita un ref a un elemento del DOM; acá el "elemento"
  // es la sección donde arranca el fondo, que vive en otro componente.
  useEffect(() => {
    startRef.current = document.querySelector(startSelector)
    setReady(!!startRef.current)
  }, [startSelector])

  const handleProgress = useCallback((p) => {
    const wrap = wrapRef.current
    if (!wrap) return
    // Entra durante el primer 10% del recorrido y después se sostiene
    wrap.style.setProperty('--backdrop', Math.min(1, p / 0.1).toFixed(3))
  }, [])

  useFrameSequence({
    canvasRef,
    sectionRef: startRef,
    frames: manifest.frames,
    frameUrl,
    sets: { query: '(max-width: 860px)', small: 'w760', large: 'w1280' },
    fit: 'cover',
    mode: 'page',
    concurrency: 3, // baja prioridad: no debe competir con los frames del hero
    startDelay: 1800,
    onProgress: handleProgress,
    enabled: ready,
  })

  return (
    <div className="backdrop" ref={wrapRef} aria-hidden="true">
      <canvas className="backdrop__canvas" ref={canvasRef} />
      <div className="backdrop__tint" />
    </div>
  )
}
