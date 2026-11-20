import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FloatingActions from "../components/FloatingActions.jsx";
import LegalBody from "../components/LegalBody.jsx";
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
          <LegalBody tipo="privacy" />
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
