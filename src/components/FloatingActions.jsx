import { useEffect, useState } from "react";
import { IconChevronUp, IconWhatsApp } from "./icons.jsx";
import "./FloatingActions.css";

export default function FloatingActions() {
  const [showWhatsApp, setShowWhatsApp] = useState(true); // Visible desde el inicio
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Datos dinámicos limpios
  const phone = "5491168717233";
  const message = encodeURIComponent(
    "¡Hola! Me interesa conocer más sobre los servicios de Astravia Studio y recibir asesoramiento para mi proyecto web.",
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      setShowBackToTop(scrollY + windowHeight >= fullHeight - 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="floating-container">
      {/* 1. Volver arriba */}
      <button
        className={`floating-btn back-to-top ${showBackToTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
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
        aria-label="Contactar por WhatsApp"
        tabIndex={showWhatsApp ? 0 : -1}
      >
        <IconWhatsApp />
      </a>
    </div>
  );
}
