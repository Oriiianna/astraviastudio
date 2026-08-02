import { useState } from 'react'
import { IconMail } from './icons.jsx'
import './Contact.css'

const EMPTY = { nombre: '', telefono: '', email: '', mensaje: '', website: '' }

const MENSAJE_OK = '¡Gracias! Te respondemos dentro de las próximas 24 horas.'
const MENSAJE_ERROR =
  'No pudimos enviar el mensaje. Probá de nuevo o escribinos a hola@astravia.digital.'

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  // idle | sending | ok | error
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (status !== 'sending') setStatus('idle')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        setError(data.error || MENSAJE_ERROR)
        setStatus('error')
        return
      }

      setForm(EMPTY)
      setStatus('ok')
    } catch {
      setError(MENSAJE_ERROR)
      setStatus('error')
    }
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

          {/* Honeypot: invisible para personas, irresistible para bots. */}
          <input
            type="text"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            aria-hidden="true"
            className="contact__honeypot"
            value={form.website}
            onChange={update('website')}
          />

          <button type="submit" className="contact__submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Enviando…' : 'Enviar Mensaje'}
          </button>

          <p
            className={`contact__feedback${status === 'error' ? ' is-error' : ''}`}
            role="status"
            aria-live="polite"
          >
            {status === 'ok' ? MENSAJE_OK : status === 'error' ? error : ''}
          </p>
        </form>
      </div>
    </section>
  )
}
