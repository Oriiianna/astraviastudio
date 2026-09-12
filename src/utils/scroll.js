// Actualiza la URL vía pushState (no navigate()) para no disparar el efecto
// ScrollToHash de App.jsx, que debe reaccionar solo a navegación entre páginas.

export function scrollToHash(hash) {
  window.history.pushState(null, '', hash)
  const element = document.querySelector(hash)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

export function scrollToTop() {
  window.history.pushState(null, '', '/')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
