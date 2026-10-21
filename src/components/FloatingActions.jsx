import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconChevronUp, IconWhatsApp } from "./icons.jsx";
import "./FloatingActions.css";
import { scrollToY } from "../utils/scroll";

export default function FloatingActions() {
  const { t } = useTranslation();
  const [showWhatsApp, setShowWhatsApp] = useState(true); // Visible desde el inicio
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Datos dinámicos limpios
  const phone = "5491168717233";
  const message = encodeURIComponent(t("floating.whatsappMessage"));
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  useEffect(() => {
    // Aparece pasada la primera pantalla y media, no solo al final de la página.
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight * 1.5);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="floating-container">
      {/* 1. Volver arriba */}
      <button
        className={`floating-btn back-to-top ${showBackToTop ? "is-visible" : ""}`}
        onClick={() => scrollToY(0)}
        aria-label={t("floating.backToTop")}
        tabIndex={showBackToTop ? 0 : -1}
      >
        <IconChevronUp />
      </button>

      {/* 2. WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`floating-btn whatsapp-btn whatsapp-pulse ${showWhatsApp ? "is-visible" : ""}`}
        aria-label={t("floating.whatsapp")}
        tabIndex={showWhatsApp ? 0 : -1}
      >
        <IconWhatsApp />
      </a>
    </div>
  );
}
