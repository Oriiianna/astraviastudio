import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { IconClose } from "./icons.jsx";
import LegalBody from "./LegalBody.jsx";
import "./LegalModal.css";

const FOCUSABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Modal de Privacidad / Términos. Mismo patrón que el modal de gracias del
// formulario: foco adentro, Escape o clic en el fondo cierran, el scroll de la
// página queda bloqueado y el foco vuelve al enlace que lo abrió.
export default function LegalModal({ tipo, onClose }) {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previo = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      // Mantiene el foco dentro de la tarjeta.
      const items = cardRef.current?.querySelectorAll(FOCUSABLES);
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previo?.focus?.();
    };
  }, [onClose]);

  const titulo = t(tipo === "terms" ? "footer.links.terms" : "footer.links.privacy");

  return createPortal(
    <div
      className="legal-modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        className="legal-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
      >
        <header className="legal-modal__head">
          <h2 id="legal-title">{titulo}</h2>
          <button
            ref={closeRef}
            type="button"
            className="legal-modal__close"
            onClick={onClose}
            aria-label={t("footer.closeLegal")}
          >
            <IconClose aria-hidden="true" />
          </button>
        </header>

        <div className="legal-modal__body page-content">
          <LegalBody tipo={tipo} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
