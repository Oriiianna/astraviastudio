import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { IconMail, IconPhone, IconPin, IconCheckCircle, IconChevronDown } from "./icons.jsx";
import Turnstile from "./Turnstile.jsx";
import "./Contact.css";

const EMPTY = { nombre: "", telefono: "", email: "", mensaje: "", servicio: "", website: "" };

// Selector de servicio: solo estructura. Los textos salen de translation.json.
// Cada opción conserva su color de acento (los mismos códigos del Pricing)
// para el hover y el check de selección.
const SERVICIOS = [
  { value: "landing", accent: "#7c3aed", i18nKey: "serviceLanding" },
  { value: "corporativo", accent: "#9b6cf5", i18nKey: "serviceCorporativo" },
  { value: "ecommerce", accent: "#7ec4ef", i18nKey: "serviceEcommerce" },
  { value: "otro", accent: "#f2a65a", i18nKey: "serviceOtro" },
];

// Modal de agradecimiento tras el envío. Lleva el foco al botón, se cierra con
// Escape, clic en el fondo o el botón, y bloquea el scroll mientras está abierto.
function ModalGracias({ onClose }) {
  const { t } = useTranslation();
  const closeRef = useRef(null);

  useEffect(() => {
    const previo = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Único elemento enfocable: mantener el foco dentro del modal.
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previo?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="thanks-modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="thanks-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="thanks-title"
        aria-describedby="thanks-text"
      >
        <IconCheckCircle className="thanks-modal__icon" aria-hidden="true" />
        <h3 id="thanks-title" className="thanks-modal__title">
          {t("contact.thanksTitle")}
        </h3>
        <p id="thanks-text" className="thanks-modal__text">
          {t("contact.thanksText")}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="btn btn--primary"
          onClick={onClose}
        >
          {t("contact.thanksClose")}
        </button>
      </div>
    </div>
  );
}

// Dropdown accesible tipo listbox. Reemplaza al <select> nativo porque la
// lista desplegada de un select no se puede estilar cruzando navegadores:
// acá es HTML nuestro, así que sí lleva la identidad visual del sitio.
function SelectServicio({ value, onChange }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const rootRef = useRef(null);
  const opcionRefs = useRef([]);

  const seleccionado = SERVICIOS.find((s) => s.value === value) || null;

  // Cerrar al hacer click fuera y con Escape.
  useEffect(() => {
    const alClickFuera = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const alEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", alClickFuera);
    document.addEventListener("keydown", alEscape);
    return () => {
      document.removeEventListener("mousedown", alClickFuera);
      document.removeEventListener("keydown", alEscape);
    };
  }, []);

  // Mantener visible la opción enfocada por teclado dentro del panel.
  useEffect(() => {
    if (open && focusIndex >= 0) {
      opcionRefs.current[focusIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [focusIndex, open]);

  const toggle = () => {
    if (!open && !seleccionado) setFocusIndex(0);
    setOpen((v) => !v);
  };

  const elegir = (v) => {
    onChange(v);
    setOpen(false);
    setFocusIndex(-1);
  };

  const tecladoBoton = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const idx = seleccionado ? SERVICIOS.findIndex((s) => s.value === seleccionado.value) : 0;
      setFocusIndex(idx);
    }
  };

  const tecladoLista = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIndex((i) => Math.min(i + 1, SERVICIOS.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusIndex >= 0) elegir(SERVICIOS[focusIndex].value);
    }
  };

  return (
    <div className="contact__select" ref={rootRef}>
      {/* Botón que muestra la opción actual y abre el panel */}
      <button
        type="button"
        className="contact__select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="servicio-label"
        onClick={toggle}
        onKeyDown={tecladoBoton}
      >
        <span className={`contact__select-value${seleccionado ? "" : " is-placeholder"}`}>
          {seleccionado
            ? t(`contact.${seleccionado.i18nKey}`)
            : t("contact.placeholderService")}
        </span>
        <IconChevronDown className={`contact__select-arrow${open ? " is-open" : ""}`} />
      </button>

      {/* Panel desplegable: fondo del panel, opciones con hover de acento */}
      {open && (
        <ul
          className="contact__select-list"
          role="listbox"
          aria-labelledby="servicio-label"
          onKeyDown={tecladoLista}
        >
          {SERVICIOS.map((s, i) => {
            const activo = focusIndex === i;
            const marcado = value === s.value;
            return (
              <li
                key={s.value}
                className={`contact__select-option${activo ? " is-focused" : ""}${marcado ? " is-selected" : ""}`}
                style={{ "--accent": s.accent }}
                role="option"
                aria-selected={marcado}
              >
                <button
                  type="button"
                  tabIndex="-1"
                  ref={(el) => (opcionRefs.current[i] = el)}
                  onClick={() => elegir(s.value)}
                  onMouseEnter={() => setFocusIndex(i)}
                >
                  {t(`contact.${s.i18nKey}`)}
                  <IconCheckCircle className="contact__select-option-check" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(EMPTY);
  // idle | sending | ok | error
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const closeThanks = useCallback(() => setStatus("idle"), []);
  // Token de Turnstile: vale para un solo envío, así que tras cada intento que
  // llega al servidor se descarta y se pide otro.
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaReset, setCaptchaReset] = useState(0);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status !== "sending") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    // El dropdown personalizado no dispara la validación nativa `required`,
    // así que la hacemos acá para no mandar consultas sin servicio elegido.
    if (!form.servicio) {
      setError(t("contact.errorService"));
      setStatus("error");
      return;
    }

    // La verificación corre sola en segundo plano; si aún no terminó, se pide
    // esperar un instante en vez de mandar la consulta sin ella.
    if (!captchaToken) {
      setError(t("contact.errorCaptchaWait"));
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          turnstileToken: captchaToken,
          lang: i18n.language.slice(0, 2),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setError(data.code === "captcha" ? t("contact.errorCaptchaFailed") : data.error || t("contact.error"));
        setStatus("error");
        return;
      }

      setForm(EMPTY);
      setStatus("ok");
    } catch {
      setError(t("contact.error"));
      setStatus("error");
    } finally {
      setCaptchaToken(null);
      setCaptchaReset((n) => n + 1);
    }
  };

  return (
    <section className="contact section grain" id="contacto">
      <div className="container container--full contact__inner">
        <div className="contact__copy">
          <span className="kicker" data-reveal>
            {t("contact.kicker")}
          </span>
          <h2 data-reveal="wipe" style={{ "--delay": "90ms" }}>
            {t("contact.title")} <span className="grad-text">{t("contact.accent")}</span>
          </h2>

          <p data-reveal style={{ "--delay": "180ms" }}>
            {t("contact.description")}
          </p>
          <a
            className="contact__channel"
            href="mailto:studioastravia@gmail.com"
            data-reveal
            style={{ "--delay": "180ms" }}
          >
            <span className="contact__channel-icon">
              <IconMail />
            </span>
            <span>
              <strong>{t("contact.email")}</strong>
              studioastravia@gmail.com
            </span>
          </a>
          <a
            className="contact__channel"
            href={`https://wa.me/5491168717233?text=${encodeURIComponent(t("floating.whatsappMessage"))}`}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            style={{ "--delay": "180ms" }}
          >
            <span className="contact__channel-icon">
              <IconPhone />
            </span>
            <span>
              <strong>{t("contact.whatsapp")}</strong>
              +54 11 6871-7233
            </span>
          </a>
          <a
            className="contact__channel"
            href="https://maps.app.goo.gl/EgmxnWcfeM1ahkyv5"
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            style={{ "--delay": "180ms" }}
          >
            <span className="contact__channel-icon">
              <IconPin />
            </span>
            <span>
              <strong>{t("contact.location")}</strong>
              Buenos Aires, Argentina
            </span>
          </a>
        </div>

        <form
          className="contact__form"
          onSubmit={handleSubmit}
          data-reveal
          style={{ "--delay": "140ms" }}
        >
          <div className="contact__row">
            <label className="field">
              <span>{t("contact.name")}</span>
              <input
                type="text"
                name="nombre"
                placeholder={t("contact.placeholderName")}
                value={form.nombre}
                onChange={update("nombre")}
                required
              />
            </label>

            <label className="field">
              <span>{t("contact.phone")}</span>
              <input
                type="tel"
                name="telefono"
                placeholder={t("contact.placeholderPhone")}
                value={form.telefono}
                onChange={update("telefono")}
                pattern="[\+]?[0-9\s\-\(\)]{7,}"
                title={i18n.language.startsWith("es") ? "Ingresá un número de teléfono válido" : "Enter a valid phone number"}
              />
            </label>
          </div>

          <label className="field">
            <span>{t("contact.email")}</span>
            <input
              type="email"
              name="email"
              placeholder={t("contact.placeholderEmail")}
              value={form.email}
              onChange={update("email")}
              required
            />
          </label>

          <label className="field" id="servicio-label">
            <span>{t("contact.service")}</span>
            <SelectServicio
              value={form.servicio}
              onChange={(v) => update("servicio")({ target: { value: v } })}
            />
          </label>

          <label className="field">
            <span>{t("contact.message")}</span>
            <textarea
              name="mensaje"
              rows="5"
              placeholder={t("contact.placeholderMessage")}
              value={form.mensaje}
              onChange={update("mensaje")}
              required
            />
          </label>

          {/* Honeypot: invisible para personas, irresistible para bots. */}
          <input
            type="text"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            className="contact__honeypot"
            value={form.website}
            onChange={update("website")}
          />

          <Turnstile onToken={setCaptchaToken} resetSignal={captchaReset} />

          <button
            type="submit"
            className="btn btn--primary btn--rect"
            disabled={status === "sending"}
          >
            {status === "sending" ? t("contact.sending") : t("contact.submit")}
          </button>

          <p
            className={`contact__feedback${status === "error" ? " is-error" : ""}`}
            role="status"
            aria-live="polite"
          >
            {status === "error" ? error : ""}
          </p>
        </form>
      </div>

      {status === "ok" && <ModalGracias onClose={closeThanks} />}
    </section>
  );
}
