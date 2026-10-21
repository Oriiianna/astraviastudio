import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FloatingActions from "../components/FloatingActions.jsx";
import { useReveal } from "../hooks/useReveal.js";

export default function Privacy() {
  const { t } = useTranslation();

  useReveal();

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="container page-content">
          <h1 data-reveal>{t("footer.links.privacy")}</h1>
          <p data-reveal style={{ "--delay": "90ms" }}>
            {t("privacy.intro")}
          </p>

          <h2 data-reveal style={{ "--delay": "140ms" }}>
            {t("privacy.dataTitle")}
          </h2>
          <p data-reveal style={{ "--delay": "170ms" }}>
            {t("privacy.dataText")}
          </p>

          <h2 data-reveal style={{ "--delay": "200ms" }}>
            {t("privacy.cookiesTitle")}
          </h2>
          <p data-reveal style={{ "--delay": "230ms" }}>
            {t("privacy.cookiesText")}
            {" "}{t("privacy.cookiesMore")}{" "}
            <a
              href="https://www.cloudflare.com/web-analytics/"
              target="_blank"
              rel="noopener noreferrer"
            >
              cloudflare.com/web-analytics
            </a>.
          </p>

          <h2 data-reveal style={{ "--delay": "260ms" }}>
            {t("privacy.antispamTitle")}
          </h2>
          <p data-reveal style={{ "--delay": "290ms" }}>
            {t("privacy.antispamText")}
            {" "}{t("privacy.antispamMore")}{" "}
            <a
              href="https://www.cloudflare.com/products/turnstile/"
              target="_blank"
              rel="noopener noreferrer"
            >
              cloudflare.com/products/turnstile
            </a>.
          </p>

          <h2 data-reveal style={{ "--delay": "320ms" }}>
            {t("privacy.contactTitle")}
          </h2>
          <p data-reveal style={{ "--delay": "350ms" }}>
            {t("privacy.contactText")}
          </p>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
