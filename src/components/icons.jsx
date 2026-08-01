/* ============================================================
   Set de iconos — todos heredan `currentColor`.
   Trazo fino y uniforme para mantener la coherencia visual.
   ============================================================ */

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconStar = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.2l2.6 5.5 5.9.8-4.3 4.2 1 6-5.2-2.8-5.2 2.8 1-6L3.5 9.5l5.9-.8z" fill="currentColor" stroke="none" />
  </svg>
)

/* ---- Iconos de servicios: uno por card, ligados a lo que dice el texto ---- */

/* Se dibujan a 22px: pocas formas y bien separadas, si no se empastan. */

/** Diseño UI/UX: lienzo con panel lateral y cursor */
export const IconArtboard = (p) => (
  <svg {...base} {...p} strokeWidth="1.6">
    <rect x="3" y="4.4" width="18" height="15.2" rx="2.8" />
    <path d="M9.2 4.4v15.2" />
    <path d="M12.5 9l6 5-2.9.6-.8 2.8z" fill="currentColor" strokeWidth="1.3" />
  </svg>
)

/** Desarrollo Web: ventana de navegador con etiquetas de código */
export const IconBrowserCode = (p) => (
  <svg {...base} {...p} strokeWidth="1.6">
    <rect x="2.8" y="4.4" width="18.4" height="15.2" rx="2.8" />
    <path d="M2.8 8.7h18.4" />
    <path d="M9.7 16.6L6.8 13.4 9.7 10.2" />
    <path d="M14.3 10.2l2.9 3.2-2.9 3.2" />
  </svg>
)

/** Optimización: velocímetro con la aguja arriba */
export const IconSpeedometer = (p) => (
  <svg {...base} {...p} strokeWidth="1.6">
    <path d="M3.2 17.8a8.8 8.8 0 1 1 17.6 0" />
    <path d="M12 17.8l4.7-5.5" />
    <circle cx="12" cy="17.8" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

/** Mantenimiento: escudo con engranaje */
export const IconShieldGear = (p) => (
  <svg {...base} {...p} strokeWidth="1.6">
    <path d="M12 3l7.1 2.9v5.3c0 4.3-2.9 8-7.1 9.6-4.2-1.6-7.1-5.3-7.1-9.6V5.9z" />
    <circle cx="12" cy="11.5" r="2.5" />
    <path d="M12 7.5v1.5M12 14v1.5M8 11.5h1.5M14.5 11.5H16" />
  </svg>
)

export const IconRocket = (p) => (
  <svg {...base} {...p}>
    <path d="M5.5 14.5c-1.6.7-2 3-2.1 4.6 1.6-.1 3.9-.5 4.6-2.1" />
    <path d="M9.5 16.5l-2-2c.6-3 2-5.6 4.2-7.6C14.4 4.6 17.5 3.6 20.4 4c.4 2.9-.6 6-2.9 8.7-2 2.2-4.6 3.6-7.6 4.2z" />
    <circle cx="14.8" cy="9.2" r="1.5" />
  </svg>
)

export const IconSparkle = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />
  </svg>
)

export const IconCheckSquare = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M8 12.2l2.7 2.6L16 9.4" />
  </svg>
)

export const IconFile = (p) => (
  <svg {...base} {...p}>
    <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
    <path d="M13.5 3v5.5H19" />
  </svg>
)

export const IconUsers = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.2 2.7-5.2 6-5.2s6 2 6 5.2" />
    <path d="M16 5.2A3.2 3.2 0 0 1 16 11.4M17.5 14.4c2.1.6 3.5 2.2 3.5 4.4" />
  </svg>
)

export const IconCheckCircle = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.2 12.3l2.6 2.5 5-5.2" />
  </svg>
)

export const IconBulb = (p) => (
  <svg {...base} {...p}>
    <path d="M9.2 17.5h5.6M10 20.5h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z" />
  </svg>
)

export const IconPalette = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21a9 9 0 1 1 9-9c0 1.9-1.6 2.6-3 2.6h-1.6a2 2 0 0 0-1.4 3.4c.4.5.3 1.3-.3 1.6-.8.3-1.7.4-2.7.4z" />
    <circle cx="8" cy="12.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="9.8" cy="8.6" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="14.2" cy="8.2" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

export const IconCode = (p) => (
  <svg {...base} {...p}>
    <path d="M14.5 3.2H7.2A2.2 2.2 0 0 0 5 5.4v13.2a2.2 2.2 0 0 0 2.2 2.2h9.6a2.2 2.2 0 0 0 2.2-2.2V7.8z" />
    <path d="M14.5 3.2v4.6H19" />
    <path d="M10.4 12.4L8.8 14l1.6 1.6M13.6 12.4L15.2 14l-1.6 1.6" />
  </svg>
)

export const IconGauge = (p) => (
  <svg {...base} {...p}>
    <path d="M4 17a8 8 0 1 1 16 0" />
    <path d="M12 17l3.6-4.4" />
    <circle cx="12" cy="17" r="1.4" fill="currentColor" stroke="none" />
  </svg>
)

export const IconShield = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l7 3v5.5c0 4.2-2.9 7.9-7 9.5-4.1-1.6-7-5.3-7-9.5V6z" />
    <path d="M9 12.2l2.2 2.2 4-4.3" />
  </svg>
)

export const IconLayers = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.2l8.4 4.3L12 11.8 3.6 7.5z" />
    <path d="M3.6 12.2L12 16.5l8.4-4.3M3.6 16.6L12 20.9l8.4-4.3" />
  </svg>
)

export const IconMail = (p) => (
  <svg {...base} {...p}>
    <rect x="2.8" y="5" width="18.4" height="14" rx="2.6" />
    <path d="M3.6 7.2l7.3 5.1a2 2 0 0 0 2.2 0l7.3-5.1" />
  </svg>
)

