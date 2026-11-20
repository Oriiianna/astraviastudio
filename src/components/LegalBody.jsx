import { useTranslation } from "react-i18next";

// Cuerpo de los textos legales (sin título principal). Lo comparten las páginas
// /privacy y /terms y el modal del footer, así hay una sola copia del contenido.
function PrivacyBody() {
  const { t } = useTranslation();
  return (
    <>
      <p>{t("privacy.intro")}</p>

      <h2>{t("privacy.dataTitle")}</h2>
      <p>{t("privacy.dataText")}</p>

      <h2>{t("privacy.cookiesTitle")}</h2>
      <p>
        {t("privacy.cookiesText")} {t("privacy.cookiesMore")}{" "}
        <a
          href="https://www.cloudflare.com/web-analytics/"
          target="_blank"
          rel="noopener noreferrer"
        >
          cloudflare.com/web-analytics
        </a>
        .
      </p>

      <h2>{t("privacy.antispamTitle")}</h2>
      <p>
        {t("privacy.antispamText")} {t("privacy.antispamMore")}{" "}
        <a
          href="https://www.cloudflare.com/products/turnstile/"
          target="_blank"
          rel="noopener noreferrer"
        >
          cloudflare.com/products/turnstile
        </a>
        .
      </p>

      <h2>{t("privacy.contactTitle")}</h2>
      <p>{t("privacy.contactText")}</p>
    </>
  );
}

function TermsBody() {
  const { t } = useTranslation();
  return (
    <>
      <p>{t("terms.intro")}</p>

      <h2>{t("terms.contractTitle")}</h2>
      <p>{t("terms.contractText")}</p>

      <h2>{t("terms.paymentTitle")}</h2>
      <p>{t("terms.paymentText")}</p>
      <ul>
        <li>{t("terms.paymentAdvance")}</li>
        <li>{t("terms.paymentBalance")}</li>
      </ul>

      <h2>{t("terms.deliveryTitle")}</h2>
      <p>{t("terms.deliveryText")}</p>

      <h2>{t("terms.cancelTitle")}</h2>
      <p>{t("terms.cancelText")}</p>

      <h2>{t("terms.lawTitle")}</h2>
      <p>
        {t("terms.lawText")}{" "}
        <a href="mailto:studioastravia@gmail.com">studioastravia@gmail.com</a>.
      </p>
    </>
  );
}

export default function LegalBody({ tipo }) {
  return tipo === "terms" ? <TermsBody /> : <PrivacyBody />;
}
