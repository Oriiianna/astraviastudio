/* eslint-disable react-refresh/only-export-components -- envolver() devuelve componentes; el plugin no lo detecta */
/* ============================================================
   Set de iconos — puente (facade) del proyecto.
   ------------------------------------------------------------
   Interfaz: iconos animados de AnimateIcons (@animateicons/react).
   Logos de marca: Simple Icons (react-icons/si), porque AnimateIcons
   no trae WhatsApp, Google, WordPress, React, etc.

   Todos los componentes siguen importando desde './icons.jsx' con
   los mismos nombres de siempre. Cada icono sale envuelto por
   `envolver()`, que se encarga de:
     · ocultarlo a lectores de pantalla (son decorativos; los botones
       que solo tienen icono llevan aria-label),
     · hacer que la animación se dispare al pasar el mouse por el
       enlace/botón/tarjeta que lo contiene, no solo por el icono,
     · darle `display: inline-flex` (ver .ico en global.css).
   AnimateIcons respeta "reducir movimiento" por su cuenta.

   Los iconos animados se cargan aparte (iconosAnimados.js, import()
   diferido) para que no pesen en el JS inicial.
   ============================================================ */

import { useEffect, useRef, useState } from 'react'


import { SiWhatsapp } from 'react-icons/si'

// Elementos que, al pasarles el mouse por encima, hacen animar a los iconos que llevan dentro.
const ZONA_HOVER = 'a, button, [data-spotlight], [data-icon-hover]'

// Los iconos animados viven en otro chunk (iconosAnimados.js, ~33 KB gzip con motion).
// Se pide una sola vez, con la página ya pintada; hasta que llega, cada icono muestra un
// SVG vacío del mismo tamaño, así no hay saltos de diseño.
let modulo = null
let promesa = null
const cargar = () => (promesa ??= import('./iconosAnimados.js').then((m) => (modulo = m)))

function useModuloAnimado() {
  const [listo, setListo] = useState(modulo)
  useEffect(() => {
    if (listo) return
    const pedir = () => cargar().then(setListo)
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(pedir, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(pedir, 200)
    return () => clearTimeout(id)
  }, [listo])
  return listo
}

function envolver(nombre) {
  // alEntrar: además del hover, se anima UNA vez cuando el icono entra en pantalla
  // (gesto de entrada para los iconos grandes; no es un bucle).
  function Icono({ className, alEntrar = false, ...props }) {
    const anfitrion = useRef(null)
    const icono = useRef(null)
    const Animado = useModuloAnimado()?.[nombre]
    const entro = useRef(false) // ya se vio en pantalla
    const jugado = useRef(false) // ya hizo su animación de entrada

    const jugarEntrada = () => {
      if (jugado.current || !entro.current || !icono.current) return
      jugado.current = true
      icono.current.startAnimation()
    }

    useEffect(() => {
      if (!alEntrar || !('IntersectionObserver' in window)) return
      let espera
      const obs = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return
          entro.current = true
          obs.disconnect()
          // Espera a que termine la entrada de la tarjeta (data-reveal) antes de moverse.
          espera = setTimeout(jugarEntrada, 450)
        },
        { threshold: 0.6 }
      )
      obs.observe(anfitrion.current)
      return () => {
        obs.disconnect()
        clearTimeout(espera)
      }
    }, [alEntrar])

    // Si el módulo animado llega después de que el icono ya entró, juega en ese momento.
    useEffect(() => {
      if (Animado) setTimeout(jugarEntrada, 450)
    }, [Animado])

    useEffect(() => {
      const zona = anfitrion.current?.parentElement?.closest(ZONA_HOVER)
      if (!zona) return
      const entrar = () => icono.current?.startAnimation()
      const salir = () => icono.current?.stopAnimation()
      zona.addEventListener('mouseenter', entrar)
      zona.addEventListener('mouseleave', salir)
      zona.addEventListener('focusin', entrar)
      zona.addEventListener('focusout', salir)
      return () => {
        zona.removeEventListener('mouseenter', entrar)
        zona.removeEventListener('mouseleave', salir)
        zona.removeEventListener('focusin', entrar)
        zona.removeEventListener('focusout', salir)
      }
    }, [])

    return (
      <span
        ref={anfitrion}
        className={className ? `ico ${className}` : 'ico'}
        aria-hidden="true"
        {...props}
      >
        {Animado ? <Animado ref={icono} /> : <svg viewBox="0 0 24 24" aria-hidden="true" />}
      </span>
    )
  }
  Icono.displayName = `Icono(${nombre})`
  return Icono
}

