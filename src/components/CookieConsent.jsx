import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getConsent, setConsent, loadAnalytics } from '../utils/analytics.js'
import './CookieConsent.css'

export default function CookieConsent() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(() => getConsent() === null)

  const aceptar = () => {
    setConsent('granted')
    loadAnalytics()
    setVisible(false)
  }

  const rechazar = () => {
    setConsent('denied')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" role="dialog" aria-label={t('cookies.title')}>
      <p className="cookie-consent__text">
        <strong>{t('cookies.title')}</strong> {t('cookies.text')}
      </p>
      <div className="cookie-consent__actions">
        <button className="btn btn--ghost" onClick={rechazar}>
          {t('cookies.reject')}
        </button>
        <button className="btn btn--primary" onClick={aceptar}>
          {t('cookies.accept')}
        </button>
      </div>
    </div>
  )
}
