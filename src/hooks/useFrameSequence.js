import { useEffect, useRef, useState } from 'react'

/**
 * Motor de secuencias de frames atadas al scroll.
 *
 * Precarga los frames con concurrencia limitada, los dibuja en un <canvas>
 * según la posición de scroll y, mientras faltan frames, usa el más cercano
 * que ya esté cargado (así nunca se ve un hueco).
 *
 * mode:
 *   'sticky'  — la sección es más alta que el viewport y adentro hay un stage
 *               pegajoso. El progreso va de 0 a 1 mientras se recorre el sobrante.
 *   'through' — la sección tiene altura normal. El progreso va de 0 a 1 mientras
 *               la sección cruza el viewport.
 *   'page'    — el elemento marca DÓNDE arranca. El progreso va de 0 a 1 desde
 *               que ese punto se acerca al viewport hasta el final del documento.
 *               Sirve para fondos que acompañan varias secciones seguidas.
 *
 * Devuelve la fracción precargada (0→1) para poder mostrar un indicador.
 */
export default function useFrameSequence({
  canvasRef,
  sectionRef,
  frames,
  frameUrl,
  sets,
  fit = 'cover',
  alpha = false,
  mode = 'sticky',
  concurrency = 6,
  onProgress,
  enabled = true,
  startDelay = 0,
}) {
  const [loaded, setLoaded] = useState(0)

  // Se guarda en ref para que cambiar la callback no reinicie la precarga
  const onProgressRef = useRef(onProgress)
  onProgressRef.current = onProgress

  useEffect(() => {
    if (!enabled) return
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    const ctx = canvas.getContext('2d', { alpha })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const set = window.matchMedia(sets.query).matches ? sets.small : sets.large

    const images = new Array(frames)
    let currentFrame = -1
    let rafId = 0
    let cancelled = false

    /* ---------- Dibujo ---------- */

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(canvas.clientWidth * dpr)
      const h = Math.round(canvas.clientHeight * dpr)
      if (w === canvas.width && h === canvas.height) return
      canvas.width = w
      canvas.height = h
      currentFrame = -1 // fuerza el redibujado
    }

    // El frame pedido, o el más cercano que ya esté en memoria
    const pick = (i) => {
      if (images[i]) return images[i]
      for (let d = 1; d < frames; d++) {
        if (images[i - d]) return images[i - d]
        if (images[i + d]) return images[i + d]
      }
      return null
    }

    const paint = (index) => {
      const img = pick(index)
      if (!img || !canvas.width) return

      const { width: cw, height: ch } = canvas
      const iw = img.naturalWidth
      const ih = img.naturalHeight
      const scale = fit === 'contain' ? Math.min(cw / iw, ch / ih) : Math.max(cw / iw, ch / ih)
      const w = iw * scale
      const h = ih * scale

      if (alpha) ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    /* ---------- Progreso ---------- */

    const getProgress = () => {
      if (reduced) return 1

      if (mode === 'page') {
        const vh = window.innerHeight
        const start = Math.max(0, section.offsetTop - vh)
        const end = document.documentElement.scrollHeight - vh
        if (end <= start) return 0
        return Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)))
      }

      if (mode === 'through') {
        const rect = section.getBoundingClientRect()
        const vh = window.innerHeight
        // Arranca cuando la sección asoma por abajo y termina poco después de
        // que su borde superior pasa el techo del viewport.
        const travel = rect.height + vh * 0.65
        return Math.min(1, Math.max(0, (vh * 0.9 - rect.top) / travel))
      }

      const scrub = section.offsetHeight - window.innerHeight
      if (scrub <= 0) return 1
      return Math.min(1, Math.max(0, (window.scrollY - section.offsetTop) / scrub))
    }

    const render = () => {
      rafId = 0
      const progress = getProgress()
      onProgressRef.current?.(progress)

      const frame = Math.round(progress * (frames - 1))
      if (frame !== currentFrame) {
        currentFrame = frame
        paint(frame)
      }
    }

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(render)
    }

    /* ---------- Precarga ---------- */

    const loadFrame = (i) =>
      new Promise((resolve) => {
        const img = new Image()
        img.decoding = 'async'
        img.onload = () => {
          if (cancelled) return resolve()
          images[i] = img
          if (i === currentFrame) paint(i) // repinta nítido el frame actual
          resolve()
        }
        img.onerror = resolve
        img.src = frameUrl(set, i)
      })

    const preload = async () => {
      await loadFrame(0) // el primero manda: es lo que se ve al entrar
      if (cancelled) return
      resize()
      schedule()

      // Las secuencias que están más abajo en la página esperan un poco antes
      // de tragarse el ancho de banda: si las tres arrancan juntas compiten
      // con el hero, que es lo primero que ve el usuario.
      if (startDelay) {
        await new Promise((r) => setTimeout(r, startDelay))
        if (cancelled) return
      }

      let next = 1
      let done = 1
      const worker = async () => {
        while (!cancelled && next < frames) {
          const i = next++
          await loadFrame(i)
          done++
          // A saltos, para no re-renderizar React una vez por frame
          if (done % 8 === 0 || done === frames) setLoaded(done / frames)
        }
      }
      await Promise.all(Array.from({ length: concurrency }, worker))
    }

    const onResize = () => {
      resize()
      schedule()
    }

    resize()
    preload()

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
    }
    // El resto de las opciones son estáticas durante la vida del componente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  return loaded
}
