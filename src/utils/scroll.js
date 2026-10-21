// Actualiza la URL vía pushState (no navigate()) para no disparar el efecto
// ScrollToHash de App.jsx, que debe reaccionar solo a navegación entre páginas.

export function scrollToHash(hash) {
  window.history.pushState(null, '', hash)
  const element = document.querySelector(hash)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Scroll animado propio: el `behavior: 'smooth'` nativo se corta a mitad de
// camino en celulares cuando la página es larga (cambios de layout, imágenes
// diferidas, inercia del dedo). Aquí cada frame fija la posición, la duración
// queda acotada y cualquier gesto del usuario cancela la animación.
export function scrollToY(top, maxDuration = 900) {
  const start = window.scrollY
  const distance = top - start
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || Math.abs(distance) < 2) {
    window.scrollTo({ top, behavior: 'instant' })
    return
  }

  const duration = Math.min(maxDuration, 300 + Math.abs(distance) / 6)
  const t0 = performance.now()
  let frame = 0

  const cancel = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('touchstart', cancel)
    window.removeEventListener('wheel', cancel)
  }
  window.addEventListener('touchstart', cancel, { passive: true })
  window.addEventListener('wheel', cancel, { passive: true })

  const step = (now) => {
    const p = Math.min(1, (now - t0) / duration)
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    window.scrollTo({ top: start + distance * eased, behavior: 'instant' })
    if (p < 1) frame = requestAnimationFrame(step)
    else cancel()
  }
  frame = requestAnimationFrame(step)
}

export function scrollToTop() {
  // Misma página sin #hash: conserva el prefijo de idioma (/es, /en).
  window.history.pushState(null, '', window.location.pathname)
  scrollToY(0)
}
