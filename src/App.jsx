import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import TechStack from "./components/TechStack.jsx";
import Pricing from "./components/Pricing.jsx";
import Process from "./components/Process.jsx";
import Clients from "./components/Clients.jsx";
import CtaBanner from "./components/CtaBanner.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
// Sustituido por FloatingActions.jsx, que incluye el botón de BackToTop y el de WhatsApp
// import BackToTop from "./components/BackToTop.jsx";
import FloatingActions from "./components/FloatingActions.jsx";

export default function App() {
  // Observer único que revela los elementos [data-reveal] al entrar en viewport.
  useEffect(() => {
    const targets = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
      <Navbar />
      <main>
        <Hero />
        <Services />
        <TechStack />
        <Pricing />
        <Process />
        <Clients />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
      {/* <BackToTop /> */}
      <FloatingActions />
    </>
  );
}
