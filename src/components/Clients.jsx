import { useTranslation } from "react-i18next";
import { IconArrowRight } from "./icons.jsx";
import "./Clients.css";

/* Capturas reales de los sitios, generadas por scripts/capture-proyectos.mjs
  y optimizadas por scripts/optimize-proyectos.mjs → public/proyectos/.
   La tarjeta muestra la primera pantalla de cada tira (16:9, alineada arriba). */
const PROYECTOS = [
  {
    slug: "sendero",
    i18nKey: "sendero",
    url: "https://sendero-kappa.vercel.app/",
    accent: "#7c3aed",
  },
  {
    slug: "serena",
    i18nKey: "serena",
    url: "https://astraviastudio-serena.vercel.app/",
    accent: "#7c3aed",
  },
  {
    slug: "nordica",
    // El slug nombra el archivo de la captura; la clave i18n es otra cosa.
    i18nKey: "nordica",
    url: "https://astraviastudio-nordica.vercel.app/",
    accent: "#7c3aed",
  },
  {
    slug: "sonrisa-elite",
    i18nKey: "sonrisaelite",
    url: "https://astraviastudio-sonrisaelite.vercel.app/",
    accent: "#7c3aed",
  },
  {
    slug: "altamira",
    i18nKey: "altamira",
    url: "https://astraviastudio-inmobiliaria.vercel.app/",
    accent: "#7c3aed",
  },
  {
    slug: "oscuro-cafe",
    i18nKey: "oscuroCafe",
    url: "https://astraviastudio-oscurocafe.vercel.app/",
    accent: "#7c3aed",
  }
];

export default function Clients() {
  const { t } = useTranslation();

  return (
    <section className="clients section grain" id="clientes">
      <div className="container container--full">
        <header className="clients__head">
          <div>
            <span className="kicker" data-reveal>{t('clients.kicker')}</span>
            <h2 data-reveal="wipe" style={{ "--delay": "90ms" }}>{t('clients.title')}</h2>
            <p data-reveal style={{ "--delay": "180ms" }}>{t('clients.description')}</p>
          </div>

          <a
            href="#contacto"
            className="btn btn--ghost"
            data-reveal
            style={{ "--delay": "240ms" }}
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
                  <img
                      className="project__shot"
                      src={`/proyectos/${proyecto.slug}.webp`}
                      srcSet={`/proyectos/${proyecto.slug}-sm.webp 720w, /proyectos/${proyecto.slug}.webp 1240w`}
                      sizes="(max-width: 940px) 92vw, 44vw"
                      alt={copy('alt')}
                      loading="lazy"
                      decoding="async"
                  />
                </a>

                <div className="project__content">
                  <div className="project__meta">
                    <span className="project__tag">{copy('category')}</span>
                    <a
                      className="project__cta"
                      href={proyecto.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('clients.openInNewTab', { title: copy('title') })}
                    >
                      {t('clients.viewSite')}
                      <IconArrowRight aria-hidden="true" />
                    </a>
                  </div>
                  <h3 className="project__title">{copy('title')}</h3>
                  <p className="project__blurb">{copy('blurb')}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
