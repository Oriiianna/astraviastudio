import { useTranslation } from "react-i18next";
import { IconArrowRight, LogoReact, LogoTailwind, LogoCss3, LogoFramer, LogoReactRouter } from "./icons.jsx";
import "./Clients.css";

const TECH_ICONS = {
  "React": LogoReact,
  "Tailwind": LogoTailwind,
  "Framer Motion": LogoFramer,
  "React Router": LogoReactRouter,
  "CSS puro": LogoCss3,
};

/* Capturas reales de los sitios, generadas por scripts/capture-proyectos.mjs
  y optimizadas por scripts/optimize-proyectos.mjs → public/proyectos/.
   Son tiras verticales de dos pantallas: la tarjeta las recorre al hover. */
const PROYECTOS = [
  {
    slug: "sendero",
    i18nKey: "sendero",
    url: "https://sendero-kappa.vercel.app/",
    // El unico sin Tailwind: estila con CSS puro y tokens propios.
    stack: ["React", "CSS puro", "Framer Motion"],
    accent: "#7c3aed",
  },
  {
    slug: "serena",
    i18nKey: "serena",
    url: "https://astraviastudio-serena.vercel.app/",
    stack: ["React", "Tailwind", "Framer Motion"],
    accent: "#7c3aed",
  },
  {
    slug: "nordica",
    // El slug nombra el archivo de la captura; la clave i18n es otra cosa.
    i18nKey: "nordica",
    url: "https://astraviastudio-nordica.vercel.app/",
    stack: ["React", "Tailwind", "Framer Motion"],
    accent: "#7c3aed",
  },
  {
    slug: "sonrisa-elite",
    i18nKey: "sonrisaelite",
    url: "https://astraviastudio-sonrisaelite.vercel.app/",
    stack: ["React", "Tailwind", "Framer Motion", "React Router"],
    accent: "#7c3aed",
  },
  {
    slug: "altamira",
    i18nKey: "altamira",
    url: "https://astraviastudio-inmobiliaria.vercel.app/",
    stack: ["React", "Tailwind", "Framer Motion", "React Router"],
    accent: "#7c3aed",
  },
  {
    slug: "oscuro-cafe",
    i18nKey: "oscuroCafe",
    url: "https://astraviastudio-oscurocafe.vercel.app/",
    stack: ["React", "Tailwind", "Framer Motion", "React Router"],
    accent: "#7c3aed",
  }
];

export default function Clients() {
  const { t } = useTranslation();

  return (
    <section className="clients section grain" id="clientes">
      <div className="container container--full">
        <header className="clients__head">
          <div data-reveal>
            <span className="kicker">{t('clients.kicker')}</span>
            <h2>{t('clients.title')}</h2>
            <p>{t('clients.description')}</p>
          </div>

          <a
            href="#proceso"
            className="btn btn--ghost"
            data-reveal
            style={{ "--delay": "120ms" }}
          >
            {t('clients.cta')}
          </a>
        </header>

        <div className="clients__lista">
          {PROYECTOS.map((proyecto) => {
            const copy = (campo) => t(`clients.projects.${proyecto.i18nKey}.${campo}`);

            return (
              <article
                className="project project--card"
                key={proyecto.slug}
                style={{ "--accent": proyecto.accent }}
                data-reveal
                data-spotlight
              >
                <a
                  className="project__thumb"
                  href={proyecto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('clients.openInNewTab', { title: copy('title') })}
                >
                  <span className="project__chrome" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <em>{copy('domain')}</em>
                  </span>

                  <span className="project__viewport">
                    <img
                      className="project__shot"
                      src={`/proyectos/${proyecto.slug}.webp`}
                      srcSet={`/proyectos/${proyecto.slug}-sm.webp 720w, /proyectos/${proyecto.slug}.webp 1240w`}
                      sizes="(max-width: 940px) 92vw, 44vw"
                      alt={copy('alt')}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                </a>

                <div className="project__content">
                  <div className="project__header">
                    <div className="project__header-left">
                      <span className="project__tag">{copy('tag')}</span>
                      <ul className="project__stack">
                        {proyecto.stack.map((tec) => {
                          const Icono = TECH_ICONS[tec];
                          return (
                            <li key={tec} data-tooltip={tec}>
                              {Icono && <Icono />}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <h3>{copy('title')}</h3>
                  </div>

                  <a
                    className="btn btn--primary btn--rect project__cta"
                    href={proyecto.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('clients.viewSite')} <IconArrowRight />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
