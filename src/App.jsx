import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import ServicesLight from "./components/ServicesLight.jsx";
import Process from "./components/Process.jsx";
import Pricing from "./components/Pricing.jsx";
// Ocultas por ahora (los archivos siguen en components/). Para volver a
// mostrarlas: descomentar estos imports y las dos líneas dentro de <main>.
// import Faq from "./components/Faq.jsx";
// import CtaBanner from "./components/CtaBanner.jsx";
import Clients from "./components/Clients.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import FloatingActions from "./components/FloatingActions.jsx";
import { loadAnalytics } from "./utils/analytics.js";
import { useReveal } from "./hooks/useReveal.js";
import { idiomaPreferido, rutaConIdioma, rutaSinIdioma } from "./utils/idioma.js";
import { IDIOMAS, aplicarMeta, paginaDeRuta } from "./seo.js";

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return null;
}

function AppContent() {
  const { t } = useTranslation();

  useReveal();

  // Spotlight que sigue al cursor dentro de cada [data-spotlight].
  // El listener va por elemento: solo dispara mientras el mouse está encima.
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const cards = document.querySelectorAll("[data-spotlight]");
    const move = (e) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };

    cards.forEach((el) => el.addEventListener("pointermove", move));
    return () =>
      cards.forEach((el) => el.removeEventListener("pointermove", move));
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        {t("nav.skip")}
      </a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <ServicesLight />
        <Process />
        <Pricing />
        {/* <Faq /> */}
        {/* <CtaBanner /> */}
        <Clients />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}

// Layout de /:lng/*. El idioma sale de la URL; si no es es/en, no es una ruta nuestra.
// Además deja el <head> (título, canonical, hreflang…) igual al que escribió el build.
function IdiomaDeRuta() {
  const { lng } = useParams();
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const valido = IDIOMAS.includes(lng);

  useEffect(() => {
    if (valido) i18n.changeLanguage(lng);
  }, [valido, lng, i18n]);

  useEffect(() => {
    if (valido) aplicarMeta(lng, paginaDeRuta(rutaSinIdioma(pathname)));
  }, [valido, lng, pathname]);

  if (!valido) return <RedirigirAIdioma />;
  return <Outlet />;
}

// "/" y las rutas sin prefijo (/privacy, /terms, cualquier otra) caen acá:
// se manda a la versión en el idioma preferido, conservando ruta y #hash.
function RedirigirAIdioma() {
  const { i18n } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const ruta = ["/privacy", "/terms"].includes(pathname) ? pathname : "/";
  return (
    <Navigate to={{ pathname: rutaConIdioma(idiomaPreferido(i18n), ruta), search, hash }} replace />
  );
}

export default function App() {
  // Cloudflare Web Analytics no usa cookies, así que carga siempre.
  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <Router>
      <ScrollToHash />
      <Routes>
        <Route path="/:lng" element={<IdiomaDeRuta />}>
          <Route index element={<AppContent />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
        </Route>
        <Route path="*" element={<RedirigirAIdioma />} />
      </Routes>
    </Router>
  );
}
