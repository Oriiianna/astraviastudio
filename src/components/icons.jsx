/* ============================================================
   Set de iconos — puente (facade) hacia react-icons.
   ------------------------------------------------------------
   Todos los componentes siguen importando desde './icons.jsx'
   y acá se re-exporta el set Lucide (Lu) para la interfaz y
   Simple Icons (Si) para los logos de marca, con los mismos
   nombres de siempre para no tocar los componentes.

   Los SVGs de react-icons heredan `currentColor` y aceptan
   className/tamaño, igual que los viejos inline custom.
   ============================================================ */

import {
  LuStar,
  LuLayoutPanelLeft,
  LuSquareCode,
  LuGauge,
  LuShieldCheck,
  LuRocket,
  LuCircleCheck,
  LuChevronDown,
  LuChevronUp,
  LuArrowRight,
  LuArrowUpRight,
  LuMenu,
  LuX,
  LuMail,
  LuPhone,
  LuMapPin,
  LuCode,
  LuShield,
  LuLayers,
  LuLightbulb,
  LuPalette,
  LuOrbit,
  LuSendHorizontal,
  LuZap,
  LuLayoutDashboard,
} from 'react-icons/lu'


import {
  SiWordpress,
  SiElementor,
  SiWoocommerce,
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiWhatsapp,
} from 'react-icons/si'

/* ---- Iconos de servicios: uno por card, ligados a lo que dice el texto ---- */

/** Diseño UI/UX: lienzo con panel lateral y cursor */
export const IconArtboard = LuLayoutPanelLeft

/** Desarrollo Web: ventana de navegador con etiquetas de código */
export const IconBrowserCode = LuSquareCode

/** Optimización: velocímetro con la aguja arriba */
export const IconSpeedometer = LuGauge

/** Mantenimiento: escudo con check (no existe "escudo+engranaje" en Lucide) */
export const IconShieldGear = LuShieldCheck

export const IconRocket = LuRocket
export const IconStar = LuStar

export const IconCheckCircle = LuCircleCheck

/** Chevron hacia abajo: control de apertura de selects y acordeones */
export const IconChevronDown = LuChevronDown

export const IconBulb = LuLightbulb
export const IconPalette = LuPalette
export const IconCode = LuCode
export const IconGauge = LuGauge
export const IconShield = LuShield
export const IconLayers = LuLayers
export const IconMail = LuMail
export const IconPhone = LuPhone
export const IconPin = LuMapPin
export const IconArrowRight = LuArrowRight
export const IconArrowUpRight = LuArrowUpRight

export const IconChevronUp = LuChevronUp
export const IconMenu = LuMenu
export const IconClose = LuX

/* --- Marca Astravia: planeta con anillo --- */
export const IconPlanet = LuOrbit

/* ============================================================
   Logos de tecnologías (Simple Icons, versión oficial)
   ============================================================ */

export const LogoWordPress = SiWordpress
export const LogoElementor = SiElementor
export const LogoWooCommerce = SiWoocommerce
export const LogoHtml5 = SiHtml5
export const LogoCss3 = SiCss
export const LogoJavascript = SiJavascript
export const LogoReact = SiReact
export const LogoTailwind = SiTailwindcss

export const IconSend = LuSendHorizontal

export const IconWhatsApp = SiWhatsapp

/** Rayo: arranque rapido con energia */
export const IconZap = LuZap

/** Dashboard: vista general del proceso de trabajo */
export const IconDashboard = LuLayoutDashboard
