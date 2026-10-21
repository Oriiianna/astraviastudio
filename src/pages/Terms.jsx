import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FloatingActions from "../components/FloatingActions.jsx";
import { useReveal } from "../hooks/useReveal.js";

export default function Terms() {
  const { t } = useTranslation();

  useReveal();

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="container page-content">
          <h1 data-reveal>{t("footer.links.terms")}</h1>
          <p data-reveal style={{ "--delay": "90ms" }}>
            {t("terms.intro")}
          </p>

          <h2 data-reveal>{t("terms.contractTitle")}</h2>
          <p data-reveal>{t("terms.contractText")}</p>

          <h2 data-reveal>{t("terms.paymentTitle")}</h2>
          <p data-reveal>{t("terms.paymentText")}</p>
          <ul data-reveal>
            <li>{t("terms.paymentAdvance")}</li>
            <li>{t("terms.paymentBalance")}</li>
          </ul>

          <h2 data-reveal>{t("terms.deliveryTitle")}</h2>
          <p data-reveal>{t("terms.deliveryText")}</p>

          <h2 data-reveal>{t("terms.cancelTitle")}</h2>
          <p data-reveal>{t("terms.cancelText")}</p>

          <h2 data-reveal>{t("terms.lawTitle")}</h2>
          <p data-reveal>
            {t("terms.lawText")}{" "}
            <a href="mailto:studioastravia@gmail.com">studioastravia@gmail.com</a>.
          </p>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
