import { useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './ServicesLight.css'

const SERVICES = [
  { key: 'one', number: '01', accent: '#7c3aed', image: '/proyectos/serena.webp' },
  { key: 'two', number: '02', accent: '#9b6cf5', image: '/proyectos/altamira.webp' },
  { key: 'three', number: '03', accent: '#8b9cf7', image: '/proyectos/sendero.webp' },
  { key: 'four', number: '04', accent: '#7ec4ef', image: '/proyectos/oscuro-cafe.webp' },
]

const DEFAULT_IMAGE = '/proyectos/sendero.webp'
const EASE = [0.16, 1, 0.3, 1]

const leftVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
}

const kickerVariants = {
  hidden: { opacity: 0, x: -26, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
}

const titleVariants = {
  hidden: { opacity: 0, y: 44, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE },
  },
}

const descVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const thumbVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 32 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
}

const cardVariants = {
  hidden: { opacity: 0, x: 64, scale: 0.92, rotate: 1.5 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 240, damping: 23, mass: 0.9 },
  },
}

export default function ServicesLight({ imageSrc }) {
  const { t } = useTranslation()
  const [openKey, setOpenKey] = useState(null)

  const active = SERVICES.find((s) => s.key === openKey) || null
  const currentImage = active?.image || imageSrc || DEFAULT_IMAGE

  const toggle = (key) => setOpenKey((prev) => (prev === key ? null : key))

  return (
    <MotionConfig reducedMotion="user">
      <section className="services-light section grain" id="servicios-ai">
        <div className="container services-light__layout">
          {/* ---- Columna izquierda ---- */}
          <motion.div
            className="services-light__left"
            variants={leftVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span variants={kickerVariants} className="kicker">
              {t('services.kicker')}
            </motion.span>

            <motion.h2 variants={titleVariants} className="services-light__title">
              {t('services.title')}
            </motion.h2>

            <motion.p variants={descVariants} className="services-light__desc">
              {t('services.description')}
            </motion.p>

            <motion.figure variants={thumbVariants} className="services-light__thumb">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={active ? t(`services.items.${active.key}.title`) : t('services.kicker')}
                  loading="eager"
                  decoding="async"
                  className="services-light__thumb-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                />
              </AnimatePresence>

              <span className="services-light__thumb-tag">
                {active ? `${active.number} · ${t(`services.items.${active.key}.title`)}` : t('services.kicker')}
              </span>
            </motion.figure>
          </motion.div>

          {/* ---- Columna derecha ---- */}
          <motion.ul
            className="services-light__list"
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2, margin: '-60px' }}
          >
            {SERVICES.map((service) => {
              const open = openKey === service.key
              return (
                <motion.li
                  key={service.key}
                  className={`services-light__card${open ? ' is-open' : ''}`}
                  style={{ '--accent': service.accent }}
                  variants={cardVariants}
                  whileHover={{ y: open ? -2 : -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                >
                  <button
                    type="button"
                    className="services-light__trigger"
                    onClick={() => toggle(service.key)}
                    aria-expanded={open}
                    aria-controls={`panel-${service.key}`}
                  >
                    <span className="services-light__name">
                      {t(`services.items.${service.key}.title`)}
                    </span>

                    <span className="services-light__side">
                      <span className="services-light__num">{service.number}</span>
                      <ChevronDown
                        className="services-light__chevron"
                        size={20}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`panel-${service.key}`}
                        className="services-light__panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.34, ease: [0.22, 0.7, 0.24, 1] }}
                      >
                        <p className="services-light__text">
                          {t(`services.items.${service.key}.text`)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              )
            })}
          </motion.ul>
        </div>
      </section>
    </MotionConfig>
  )
}