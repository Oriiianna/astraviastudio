import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { IconMail, IconPhone, IconPin, IconFacebook, IconInstagram, IconStar } from "./icons.jsx";
import LegalModal from "./LegalModal.jsx";
import { scrollToTop } from "../utils/scroll";
import { idiomaActual, rutaConIdioma, rutaSinIdioma } from "../utils/idioma";
import "./Footer.css";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const lang = idiomaActual(i18n);
  const [legal, setLegal] = useState(null); // "privacy" | "terms" | null
  const cerrarLegal = useCallback(() => setLegal(null), []);
  const footerT = (key) => t(key, { lng: lang });

  const isHomePage = rutaSinIdioma(location.pathname) === '/';
  const inicio = rutaConIdioma(lang);

  const handleLogoClick = (e) => {
    if (isHomePage) {
      e.preventDefault();
      scrollToTop();
    }
  };

  // Cada enlace apunta a una sección real de la home (ver ids en App.jsx).
  const COLUMNS = [
    {
      title: footerT("footer.columns.services"),
      links: [
        { label: footerT("footer.links.design"), to: `${inicio}#servicios` },
        { label: footerT("footer.links.development"), to: `${inicio}#servicios` },
        { label: footerT("footer.links.support"), to: `${inicio}#servicios` },
      ],
    },
    {
      title: footerT("footer.columns.agency"),
      links: [
        { label: footerT("footer.links.process"), to: `${inicio}#proceso` },
        { label: footerT("footer.links.plans"), to: `${inicio}#planes` },
        { label: footerT("footer.links.projects"), to: `${inicio}#clientes` },
        { label: footerT("footer.links.contact"), to: `${inicio}#contacto` },
      ],
    },
  ];

  const SOCIAL = [
    { name: "Facebook", icon: IconFacebook, href: "https://www.facebook.com/astraviawebstudio" },
    { name: "Instagram", icon: IconInstagram, href: "https://www.instagram.com/astraviastudio/" },
    { name: footerT("footer.googleReviews"), icon: IconStar, href: "https://share.google/ZVha6YyoqWtoTO3tm" },
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
      href: `https://wa.me/5491168717233?text=${encodeURIComponent(footerT("floating.whatsappMessage"))}`,
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
            <Link className="footer__logo" to={inicio} onClick={handleLogoClick}>
              <img
                src="/brand/astravia-logo-oficial.svg"
                alt="Astravia"
                width="900"
                height="297"
                loading="lazy"
              />
            </Link>
            <p>{footerT("footer.description")}</p>
            <ul className="footer__social" aria-label={footerT("footer.social")}>
              {SOCIAL.map(({ name, icon: Icon, href }) => (
                <li key={name}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} (${footerT("footer.newTab")})`}>
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="footer__col">
            <h3>{footerT("footer.contact")}</h3>
            <ul className="footer__contact">
              {CONTACT_INFO.map(({ icon: Icon, text, href, target }) => (
                <li key={text} data-icon-hover>
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
          <nav className="footer__legal" aria-label={footerT("footer.legal")}>
            {/* Abren el modal; el href real queda para clic medio / nueva pestaña. */}
            <Link
              to={rutaConIdioma(lang, "/privacy")}
              onClick={(e) => {
                e.preventDefault();
                setLegal("privacy");
              }}
            >
              {footerT("footer.links.privacy")}
            </Link>
            <Link
              to={rutaConIdioma(lang, "/terms")}
              onClick={(e) => {
                e.preventDefault();
                setLegal("terms");
              }}
            >
              {footerT("footer.links.terms")}
            </Link>
          </nav>
        </div>
      </div>
      {legal && <LegalModal tipo={legal} onClose={cerrarLegal} />}
    </footer>
  );
}