export const IconPhone = (p) => (
  <svg {...base} {...p}>
    <path d="M7.5 3.5h-2A2.5 2.5 0 0 0 3 6.2c.4 8.1 6.7 14.4 14.8 14.8a2.5 2.5 0 0 0 2.7-2.5v-2a1.6 1.6 0 0 0-1.3-1.6l-2.6-.5a1.6 1.6 0 0 0-1.6.7l-.7 1.1a12.6 12.6 0 0 1-5.5-5.5l1.1-.7a1.6 1.6 0 0 0 .7-1.6l-.5-2.6a1.6 1.6 0 0 0-1.6-1.3z" />
  </svg>
)

export const IconPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21.2c4.2-4.3 6.3-7.7 6.3-10.3a6.3 6.3 0 0 0-12.6 0c0 2.6 2.1 6 6.3 10.3z" />
    <circle cx="12" cy="10.6" r="2.4" />
  </svg>
)

export const IconArrowRight = (p) => (
  <svg {...base} {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </svg>
)

export const IconArrowUpRight = (p) => (
  <svg {...base} {...p}>
    <path d="M7 17L17 7M8.5 7H17v8.5" />
  </svg>
)

export const IconChevronUp = (p) => (
  <svg {...base} {...p} strokeWidth="2.2">
    <path d="M6 14.5l6-6 6 6" />
  </svg>
)

export const IconMenu = (p) => (
  <svg {...base} {...p} strokeWidth="2">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const IconClose = (p) => (
  <svg {...base} {...p} strokeWidth="2">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

/* --- Marca Astravia: planeta con anillo --- */
export const IconPlanet = (p) => (
  <svg {...base} {...p} strokeWidth="1.6">
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" opacity="0.85" />
    <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(-22 12 12)" opacity="0.7" />
  </svg>
)

/* ============================================================
   Logos de tecnologías (versiones simplificadas, monocromo)
   ============================================================ */

const brand = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 48 48',
  'aria-hidden': true,
}

export const LogoWordPress = (p) => (
  <svg {...brand} {...p}>
    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.4" />
    <circle cx="24" cy="24" r="16.2" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
    <text
      x="24"
      y="31.5"
      textAnchor="middle"
      fontFamily="Poppins, sans-serif"
      fontSize="17"
      fontWeight="700"
      fill="currentColor"
    >
      W
    </text>
  </svg>
)

export const LogoElementor = (p) => (
  <svg {...brand} {...p}>
    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2.4" />
    <rect x="16" y="15" width="3.6" height="18" fill="currentColor" />
    <rect x="23.5" y="15" width="9" height="3.6" fill="currentColor" />
    <rect x="23.5" y="22.2" width="9" height="3.6" fill="currentColor" />
    <rect x="23.5" y="29.4" width="9" height="3.6" fill="currentColor" />
  </svg>
)

export const LogoWooCommerce = (p) => (
  <svg {...brand} {...p}>
    <path
      d="M6 11h36a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H27l-6 6 1.2-6H6a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <path
      d="M10 19l3 8 3-8 3 8 3-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="31" cy="23" r="2" fill="currentColor" />
    <circle cx="37.5" cy="23" r="2" fill="currentColor" />
  </svg>
)

export const LogoHtml5 = (p) => (
  <svg {...brand} {...p}>
    <path
      d="M8 4h32l-3 34-13 6-13-6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <text
      x="24"
      y="30"
      textAnchor="middle"
      fontFamily="Poppins, sans-serif"
      fontSize="15"
      fontWeight="700"
      fill="currentColor"
    >
      5
    </text>
  </svg>
)

export const LogoCss3 = (p) => (
  <svg {...brand} {...p}>
    <path
      d="M8 4h32l-3 34-13 6-13-6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <text
      x="24"
      y="30"
      textAnchor="middle"
      fontFamily="Poppins, sans-serif"
      fontSize="15"
      fontWeight="700"
      fill="currentColor"
    >
      3
    </text>
  </svg>
)

export const LogoJavascript = (p) => (
  <svg {...brand} {...p}>
    <rect
      x="5"
      y="5"
      width="38"
      height="38"
      rx="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
    />
    <text
      x="24"
      y="31"
      textAnchor="middle"
      fontFamily="Poppins, sans-serif"
      fontSize="16"
      fontWeight="700"
      fill="currentColor"
    >
      JS
    </text>
  </svg>
)

export const LogoReact = (p) => (
  <svg {...brand} {...p}>
    <circle cx="24" cy="24" r="4" fill="currentColor" />
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="24" cy="24" rx="20" ry="7.6" />
      <ellipse cx="24" cy="24" rx="20" ry="7.6" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="20" ry="7.6" transform="rotate(120 24 24)" />
    </g>
  </svg>
)

export const LogoTailwind = (p) => (
  <svg {...brand} {...p}>
    <path
      d="M14 22c1.6-6.4 5.6-9.6 12-9.6 9.6 0 10.8 7.2 15.6 8.4 3.2.8 6-.4 8.4-3.6-1.6 6.4-5.6 9.6-12 9.6-9.6 0-10.8-7.2-15.6-8.4-3.2-.8-6 .4-8.4 3.6z"
      transform="translate(-6 2) scale(0.92)"
      fill="currentColor"
    />
    <path
      d="M14 22c1.6-6.4 5.6-9.6 12-9.6 9.6 0 10.8 7.2 15.6 8.4 3.2.8 6-.4 8.4-3.6-1.6 6.4-5.6 9.6-12 9.6-9.6 0-10.8-7.2-15.6-8.4-3.2-.8-6 .4-8.4 3.6z"
      transform="translate(-1 13) scale(0.92)"
      fill="currentColor"
    />
  </svg>
)
