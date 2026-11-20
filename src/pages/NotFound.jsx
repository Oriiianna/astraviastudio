import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import FloatingActions from "../components/FloatingActions.jsx";
import { idiomaDeRuta, idiomaPreferido, rutaConIdioma } from "../utils/idioma.js";
import "./NotFound.css";

// Ruta que no existe: se muestra en lugar de redirigir en silencio al inicio
// (para Google una URL inventada que "funciona" es un soft 404). Va con noindex.
export default function NotFound() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const lng = idiomaDeRuta(pathname) ?? idiomaPreferido(i18n);
  const titulo = t("notFound.metaTitle");

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [lng, i18n]);

  useEffect(() => {
    const robots = document.head.querySelector('meta[name="robots"]');
    const robotsAntes = robots?.getAttribute("content");
    const tituloAntes = document.title;
    robots?.setAttribute("content", "noindex, follow");
    document.title = titulo;
    return () => {
      if (robotsAntes != null) robots.setAttribute("content", robotsAntes);
      document.title = tituloAntes;
    };
  }, [titulo]);

  return (
    <>
      <Navbar />
      <main className="page-container">
        <div className="container page-content notfound">
          <p className="notfound__code" aria-hidden="true">
            404
          </p>
          <h1>{t("notFound.title")}</h1>
          <p>{t("notFound.text")}</p>
          <Link className="btn btn--primary" to={rutaConIdioma(lng)}>
            {t("notFound.back")}
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
