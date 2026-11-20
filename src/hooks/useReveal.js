import { useEffect } from 'react'

// Revela los elementos [data-reveal] al entrar en el viewport (el CSS vive en
// global.css). Si varios entran en la misma tanda, se escalonan solos con
// --stagger; un elemento que ya trae su propio --delay lo conserva.
//
// También vigila los elementos que aparecen DESPUÉS (por ejemplo, un proyecto
// cargado desde Supabase que no estaba en el respaldo del repo): sin esto
// quedaban con opacity 0 para siempre, porque nadie los observaba.
export function useReveal() {
  useEffect(() => {
    const todos = (raiz) => [
      ...(raiz.matches?.('[data-reveal]') ? [raiz] : []),
      ...raiz.querySelectorAll('[data-reveal]'),
    ]

    if (!('IntersectionObserver' in window)) {
      todos(document.body).forEach((el) => el.classList.add('is-visible'))
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

    todos(document.body).forEach((el) => observer.observe(el))

    // Elementos que React agrega más tarde (listas que llegan de la red).
    const vigilante = new MutationObserver((cambios) => {
      cambios.forEach((cambio) =>
        cambio.addedNodes.forEach((nodo) => {
          if (nodo.nodeType !== 1) return
          todos(nodo).forEach((el) => {
            if (!el.classList.contains('is-visible')) observer.observe(el)
          })
        }),
      )
    })
    vigilante.observe(document.body, { childList: true, subtree: true })

    return () => {
      vigilante.disconnect()
      observer.disconnect()
    }
  }, [])
}
