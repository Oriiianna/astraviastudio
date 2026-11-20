import { useTranslation } from "react-i18next";
import { useProyectos } from "../hooks/useProyectos.js";
import { IconArrowRight } from "./icons.jsx";
import "./Clients.css";

/* Los proyectos se cargan desde el panel (/admin → Supabase). Si no hay
   conexión se usa src/data/proyectos.json como respaldo. El orden de la
   lista es el orden en pantalla. */

export default function Clients() {
  const { t, i18n } = useTranslation();
  const PROYECTOS = useProyectos({ soloDestacados: true });
  const idioma = i18n.resolvedLanguage === "en" ? "en" : "es";

  return (
    <section className="clients section grain" id="clientes">
      <div className="container container--full">
        <header className="clients__head">
          <div>
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
            const copy = (campo) => proyecto[idioma]?.[campo] || proyecto.es?.[campo] || "";

            return (
              <article
                className="project project--card"
                key={proyecto.slug}
                style={{ "--accent": proyecto.accent || "#7c3aed" }}
                data-reveal
                data-spotlight
              >
                <a
                  className="project__thumb"
                  href={proyecto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('clients.openInNewTab', { label: t('clients.viewSite'), title: copy('title') })}
                >
                  <img
                      className="project__shot"
                      src={proyecto.imagen}
                      srcSet={
                        proyecto.imagenMovil
                          ? `${proyecto.imagenMovil} 720w, ${proyecto.imagen} 1240w`
                          : undefined
                      }
                      sizes="(max-width: 940px) 92vw, 44vw"
                      alt={copy('alt')}
                      width="1240"
                      height="1550"
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
                      aria-label={t('clients.openInNewTab', { label: t('clients.viewSite'), title: copy('title') })}
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
