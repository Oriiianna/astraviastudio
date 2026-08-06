import { useTranslation } from 'react-i18next'
import { IconMail, IconPhone, IconPin } from './icons.jsx'
import './Footer.css'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'es'
  const footerT = (key) => t(key, { lng: lang })

  const COLUMNS = [
    {
      title: footerT('footer.columns.services'),
      links: [
        footerT('footer.links.services'),
        footerT('footer.links.elementor'),
        footerT('footer.links.uiux'),
        footerT('footer.links.wpo'),
        footerT('footer.links.maintenance'),
      ],
    },
    {
      title: footerT('footer.columns.agency'),
      links: [
        footerT('footer.links.about'),
        footerT('footer.links.process'),
        footerT('footer.links.clients'),
        footerT('footer.links.blog'),
        footerT('footer.links.contact'),
      ],
    },
  ]

  const CONTACT_INFO = [
    { icon: IconMail, text: 'studioastravia@gmail.com', href: 'mailto:studioastravia@gmail.com' },
    { icon: IconPhone, text: '+54 11 6871-7233', href: 'tel:+541168717233' },
    { icon: IconPin, text: 'Buenos Aires, Argentina', href: 'https://maps.app.goo.gl/EgmxnWcfeM1ahkyv5', target: '_blank' },
  ]

  return (
    <footer className="footer grain">
      <div className="footer__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <div className="footer__grid">
          <div className="footer__brand">
            <a className="footer__logo" href="#inicio">
              <img
                src="/brand/astravia-logo-oficial.svg"
                alt="Astravia"
                width="635"
                height="160"
                loading="lazy"
              />
            </a>
            <p>{footerT('footer.description')}</p>
          </div>

          {COLUMNS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#contacto">{link}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer__col">
            <h3>{footerT('footer.contact')}</h3>
            <ul className="footer__contact">
              {CONTACT_INFO.map(({ icon: Icon, text, href, target }) => (
                <li key={text}>
                  <Icon />
                  {href ? (
                    <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} Astravia. {footerT('footer.rights')}
          </p>
          <p className="footer__made">
            {footerT('footer.made').includes('💜') ? (
              <>
                {footerT('footer.made').split('💜')[0]}
                <span aria-label="amor">💜</span>
                {footerT('footer.made').split('💜')[1]}
              </>
            ) : (
              footerT('footer.made')
            )}
          </p>
          <ul className="footer__legal">
            <li>
              <a href="#contacto">{footerT('footer.links.privacy')}</a>
            </li>
            <li>
              <a href="#contacto">{footerT('footer.links.terms')}</a>
            </li>
            <li>
              <a href="#contacto">{footerT('footer.links.cookies')}</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
