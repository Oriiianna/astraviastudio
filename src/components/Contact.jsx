import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconMail } from "./icons.jsx";
import { IconPhone } from "./icons.jsx";
import { IconPin } from "./icons.jsx";
import "./Contact.css";

const EMPTY = { nombre: "", telefono: "", email: "", mensaje: "", website: "" };

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY);
  // idle | sending | ok | error
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (status !== "sending") setStatus("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setError(data.error || t("contact.error"));
        setStatus("error");
        return;
      }

      setForm(EMPTY);
      setStatus("ok");
    } catch {
      setError(t("contact.error"));
      setStatus("error");
    }
  };

  return (
    <section className="contact section grain" id="contacto">
      <div className="contact__bg bg-layer" aria-hidden="true" />

      <div className="container container--full contact__inner">
        <div className="contact__copy">
          <span className="kicker" data-reveal>
            {t("contact.kicker")}
          </span>
          <h2 data-reveal>
            {t("contact.title")} <span className="grad-text">{t("contact.accent")}</span>
          </h2>

          <p data-reveal style={{ "--delay": "90ms" }}>
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
            href="https://wa.me/5491168717233?text=%C2%A1Hola!%20Me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Astravia%20Studio%20y%20recibir%20asesoramiento%20para%20mi%20proyecto%20web."
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
          <div className="contact__glow" aria-hidden="true" />

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

          <label className="field">
            <span>Mensaje</span>
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

          <button
            type="submit"
            className="contact__submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? t("contact.sending") : t("contact.submit")}
          </button>

          <p
            className={`contact__feedback${status === "error" ? " is-error" : ""}`}
            role="status"
            aria-live="polite"
          >
            {status === "ok" ? t("contact.success") : status === "error" ? error : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
