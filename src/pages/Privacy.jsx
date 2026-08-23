import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FloatingActions from "../components/FloatingActions.jsx";

export default function Privacy() {
  const { t } = useTranslation();

  // Observer único que revela los elementos [data-reveal] al entrar en viewport.
  useEffect(() => {
    const targets = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="container">
          <h1 data-reveal>{t("footer.links.privacy")}</h1>
          <p data-reveal style={{ "--delay": "90ms" }}>
            {/* Contenido de la política de privacidad */}
          </p>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
