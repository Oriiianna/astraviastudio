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
          {/* El intro va primero en el HTML para que el h2 preceda a los h3 de las
              tarjetas; el CSS lo muestra a la derecha en desktop. */}
          <div className="services-light__intro">
            <h2 data-reveal="wipe" style={{ "--delay": "90ms" }}>
              {t("servicesLight.title")}{" "}
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

          {/* Service cards */}
          <div className="services-light__cards">
            {SERVICES.map(({ Icon, accent, key }, i) => (
              <article
                className="services-light__card"
                style={{ "--accent": accent, "--delay": `${i * 110}ms` }}
                data-reveal
                data-icon-hover
                key={key}
              >
                <div className="services-light__card-icon">
                  <Icon alEntrar />
                </div>

                <div className="services-light__card-content">
                  <h3>{t(`services.items.${key}.title`)}</h3>
                  <p>{t(`services.items.${key}.text`)}</p>
                  <p className="services-light__detail">{t(`services.items.${key}.detail`)}</p>

                  <a href="#contacto" className="services-light__card-link">
                    {t("servicesLight.link")}
                    <IconArrowRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
