import { IconArrowUpRight } from "./icons.jsx";
import "./Clients.css";

/* Capturas reales de los sitios, generadas por scripts/capture-proyectos.mjs
  y optimizadas por scripts/optimize-proyectos.mjs → public/proyectos/.
   Son tiras verticales de dos pantallas: la tarjeta las recorre al hover. */
const PROYECTOS = [
  {
    slug: "altamira",
    titulo: "Altamira · Bienes Raíces",
    etiqueta: "Pieza propia",
    url: "https://astraviastudio-inmobiliaria.vercel.app/",
    dominio: "Altamira · Bienes Raíces",
    descripcion:
      "Una inmobiliaria de autor, resuelta como SPA. Los filtros del catálogo viven en la URL, así que una búsqueda se comparte y sobrevive al refresh. Detrás de todo corre una secuencia de video atada al scroll, sin frenar la carga.",
    stack: ["React", "Tailwind", "Framer Motion", "React Router"],
    accent: "#7c3aed",
    alt: "Home del sitio de Altamira Bienes Raíces: hero con buscador de propiedades y grilla de destacadas",
  },
  {slug: "oscuro-cafe",
    titulo: "Oscuro Café - Cafetería de Especialidad",
    etiqueta: "Pieza propia",
    url: "https://astraviastudio-oscurocafe.vercel.app/",
    dominio: "Oscuro Café - Cafetería de Especialidad",
    descripcion:
      "Una landing premium pra una cafetería de especialidad, diseñada para transmitir calidez y sotisticación. La experiencia combina animaciones fluidas y una narrativa visual que invita a descubrir la historia detrás de cada taza de café, mientras se destacan los productos y servicios ofrecidos.",
    stack: ["React", "Tailwind", "Framer Motion", "React Router"],
    accent: "#7c3aed",
    alt: "Home del sitio de Oscuro Café: hero con imagen del café y grilla de productos destacados",
  },
];

export default function Clients() {
  return (
    <section className="clients section grain" id="clientes">
      <div className="clients__bg bg-layer" aria-hidden="true" />

      <div className="container container--full">
        <header className="clients__head">
          <div data-reveal>
            <span className="kicker">Portfolio</span>
            <h2>Proyectos Destacados</h2>
            <p>
              Piezas donde probamos ideas de interfaz y rendimiento a fondo. No
              son maquetas: están publicadas y se pueden recorrer.
            </p>
          </div>

          <a
            href="#proceso"
            className="btn btn--ghost"
            data-reveal
            style={{ "--delay": "120ms" }}
          >
            Ver cómo trabajamos
          </a>
        </header>

        <div className="clients__lista">
          {PROYECTOS.map((proyecto) => (
            <article
              className="project"
              key={proyecto.slug}
              style={{ "--accent": proyecto.accent }}
              data-reveal
              data-spotlight
            >
              <a
                className="project__thumb"
                href={proyecto.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir ${proyecto.titulo} en una pestaña nueva`}
              >
                <span className="project__chrome" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <em>{proyecto.dominio}</em>
                </span>

                <span className="project__viewport">
                  <img
                    className="project__shot"
                    src={`/proyectos/${proyecto.slug}.webp`}
                    srcSet={`/proyectos/${proyecto.slug}-sm.webp 720w, /proyectos/${proyecto.slug}.webp 1240w`}
                    sizes="(max-width: 940px) 92vw, 56vw"
                    alt={proyecto.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </span>

                <span className="project__overlay">
                  <span className="project__result">Ver sitio en vivo</span>
                  <span className="project__go">
                    <IconArrowUpRight />
                  </span>
                </span>
              </a>

              <div className="project__info">
                <span className="project__tag">{proyecto.etiqueta}</span>
                <h3>{proyecto.titulo}</h3>
                <p>{proyecto.descripcion}</p>

                <ul className="project__stack">
                  {proyecto.stack.map((tec) => (
                    <li key={tec}>{tec}</li>
                  ))}
                </ul>

                <a
                  className="btn btn--primary project__cta"
                  href={proyecto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver sitio en vivo
                  <IconArrowUpRight />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