/* ---- Iconos de servicios: uno por card, ligados a lo que dice el texto ---- */

/** Diseño UI/UX: lienzo con panel lateral y cursor */
export const IconArtboard = envolver('LayoutPanelLeft')

/** Desarrollo Web: ventana de navegador con etiquetas de código */
export const IconBrowserCode = envolver('SquareCode')

/** Optimización: velocímetro con la aguja arriba */
export const IconSpeedometer = envolver('Gauge')

/** Mantenimiento: escudo con check */
export const IconShieldGear = envolver('ShieldCheck')
export const IconSupport = envolver('LifeBuoy')

export const IconRocket = envolver('Rocket')
export const IconShoppingBag = envolver('ShoppingBag')
export const IconStar = envolver('Star')
export const IconPause = envolver('Pause')
export const IconPlay = envolver('Play')

export const IconCheckCircle = envolver('CircleCheck')

/** Chevron hacia abajo: control de apertura de selects y acordeones */
export const IconChevronDown = envolver('ChevronDown')

export const IconBulb = envolver('Lightbulb')
export const IconPalette = envolver('Palette')
export const IconCode = envolver('Code')
export const IconGauge = envolver('Gauge')
export const IconShield = envolver('Shield')
export const IconLayers = envolver('Layers')
export const IconMail = envolver('Mail')
export const IconPhone = envolver('Phone')
export const IconPin = envolver('MapPin')
export const IconArrowRight = envolver('ArrowRight')
export const IconArrowUpRight = envolver('ArrowUpRight')

export const IconChevronUp = envolver('ChevronUp')
export const IconMenu = envolver('Menu')
export const IconClose = envolver('X')

/* --- Marca Astravia: planeta con anillo --- */
export const IconPlanet = envolver('Orbit')

export const IconSend = envolver('SendHorizontal')

/** Rayo: arranque rapido con energia */
export const IconZap = envolver('Zap')

/** Dashboard: vista general del proceso de trabajo */
export const IconDashboard = envolver('LayoutDashboard')

/* --- Panel de administración --- */
export const IconCheck = envolver('Check')
export const IconArrowUp = envolver('ArrowUp')
export const IconArrowDown = envolver('ArrowDown')
export const IconArrowLeft = envolver('ArrowLeft')
export const IconChevronLeft = envolver('ChevronLeft')
export const IconChevronRight = envolver('ChevronRight')
export const IconAlertCircle = envolver('CircleAlert')
export const IconExternalLink = envolver('ExternalLink')
export const IconEye = envolver('Eye')
export const IconEyeOff = envolver('EyeOff')
export const IconImagePlus = envolver('ImagePlus')
export const IconLoader = envolver('LoaderCircle')
export const IconLogOut = envolver('LogOut')
export const IconPencil = envolver('Pencil')
export const IconPlus = envolver('Plus')
export const IconTrash = envolver('Trash2')

/* --- Redes sociales (animados) --- */
export const IconFacebook = envolver('Facebook')
export const IconInstagram = envolver('Instagram')

/* ============================================================
   Único logo de marca que queda: WhatsApp (Simple Icons, SVG de
   react-icons). AnimateIcons no lo trae y es el botón flotante,
   así que conviene el logo oficial reconocible.
   ============================================================ */

export const IconWhatsApp = SiWhatsapp
