import { useState } from 'react'
import { IconMail } from './icons.jsx'
import './Contact.css'

const EMPTY = { nombre: '', telefono: '', email: '', mensaje: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [sent, setSent] = useState(false)

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (sent) setSent(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: conectar con el backend / servicio de formularios real.
    console.log('Consulta enviada:', form)
    setSent(true)
    setForm(EMPTY)
  }

  return (
    <section className="contact section grain" id="contacto">
      <div className="contact__bg bg-layer" aria-hidden="true" />

      <div className="container container--full contact__inner">
        <div className="contact__copy">
          <span className="kicker" data-reveal>
            Contacto
          </span>
          <h2 data-reveal>
            Hablemos de tu <span className="grad-text">próximo nivel</span>
          </h2>

          <p data-reveal style={{ '--delay': '90ms' }}>
            Cuéntanos sobre tu proyecto. Analizaremos tu situación actual y te propondremos una
            solución a medida sin compromiso.
          </p>

          <a
            className="contact__channel"
            href="mailto:hola@astravia.digital"
            data-reveal
            style={{ '--delay': '180ms' }}
          >
            <span className="contact__channel-icon">
              <IconMail />
            </span>
            <span>
              <strong>Email</strong>
              hola@astravia.digital
            </span>
          </a>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} data-reveal style={{ '--delay': '140ms' }}>
          <div className="contact__glow" aria-hidden="true" />

          <div className="contact__row">
            <label className="field">
              <span>Nombre</span>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={update('nombre')}
                required
              />
            </label>

            <label className="field">
              <span>Teléfono</span>
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={update('telefono')}
              />
            </label>
          </div>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={update('email')}
              required
            />
          </label>

          <label className="field">
            <span>Mensaje</span>
            <textarea
              name="mensaje"
              rows="5"
              placeholder="Mensaje"
              value={form.mensaje}
              onChange={update('mensaje')}
              required
            />
          </label>

          <button type="submit" className="contact__submit">
            Enviar Mensaje
          </button>

          <p className="contact__feedback" role="status" aria-live="polite">
            {sent ? '¡Gracias! Te respondemos dentro de las próximas 24 horas.' : ''}
          </p>
        </form>
      </div>
    </section>
  )
}
