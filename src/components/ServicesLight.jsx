import { useTranslation } from "react-i18next";
import {
  IconArtboard,
  IconBrowserCode,
  IconSpeedometer,
} from "./icons.jsx";
import "./ServicesLight.css";
import servicesImg from "../recursos/services-img.webp";

const SERVICES = [
  { Icon: IconArtboard, accent: "#7c3aed", key: "one" },
  { Icon: IconBrowserCode, accent: "#9b6cf5", key: "two" },
  { Icon: IconSpeedometer, accent: "#8b9cf7", key: "three" },
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
                className="services-light__card gradient-border"
                style={{ "--accent": accent, "--delay": `${i * 110}ms` }}
                data-reveal
                data-spotlight
                key={key}
              >
                <div className="services-light__card-icon">
                  <Icon />
                </div>

                <div className="services-light__card-content">
                  <h3>{t(`services.items.${key}.title`)}</h3>
                  <p>{t(`services.items.${key}.text`)}</p>

                  <a href="#contacto" className="services-light__card-link">
                    {t("servicesLight.link")}
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Right column: intro + visual */}
          <div className="services-light__intro">
            <span className="kicker">{t("servicesLight.kicker")}</span>

            <h2>
              {t("servicesLight.title")}
              <br />
              <span className="grad-text">
                {t("servicesLight.titleHighlight")}
              </span>
            </h2>

            <p className="services-light__description">
              {t("servicesLight.description")}
            </p>

            <div className="services-light__visual">
              <img
                src={servicesImg}
                alt={t("servicesLight.alt")}
                width="1920"
                height="1280"
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
