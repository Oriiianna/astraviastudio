import { useEffect } from 'react'

// Revela los elementos [data-reveal] al entrar en el viewport (el CSS vive en
// global.css). Si varios entran en la misma tanda, se escalonan solos con
// --stagger; un elemento que ya trae su propio --delay lo conserva.
export function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]')

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let orden = 0
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          if (!el.style.getPropertyValue('--delay')) {
            el.style.setProperty('--delay', `calc(${Math.min(orden, 4)} * var(--stagger))`)
            orden += 1
          }
          el.classList.add('is-visible')
          observer.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
