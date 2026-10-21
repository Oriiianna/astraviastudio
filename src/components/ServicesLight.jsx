import { useTranslation } from "react-i18next";
import {
  IconArtboard,
  IconBrowserCode,
  IconSupport,
  IconArrowRight,
} from "./icons.jsx";
import "./ServicesLight.css";
import servicesImg from "../recursos/services-img.webp";

const SERVICES = [
  { Icon: IconArtboard, accent: "#7c3aed", key: "one" },
  { Icon: IconBrowserCode, accent: "#9b6cf5", key: "two" },
  { Icon: IconSupport, accent: "#8b9cf7", key: "three" },
];

export default function ServicesLight() {
  const { t } = useTranslation();

  return (
    <section
      className="services-light section section--after-hero grain"
      id="servicios"
    >
      <div className="container container--full">
        <div className="services-light__grid">
          {/* Left column: service cards */}
          <div className="services-light__cards">
            {SERVICES.map(({ Icon, accent, key }, i) => (
              <article
                className="services-light__card glass-card gradient-border"
                style={{ "--accent": accent, "--delay": `${i * 110}ms` }}
                data-reveal
                data-spotlight
                key={key}
              >
                <span className="services-light__card-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="services-light__card-icon">
                  <Icon />
                </div>

                <div className="services-light__card-content">
                  <h3>{t(`services.items.${key}.title`)}</h3>
                  <p>{t(`services.items.${key}.text`)}</p>

                  <a href="#contacto" className="services-light__card-link">
                    {t("servicesLight.link")}
                    <IconArrowRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Right column: intro + visual */}
          <div className="services-light__intro">
            <span className="kicker" data-reveal>{t("servicesLight.kicker")}</span>

            <h2 data-reveal="wipe" style={{ "--delay": "90ms" }}>
              {t("servicesLight.title")}
              <br />
              <span className="grad-text">
                {t("servicesLight.titleHighlight")}
              </span>
            </h2>

            <p
              className="services-light__description"
              data-reveal
              style={{ "--delay": "180ms" }}
            >
              {t("servicesLight.description")}
            </p>

            <div
              className="services-light__visual"
              data-reveal
              style={{ "--delay": "270ms" }}
            >
              <img
                src={servicesImg}
                alt={t("servicesLight.alt")}
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
