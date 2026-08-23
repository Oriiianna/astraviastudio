import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { IconMail, IconPhone, IconPin } from "./icons.jsx";
import "./Footer.css";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.resolvedLanguage?.startsWith("en") ? "en" : "es";
  const footerT = (key) => t(key, { lng: lang });

  const isHomePage = location.pathname === '/';

  const handleLogoClick = (e) => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const COLUMNS = [
    {
      title: footerT("footer.columns.services"),
      links: [
        footerT("footer.links.services"),
        footerT("footer.links.elementor"),
        footerT("footer.links.uiux"),
        footerT("footer.links.wpo"),
        footerT("footer.links.maintenance"),
      ],
    },
    {
      title: footerT("footer.columns.agency"),
      links: [
        footerT("footer.links.about"),
        footerT("footer.links.process"),
        footerT("footer.links.clients"),
        footerT("footer.links.blog"),
        footerT("footer.links.contact"),
      ],
    },
  ];

  const CONTACT_INFO = [
    {
      icon: IconMail,
      text: "studioastravia@gmail.com",
      href: "mailto:studioastravia@gmail.com",
    },
    {
      icon: IconPhone,
      text: "+54 11 6871-7233",
      href: "https://wa.me/5491168717233?text=%C2%A1Hola!%20Me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20servicios%20de%20Astravia%20Studio%20y%20recibir%20asesoramiento%20para%20mi%20proyecto%20web.",
      target: "_blank",},
    {
      icon: IconPin,
      text: "Buenos Aires, Argentina",
      href: "https://maps.app.goo.gl/EgmxnWcfeM1ahkyv5",
      target: "_blank",
    },
  ];

  return (
    <footer className="footer grain">
      <div className="container container--full">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link className="footer__logo" to="/" onClick={handleLogoClick}>
              <img
                src="/brand/astravia-logo-oficial.svg"
                alt="Astravia"
                width="635"
                height="160"
                loading="lazy"
              />
            </Link>
            <p>{footerT("footer.description")}</p>
          </div>

          {COLUMNS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <Link to="/#contacto">{link}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer__col">
            <h3>{footerT("footer.contact")}</h3>
            <ul className="footer__contact">
              {CONTACT_INFO.map(({ icon: Icon, text, href, target }) => (
                <li key={text}>
                  <Icon />
                  {href ? (
                    <a
                      href={href}
                      target={target}
                      rel={
                        target === "_blank" ? "noopener noreferrer" : undefined
                      }
                    >
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
            © {new Date().getFullYear()} Astravia. {footerT("footer.rights")}
          </p>
          <div className="footer__legal">
            <a href="/privacy">{footerT("footer.links.privacy")}</a>
            <span className="footer__legal-separator">|</span>
            <a href="/terms">{footerT("footer.links.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
