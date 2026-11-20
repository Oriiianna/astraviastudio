import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  IconAlertCircle,
  IconArrowDown,
  IconArrowLeft,
  IconArrowUp,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconImagePlus,
  IconLoader,
  IconLogOut,
  IconPencil,
  IconPlus,
  IconStar,
  IconTrash,
} from "../components/icons.jsx";
import { SUPABASE_KEY, SUPABASE_URL } from "../lib/supabaseConfig.js";
import "../components/Navbar.css";
import "./Admin.css";

/* Panel de administración de los proyectos del portfolio.
   Login con Supabase Auth; solo escriben los usuarios dados de alta en la tabla
   `admins` (lo impone la seguridad por filas de la base, no este código).
   Se carga aparte del sitio (React.lazy en App.jsx). */

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET = "proyectos";
const MAX_DESTACADOS = 6; // los únicos que se ven en el home (lo impone también la base)
const POR_PAGINA = 8; // proyectos que se cargan por vez en la lista

// Cada categoría guarda su texto en los dos idiomas.
const CATEGORIAS = [
  { es: "Sitio web", en: "Website" },
  { es: "Servicios", en: "Services" },
  { es: "E-commerce", en: "E-commerce" },
];

const TEXTOS = { title: "", category: "", blurb: "", domain: "", description: "", alt: "" };

const VACIO = {
  slug: "",
  url: "",
  accent: "#7c3aed",
  imagen: "",
  imagen_movil: "",
  publicado: true,
  destacado: false,
  es: { ...TEXTOS },
  en: { ...TEXTOS },
};

const slugDe = (texto) =>
  texto
    .split("·")[0]
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* Convierte cualquier imagen (PNG, JPG, WebP) a WebP del ancho indicado, así
   alcanza con subir una captura sin pasar por ningún script. */
async function aWebp(archivo, ancho) {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, ancho / bitmap.width);
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(bitmap.width * escala);
  lienzo.height = Math.round(bitmap.height * escala);
  lienzo.getContext("2d").drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
  bitmap.close();
  const blob = await new Promise((resolve) => lienzo.toBlob(resolve, "image/webp", 0.85));
  if (!blob) throw new Error("No se pudo convertir la imagen a WebP.");
  return blob;
}

const idDe = (clave) => `f-${clave.replace(".", "-")}`;

/* ---------- Piezas reutilizables ---------- */

/* Misma barra que el resto del sitio (clases de Navbar.css): logo oficial,
   alto --nav-h y márgenes del contenedor. Siempre con el fondo "scrolleado". */
function BarraAdmin({ sesion, onSalir }) {
  return (
    <header className="nav nav--scrolled">
      <div className="container container--full nav__inner">
        <a className="nav__logo" href="/" aria-label="Astravia — ir al sitio">
          <img src="/brand/astravia-logo-oficial.svg" alt="Astravia" width="900" height="297" />
        </a>
        <div className="nav__actions">
          <span className="adm__etiqueta">Panel</span>
          {sesion && <span className="adm__email">{sesion.user.email}</span>}
          {sesion && onSalir && (
            <button type="button" className="btn btn--ghost adm__salir" onClick={onSalir}>
              <IconLogOut aria-hidden="true" /> Salir
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function Interruptor({ activo, onCambio, etiqueta, contexto }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={contexto ? `${etiqueta}: ${contexto}` : undefined}
      className={`adm__switch${activo ? " is-on" : ""}`}
      onClick={() => onCambio(!activo)}
    >
      <span className="adm__switch-pista" aria-hidden="true">
        <span className="adm__switch-bola" />
      </span>
      <span>{etiqueta}</span>
    </button>
  );
}

/* Etiqueta + control + ayuda + error, enlazados por id / aria-describedby. */
function Campo({ clave, etiqueta, ayuda, error, requerido, children }) {
  const id = idDe(clave);
  const descripcion = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean).join(" ");
  return (
    <div className={`adm__campo${error ? " tiene-error" : ""}`}>
      <label htmlFor={id}>
        {etiqueta}
        {requerido && <span className="adm__req" aria-hidden="true"> *</span>}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": descripcion || undefined,
        "aria-required": requerido || undefined,
      })}
      {ayuda && <small id={`${id}-ayuda`}>{ayuda}</small>}
      {error && (
        <div id={`${id}-error`} className="adm__campo-error">
          <IconAlertCircle aria-hidden="true" /> {error}
        </div>
      )}
    </div>
  );
}

function Aviso({ aviso }) {
  return (
    <div className="adm__toasts" role="status" aria-live="polite">
      {aviso && (
        <div className={`adm__toast${aviso.tipo === "error" ? " is-error" : ""}`} key={aviso.id}>
          {aviso.tipo === "error" ? <IconAlertCircle aria-hidden="true" /> : <IconCheck aria-hidden="true" />}
          {aviso.texto}
          {aviso.accion && (
            <button type="button" className="adm__btn adm__btn--chico" onClick={aviso.accion.onClick}>
              {aviso.accion.texto}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* Diálogo de confirmación (reemplaza a window.confirm). Misma identidad que el
   modal legal del sitio. Foco inicial en "Cancelar" (la opción segura), Escape
   o clic en el fondo cancelan, el foco queda atrapado y vuelve al abrir. */
const FOCUSABLES = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

function Confirmar({ titulo, children, textoConfirmar, textoCancelar = "Cancelar", peligro, icono, ocupado, onConfirmar, onCancelar }) {
  const tarjeta = useRef(null);
  const cancelarRef = useRef(null);

  useEffect(() => {
    const previo = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelarRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        if (!ocupado) onCancelar();
        return;
      }
      if (e.key !== "Tab") return;
      const items = tarjeta.current?.querySelectorAll(FOCUSABLES);
      if (!items?.length) return;
      const primero = items[0];
      const ultimo = items[items.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previo?.focus?.();
    };
  }, [onCancelar, ocupado]);

  return (
    <div
      className="adm__modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !ocupado) onCancelar();
      }}
    >
      <div
        ref={tarjeta}
        className={`adm__modal-tarjeta${peligro ? " is-peligro" : ""}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        aria-describedby="modal-texto"
      >
        <span className="adm__modal-icono" aria-hidden="true">{icono}</span>
        <h2 id="modal-titulo">{titulo}</h2>
        <div id="modal-texto" className="adm__modal-texto">{children}</div>
        <div className="adm__modal-acciones">
          <button ref={cancelarRef} type="button" className="adm__btn" onClick={onCancelar} disabled={ocupado}>
            {textoCancelar}
          </button>
          <button
            type="button"
            className={`adm__btn ${peligro ? "adm__btn--peligro" : "adm__btn--primario"}`}
            onClick={onConfirmar}
            disabled={ocupado}
          >
            {ocupado ? <IconLoader className="adm__giro" aria-hidden="true" /> : null}
            {ocupado ? "Un momento…" : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Login ---------- */

/* Fondo de las pantallas de acceso: superficie oscura lisa; el contenido va en una tarjeta. */
function PantallaAcceso({ children }) {
  return <div className="adm adm__acceso">{children}</div>;
}

function Login() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [ver, setVer] = useState(false);
  const [error, setError] = useState("");
  const [campos, setCampos] = useState([]); // campos con error: "email" y/o "clave"
  const [enviando, setEnviando] = useState(false);
  const emailRef = useRef(null);
  const claveRef = useRef(null);

  const fallar = (mensaje, enCampos, enfocar) => {
    setError(mensaje);
    setCampos(enCampos);
    enfocar?.current?.focus();
    if (enfocar === claveRef) enfocar.current?.select();
  };

  const entrar = async (e) => {
    e.preventDefault();
    setError("");
    setCampos([]);
    // Sin la validación nativa del navegador (sale en su idioma y tapa el diseño).
    if (!email.trim()) return fallar("Escribe tu email.", ["email"], emailRef);
    if (!clave) return fallar("Escribe tu contraseña.", ["clave"], claveRef);

    setEnviando(true);
    const { error: fallo } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: clave,
    });
    setEnviando(false);
    if (fallo) {
      fallar(
        "El email o la contraseña no son correctos. Revísalos e inténtalo de nuevo.",
        ["email", "clave"],
        claveRef,
      );
    }
  };

  const describedBy = error ? "login-error" : undefined;

  return (
    <PantallaAcceso>
      <main className="adm__acceso-centro">
        <form className="adm__login adm__login--vidrio" onSubmit={entrar} noValidate>
          <span className="adm__insignia">
            <img src="/brand/isotipo-astravia.png" alt="Astravia" width="76" height="76" />
          </span>

          <header className="adm__login-cab">
            <h1>Panel de administración</h1>
            <p className="adm__sub">Acceso solo para el equipo de Astravia Studio.</p>
          </header>

          <div className="adm__campo">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              ref={emailRef}
              name="email"
              type="email"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
              required
              aria-invalid={campos.includes("email")}
              aria-describedby={campos.includes("email") ? describedBy : undefined}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="adm__campo">
            <label htmlFor="login-clave">Contraseña</label>
            <div className="adm__clave">
              <input
                id="login-clave"
                ref={claveRef}
                name="password"
                type={ver ? "text" : "password"}
                autoComplete="current-password"
                required
                aria-invalid={campos.includes("clave")}
                aria-describedby={campos.includes("clave") ? describedBy : undefined}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
              <button
                type="button"
                className="adm__icono"
                onClick={() => setVer((v) => !v)}
                aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {ver ? <IconEyeOff aria-hidden="true" /> : <IconEye aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div id="login-error" className="adm__error" role="alert" hidden={!error}>
            <IconAlertCircle aria-hidden="true" /> {error}
          </div>

          <button className="adm__btn adm__btn--primario adm__btn--ancho" disabled={enviando}>
            {enviando ? <IconLoader className="adm__giro" aria-hidden="true" /> : null}
            {enviando ? "Ingresando…" : "Ingresar"}
          </button>

          <a className="adm__volver-sitio" href="/">
            <IconArrowLeft aria-hidden="true" /> Volver al sitio
          </a>
        </form>
      </main>
    </PantallaAcceso>
  );
}

/* ---------- Subida de imagen ---------- */

function SubidaImagen({ clave, etiqueta, ayuda, valor, ancho, slug, tipo, onCambio, requerida, error }) {
  const [subiendo, setSubiendo] = useState(false);
  const [fallo, setFallo] = useState("");
  const [arrastrando, setArrastrando] = useState(false);
  const id = idDe(clave);

  const procesar = async (archivo) => {
    if (!archivo) return;
    if (!/^image\/(png|jpeg|webp)$/.test(archivo.type)) {
      setFallo("Usa una imagen PNG, JPG o WebP.");
      return;
    }
    if (!slug) {
      setFallo("Primero completa el título del proyecto en español.");
      return;
    }
    setSubiendo(true);
    setFallo("");
    try {
      const blob = await aWebp(archivo, ancho);
      const ruta = `${slug}-${tipo}-${Date.now()}.webp`;
      const { error: errSubida } = await supabase.storage
        .from(BUCKET)
        .upload(ruta, blob, { contentType: "image/webp", cacheControl: "31536000" });
      if (errSubida) throw errSubida;
      onCambio(supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl);
    } catch (err) {
      setFallo(`No se pudo subir la imagen: ${err.message}`);
    } finally {
      setSubiendo(false);
    }
  };

  const mensaje = fallo || error;

  return (
    <div className={`adm__sube${mensaje ? " tiene-error" : ""}`}>
      <span className="adm__lbl">
        {etiqueta}
        {requerida && <span className="adm__req" aria-hidden="true"> *</span>}
      </span>

      <div
        className={`adm__drop${arrastrando ? " is-over" : ""}${valor ? " has-img" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastrando(false);
          procesar(e.dataTransfer.files?.[0]);
        }}
      >
        {valor ? (
          <img src={valor} alt="" />
        ) : (
          <span className="adm__drop-vacio">
            <IconImagePlus aria-hidden="true" />
            Arrastra una imagen o usa el botón
          </span>
        )}
        {subiendo && (
          <span className="adm__drop-cargando">
            <IconLoader className="adm__giro" aria-hidden="true" /> Subiendo…
          </span>
        )}
      </div>

      <input
        id={id}
        className="adm__sr"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={subiendo}
        aria-invalid={mensaje ? true : undefined}
        aria-describedby={[`${id}-ayuda`, mensaje && `${id}-error`].filter(Boolean).join(" ")}
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          e.target.value = "";
          procesar(archivo);
        }}
      />
      <div className="adm__sube-acciones">
        <label htmlFor={id} className="adm__btn adm__btn--chico">
          <IconImagePlus aria-hidden="true" /> {valor ? "Cambiar imagen" : "Subir imagen"}
        </label>
        {valor && !requerida && (
          <button type="button" className="adm__btn adm__btn--chico adm__btn--fantasma" onClick={() => onCambio("")} aria-label={`Quitar imagen: ${etiqueta}`}>
            Quitar
          </button>
        )}
      </div>
      <small id={`${id}-ayuda`}>{ayuda}</small>
      {mensaje && (
        <div id={`${id}-error`} className="adm__campo-error" role="alert">
          <IconAlertCircle aria-hidden="true" /> {mensaje}
        </div>
      )}
    </div>
  );
}

/* ---------- Formulario de proyecto ---------- */

// Las claves se agregan en el orden en que aparecen los campos en pantalla: el foco
// va al primer error visible (Object.keys respeta el orden de inserción).
function validar(d) {
  const e = {};
  if (!/^https?:\/\/.+/.test(d.url.trim())) e.url = "Ingresa un link completo, que empiece con https://";
  if (!d.es.category) e.categoria = "Elige una categoría.";
  if (!/^[a-z0-9-]+$/.test(d.slug)) e.slug = "Usa solo minúsculas, números y guiones.";
  for (const idioma of ["es", "en"]) {
    if (!d[idioma].title.trim()) e[`${idioma}.title`] = "Escribe el título.";
    if (!d[idioma].blurb.trim()) e[`${idioma}.blurb`] = "Escribe un resumen corto.";
    if (!d[idioma].alt.trim()) e[`${idioma}.alt`] = "Describe qué se ve en la captura.";
  }
  if (!d.imagen) e.imagen = "Sube la captura de escritorio.";
  return e;
}

function Editor({ proyecto, siguienteOrden, onGuardado, onCancelar }) {
  const nuevo = !proyecto;
  const inicial = useRef(
    proyecto
      ? { ...VACIO, ...proyecto, es: { ...TEXTOS, ...proyecto.es }, en: { ...TEXTOS, ...proyecto.en } }
      : VACIO
  );
  const [datos, setDatos] = useState(inicial.current);
  const [slugEditado, setSlugEditado] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [confirmarSalida, setConfirmarSalida] = useState(false);

  const sucio = JSON.stringify(datos) !== JSON.stringify(inicial.current);
  const limpiar = (...claves) =>
    setErrores((prev) => {
      const sig = { ...prev };
      claves.forEach((c) => delete sig[c]);
      return sig;
    });

  const poner = (campo, valor, clave = campo) => {
    setDatos((d) => ({ ...d, [campo]: valor }));
    limpiar(clave);
  };
  const ponerTexto = (idioma, campo, valor) => {
    setDatos((d) => ({ ...d, [idioma]: { ...d[idioma], [campo]: valor } }));
    limpiar(`${idioma}.${campo}`);
  };

  const cambiarTituloEs = (valor) => {
    setDatos((d) => ({
      ...d,
      es: { ...d.es, title: valor },
      slug: nuevo && !slugEditado ? slugDe(valor) : d.slug,
    }));
    limpiar("es.title", "slug");
  };

  const categoriaActual = CATEGORIAS.findIndex((c) => c.es === datos.es.category);
  const cambiarCategoria = (i) => {
    const cat = CATEGORIAS[i];
    setDatos((d) => ({
      ...d,
      es: { ...d.es, category: cat?.es ?? "" },
      en: { ...d.en, category: cat?.en ?? "" },
    }));
    limpiar("categoria");
  };

  // Cerrar la pestaña o recargar con cambios sin guardar pide confirmación.
  useEffect(() => {
    if (!sucio) return;
    const avisar = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sucio]);

  const cancelar = () => {
    if (sucio) setConfirmarSalida(true);
    else onCancelar();
  };

  const guardar = async (e) => {
    e.preventDefault();
    const encontrados = validar(datos);
    setErrores(encontrados);
    const claves = Object.keys(encontrados);
    if (claves.length) {
      setErrorGeneral(
        claves.length === 1
          ? "Hay 1 campo por revisar."
          : `Hay ${claves.length} campos por revisar.`
      );
      document.getElementById(idDe(claves[0]))?.focus();
      return;
    }

    setGuardando(true);
    setErrorGeneral("");
    const fila = {
      slug: datos.slug,
      url: datos.url.trim(),
      accent: datos.accent || "#7c3aed",
      imagen: datos.imagen,
      imagen_movil: datos.imagen_movil || "",
      publicado: datos.publicado,
      destacado: datos.destacado,
      es: datos.es,
      en: datos.en,
    };
    const { error: fallo } = nuevo
      ? await supabase.from("proyectos").insert({ ...fila, orden: siguienteOrden })
      : await supabase.from("proyectos").update(fila).eq("id", proyecto.id);
    setGuardando(false);
    if (fallo) {
      if (fallo.code === "23505") {
        setErrores({ slug: "Ya existe un proyecto con este identificador." });
        document.getElementById(idDe("slug"))?.focus();
      } else if (fallo.code === "23514") {
        setErrorGeneral(`Ya hay ${MAX_DESTACADOS} proyectos destacados. Quita uno desde la lista antes de destacar este.`);
      } else {
        setErrorGeneral(`No se pudo guardar: ${fallo.message}`);
      }
      return;
    }
    onGuardado(nuevo ? "Proyecto creado." : "Cambios guardados.", nuevo);
  };

  const bloqueTextos = (idioma) => {
    const es = idioma === "es";
    return (
      <section className="adm__tarjeta adm__tarjeta--texto" aria-labelledby={`h-${idioma}`}>
        <header className="adm__tarjeta-cab">
          <h3 id={`h-${idioma}`}>{es ? "Español" : "Inglés"}</h3>
          <p>{es ? "Idioma principal del sitio." : "Se muestra a quienes navegan en inglés."}</p>
        </header>
        <Campo clave={`${idioma}.title`} etiqueta={es ? "Título" : "Title"} requerido error={errores[`${idioma}.title`]}>
          {(p) => (
            <input
              {...p}
              value={datos[idioma].title}
              placeholder={es ? "Nombre · Rubro" : "Name · Industry"}
              onChange={(e) => (es ? cambiarTituloEs(e.target.value) : ponerTexto("en", "title", e.target.value))}
            />
          )}
        </Campo>
        <Campo
          clave={`${idioma}.blurb`}
          etiqueta={es ? "Resumen corto" : "Short summary"}
          ayuda="Es el texto que se ve en la tarjeta del portfolio."
          requerido
          error={errores[`${idioma}.blurb`]}
        >
          {(p) => (
            <textarea {...p} rows={3} value={datos[idioma].blurb} onChange={(e) => ponerTexto(idioma, "blurb", e.target.value)} />
          )}
        </Campo>
        <Campo clave={`${idioma}.description`} etiqueta={es ? "Descripción" : "Description"} ayuda="Opcional.">
          {(p) => (
            <textarea {...p} rows={5} value={datos[idioma].description} onChange={(e) => ponerTexto(idioma, "description", e.target.value)} />
          )}
        </Campo>
        <Campo clave={`${idioma}.domain`} etiqueta={es ? "Dominio o nombre" : "Domain or name"} ayuda="Opcional.">
          {(p) => <input {...p} value={datos[idioma].domain} onChange={(e) => ponerTexto(idioma, "domain", e.target.value)} />}
        </Campo>
        <Campo
          clave={`${idioma}.alt`}
          etiqueta={es ? "Texto alternativo de la imagen" : "Image alt text"}
          ayuda="Describe lo que se ve en la captura, para lectores de pantalla."
          requerido
          error={errores[`${idioma}.alt`]}
        >
          {(p) => <input {...p} value={datos[idioma].alt} onChange={(e) => ponerTexto(idioma, "alt", e.target.value)} />}
        </Campo>
      </section>
    );
  };

  return (
    <form className="adm__form" onSubmit={guardar} noValidate>
      <button type="button" className="adm__volver" onClick={cancelar}>
        <IconArrowLeft aria-hidden="true" /> Proyectos
      </button>

      <header className="adm__cab">
        <div>
          <h1>{nuevo ? "Nuevo proyecto" : datos.es.title || "Editar proyecto"}</h1>
          <p className="adm__sub">
            {nuevo ? "Completa los datos y sube una captura del sitio." : "Los cambios se ven en el sitio apenas guardes."}
          </p>
        </div>
      </header>

      {errorGeneral && (
        <div className="adm__error" role="alert">
          <IconAlertCircle aria-hidden="true" /> {errorGeneral}
        </div>
      )}

      <div className="adm__cuerpo">
        <div className="adm__col adm__col--principal">
          <section className="adm__tarjeta adm__t--datos" aria-labelledby="h-sitio">
            <header className="adm__tarjeta-cab">
              <h2 id="h-sitio">Datos del sitio</h2>
              <p>Cómo se llama y dónde está publicado.</p>
            </header>
            <div className="adm__fila">
              <Campo clave="url" etiqueta="Link del sitio" requerido error={errores.url}>
                {(p) => (
                  <input {...p} type="url" inputMode="url" value={datos.url} placeholder="https://" onChange={(e) => poner("url", e.target.value)} />
                )}
              </Campo>
              <Campo clave="categoria" etiqueta="Categoría" requerido error={errores.categoria}>
                {(p) => (
                  <select {...p} value={categoriaActual} onChange={(e) => cambiarCategoria(Number(e.target.value))}>
                    <option value={-1}>Elegir…</option>
                    {CATEGORIAS.map((c, i) => (
                      <option key={c.es} value={i}>
                        {c.es} · {c.en}
                      </option>
                    ))}
                  </select>
                )}
              </Campo>
            </div>
            <div className="adm__fila">
              <Campo
                clave="slug"
                etiqueta="Identificador"
                ayuda={nuevo ? "Se genera con el título. Solo minúsculas, números y guiones." : "No se puede cambiar."}
                requerido
                error={errores.slug}
              >
                {(p) => (
                  <input
                    {...p}
                    value={datos.slug}
                    disabled={!nuevo}
                    onChange={(e) => {
                      setSlugEditado(true);
                      poner("slug", e.target.value);
                    }}
                  />
                )}
              </Campo>
              <Campo clave="accent" etiqueta="Color de acento" ayuda="Tiñe la tarjeta del proyecto.">
                {(p) => (
                  <span className="adm__color">
                    <input {...p} type="color" value={datos.accent} onChange={(e) => poner("accent", e.target.value)} />
                    <code>{datos.accent}</code>
                  </span>
                )}
              </Campo>
            </div>
          </section>

          <div className="adm__textos adm__t--textos">
            {bloqueTextos("es")}
            {bloqueTextos("en")}
          </div>
        </div>
        <aside className="adm__col adm__col--lateral" aria-label="Publicación y capturas">
          <section className="adm__tarjeta adm__t--pub" aria-labelledby="h-pub">
            <header className="adm__tarjeta-cab">
              <h2 id="h-pub">Publicación</h2>
              <p>Qué se ve en el sitio.</p>
            </header>
            <div className="adm__opcion">
              <Interruptor
                activo={datos.publicado}
                onCambio={(v) => poner("publicado", v)}
                etiqueta={datos.publicado ? "Publicado" : "Oculto"}
              />
              <small>Si lo ocultas, desaparece del sitio sin borrarse.</small>
            </div>
            <div className="adm__opcion">
              <Interruptor
                activo={datos.destacado}
                onCambio={(v) => poner("destacado", v)}
                etiqueta="Destacado en el home"
              />
              <small>El home muestra solo los destacados (máximo {MAX_DESTACADOS}). El resto queda para «Ver más».</small>
            </div>
          </section>

          <section className="adm__tarjeta adm__t--capt" aria-labelledby="h-imagenes">
            <header className="adm__tarjeta-cab">
              <h2 id="h-imagenes">Capturas</h2>
              <p>Sirve PNG, JPG o WebP: se convierten solas a WebP liviano.</p>
            </header>
            <div className="adm__fila">
              <SubidaImagen
                clave="imagen"
                etiqueta="Escritorio"
                ayuda="1240 px de ancho. Hero + una sección representativa."
                valor={datos.imagen}
                ancho={1240}
                slug={datos.slug}
                tipo="escritorio"
                requerida
                error={errores.imagen}
                onCambio={(url) => poner("imagen", url)}
              />
              <SubidaImagen
                clave="imagen_movil"
                etiqueta="Móvil (opcional)"
                ayuda="720 px de ancho. Si falta, se usa la de escritorio."
                valor={datos.imagen_movil}
                ancho={720}
                slug={datos.slug}
                tipo="movil"
                onCambio={(url) => poner("imagen_movil", url)}
              />
            </div>
          </section>
        </aside>
      </div>

      {confirmarSalida && (
        <Confirmar
          titulo="¿Salir sin guardar?"
          icono={<IconAlertCircle />}
          textoConfirmar="Salir sin guardar"
          textoCancelar="Seguir editando"
          peligro
          onCancelar={() => setConfirmarSalida(false)}
          onConfirmar={onCancelar}
        >
          <p>Tienes cambios que todavía no guardaste. Si sales ahora, se perderán.</p>
        </Confirmar>
      )}

      <div className="adm__barra-guardar">
        <p className={`adm__dirty${sucio ? " is-sucio" : ""}`} role="status">
          <span aria-hidden="true" /> {sucio ? "Cambios sin guardar" : "Sin cambios"}
        </p>
        <div className="adm__acciones">
          <button type="button" className="adm__btn" onClick={cancelar}>
            Cancelar
          </button>
          <button className="adm__btn adm__btn--primario" disabled={guardando}>
            {guardando ? <IconLoader className="adm__giro" aria-hidden="true" /> : <IconCheck aria-hidden="true" />}
            {guardando ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ---------- Lista de proyectos ---------- */

function Paginador({ pagina, total, onCambio }) {
  const paginas = Math.ceil(total / POR_PAGINA);
  if (paginas <= 1) return null;
  const desde = (pagina - 1) * POR_PAGINA + 1;
  const hasta = Math.min(pagina * POR_PAGINA, total);
  return (
    <nav className="adm__paginas" aria-label="Paginación de proyectos">
      <p className="adm__paginas-info" aria-live="polite">
        Mostrando {desde}–{hasta} de {total}
      </p>
      <div className="adm__paginas-ctrl">
        <button type="button" className="adm__icono" disabled={pagina === 1} onClick={() => onCambio(pagina - 1)} aria-label="Página anterior">
          <IconChevronLeft aria-hidden="true" />
        </button>
        <ul>
          {Array.from({ length: paginas }, (_, i) => i + 1).map((n) => (
            <li key={n}>
              <button
                type="button"
                className={`adm__pag${n === pagina ? " is-actual" : ""}`}
                aria-current={n === pagina ? "page" : undefined}
                aria-label={`Página ${n}`}
                onClick={() => onCambio(n)}
              >
                {n}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="adm__icono" disabled={pagina === paginas} onClick={() => onCambio(pagina + 1)} aria-label="Página siguiente">
          <IconChevronRight aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

function Lista() {
  const [proyectos, setProyectos] = useState(null); // solo los de la página actual
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [publicados, setPublicados] = useState(0);
  const [destacados, setDestacados] = useState(0);
  const [ordenMax, setOrdenMax] = useState(-1);
  const [editando, setEditando] = useState(null); // null = lista, "nuevo" o un proyecto
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState(null);
  const [aBorrar, setABorrar] = useState(null); // proyecto que espera confirmación
  const [ocultos, setOcultos] = useState(() => new Set()); // borrados con "deshacer" pendiente
  const pendiente = useRef(null); // { id, timer, ejecutar }

  const avisar = useCallback(
    (texto, tipo = "ok", extra = {}) => setAviso({ texto, tipo, id: Date.now(), ...extra }),
    []
  );

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), aviso.duracion ?? (aviso.tipo === "error" ? 9000 : 4000));
    return () => clearTimeout(t);
  }, [aviso]);

  // Trae solo la página pedida (range) más dos datos livianos: cuántos hay
  // publicados y cuál es el último orden (para ubicar los nuevos al final).
  const cargar = useCallback(async () => {
    const desde = (pagina - 1) * POR_PAGINA;
    const [lista, ultimo, pub, dest] = await Promise.all([
      supabase
        .from("proyectos")
        .select("*", { count: "exact" })
        .order("orden", { ascending: true })
        .range(desde, desde + POR_PAGINA - 1),
      supabase.from("proyectos").select("orden").order("orden", { ascending: false }).limit(1),
      supabase.from("proyectos").select("id", { count: "exact", head: true }).eq("publicado", true),
      supabase.from("proyectos").select("id", { count: "exact", head: true }).eq("destacado", true),
    ]);
    if (lista.error) {
      setError(`No se pudieron cargar los proyectos: ${lista.error.message}`);
      return;
    }
    // Si borraste el último de la página, vuelve a la anterior.
    if (lista.data.length === 0 && pagina > 1) {
      setPagina(pagina - 1);
      return;
    }
    setError("");
    setProyectos(lista.data);
    setTotal(lista.count ?? 0);
    setPublicados(pub.count ?? 0);
    setDestacados(dest.count ?? 0);
    setOrdenMax(ultimo.data?.[0]?.orden ?? -1);
  }, [pagina]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const irAPagina = (n) => {
    setPagina(n);
    window.scrollTo({ top: 0 });
  };

  const alternarPublicado = async (p) => {
    const { error: fallo } = await supabase.from("proyectos").update({ publicado: !p.publicado }).eq("id", p.id);
    if (fallo) avisar(fallo.message, "error");
    else {
      avisar(p.publicado ? "Proyecto oculto del sitio." : "Proyecto publicado.");
      cargar();
    }
  };

  const alternarDestacado = async (p) => {
    if (!p.destacado && destacados >= MAX_DESTACADOS) {
      avisar(`Ya hay ${MAX_DESTACADOS} destacados. Quita uno antes de destacar otro.`, "error");
      return;
    }
    const { error: fallo } = await supabase.from("proyectos").update({ destacado: !p.destacado }).eq("id", p.id);
    if (fallo) avisar(fallo.code === "23514" ? `Ya hay ${MAX_DESTACADOS} destacados.` : fallo.message, "error");
    else {
      avisar(p.destacado ? "Quitado de los destacados." : "Proyecto destacado en el home.");
      cargar();
    }
  };

  // Intercambia el orden con el vecino (que puede estar en otra página).
  const mover = async (p, delta) => {
    const sube = delta < 0;
    const { data: vecinos, error: errVecino } = await supabase
      .from("proyectos")
      .select("id, orden")
      .filter("orden", sube ? "lt" : "gt", p.orden)
      .order("orden", { ascending: !sube })
      .limit(1);
    if (errVecino || !vecinos?.length) {
      avisar(errVecino?.message || "No hay a dónde moverlo.", "error");
      return;
    }
    const vecino = vecinos[0];
    const resultados = await Promise.all([
      supabase.from("proyectos").update({ orden: vecino.orden }).eq("id", p.id),
      supabase.from("proyectos").update({ orden: p.orden }).eq("id", vecino.id),
    ]);
    const fallo = resultados.find((r) => r.error);
    if (fallo) avisar(fallo.error.message, "error");
    else avisar("Orden actualizado.");
    cargar();
  };

  // Borrar con "deshacer": el proyecto desaparece de la lista al instante, pero el DELETE
  // real corre recién a los 10 s. Si cierras la pestaña antes, no se borra nada (lado seguro).
  const ejecutarBorrado = async (p) => {
    pendiente.current = null;
    const { error: fallo } = await supabase.from("proyectos").delete().eq("id", p.id);
    setOcultos((prev) => {
      const sig = new Set(prev);
      sig.delete(p.id);
      return sig;
    });
    if (fallo) avisar(`No se pudo borrar: ${fallo.message}`, "error");
    cargar();
  };

  const confirmarBorrado = () => {
    const p = aBorrar;
    setABorrar(null);
    // Si ya había otro borrado esperando, se confirma ahora.
    if (pendiente.current) {
      clearTimeout(pendiente.current.timer);
      pendiente.current.ejecutar();
    }
    setOcultos((prev) => new Set(prev).add(p.id));
    const ejecutar = () => ejecutarBorrado(p);
    pendiente.current = { id: p.id, timer: setTimeout(ejecutar, 10000), ejecutar };
    avisar("Proyecto borrado.", "ok", {
      duracion: 10000,
      accion: { texto: "Deshacer", onClick: () => deshacerBorrado(p.id) },
    });
  };

  const deshacerBorrado = (id) => {
    if (pendiente.current?.id !== id) return;
    clearTimeout(pendiente.current.timer);
    pendiente.current = null;
    setOcultos((prev) => {
      const sig = new Set(prev);
      sig.delete(id);
      return sig;
    });
    avisar("Se canceló el borrado.");
  };

  if (editando) {
    return (
      <>
        <Editor
          proyecto={editando === "nuevo" ? null : editando}
          siguienteOrden={ordenMax + 1}
          onCancelar={() => setEditando(null)}
          onGuardado={(texto, esNuevo) => {
            setEditando(null);
            avisar(texto);
            // Los nuevos van al final: salta a la última página.
            const ultima = Math.max(1, Math.ceil((total + 1) / POR_PAGINA));
            if (esNuevo && ultima !== pagina) setPagina(ultima);
            else cargar();
          }}
        />
        <Aviso aviso={aviso} />
      </>
    );
  }

  const desdeGlobal = (pagina - 1) * POR_PAGINA;

  return (
    <>
      <header className="adm__cab">
        <div>
          <h1>Proyectos</h1>
          <p className="adm__sub">
            {proyectos
              ? `${total} ${total === 1 ? "proyecto" : "proyectos"} · ${publicados} ${publicados === 1 ? "publicado" : "publicados"} · ${destacados}/${MAX_DESTACADOS} destacados en el home`
              : "Cargando…"}
          </p>
        </div>
        <button className="adm__btn adm__btn--primario" onClick={() => setEditando("nuevo")}>
          <IconPlus aria-hidden="true" /> Nuevo proyecto
        </button>
      </header>

      <p className="adm__nota">El orden de esta lista es el orden en el sitio. En el home solo se ven los destacados (máximo {MAX_DESTACADOS}), en este mismo orden.</p>

      {error && (
        <div className="adm__error" role="alert">
          <IconAlertCircle aria-hidden="true" /> {error}
          <button type="button" className="adm__btn adm__btn--chico" onClick={cargar}>
            Reintentar
          </button>
        </div>
      )}

      {!proyectos && !error && (
        <ul className="adm__lista" aria-hidden="true">
          {[0, 1, 2].map((n) => (
            <li key={n} className="adm__item adm__item--esqueleto" />
          ))}
        </ul>
      )}

      {proyectos && total === 0 && (
        <div className="adm__vacio">
          <h2>Todavía no hay proyectos</h2>
          <p className="adm__sub">Crea el primero para que aparezca en el portfolio.</p>
          <button className="adm__btn adm__btn--primario" onClick={() => setEditando("nuevo")}>
            <IconPlus aria-hidden="true" /> Nuevo proyecto
          </button>
        </div>
      )}

      <ul className="adm__lista">
        {proyectos?.filter((p) => !ocultos.has(p.id)).map((p, i) => {
          const titulo = p.es?.title || p.slug;
          const posicion = desdeGlobal + i;
          return (
            <li key={p.id} className="adm__item">
              <img className="adm__mini" src={p.imagen_movil || p.imagen} alt="" loading="lazy" />

              <div className="adm__info">
                <h2>{titulo}</h2>
                <p className="adm__meta">
                  {p.es?.category && <span className="adm__chip">{p.es.category}</span>}
                  <code>{p.slug}</code>
                </p>
              </div>

              <div className="adm__interruptores">
                <Interruptor
                  activo={p.publicado}
                  onCambio={() => alternarPublicado(p)}
                  etiqueta={p.publicado ? "Publicado" : "Oculto"}
                  contexto={titulo}
                />
                <Interruptor
                  activo={p.destacado}
                  onCambio={() => alternarDestacado(p)}
                  etiqueta="Destacado"
                  contexto={titulo}
                />
              </div>

              <div className="adm__item-acciones">
                <div className="adm__orden" role="group" aria-label={`Ordenar ${titulo}`}>
                  <button type="button" className="adm__icono" onClick={() => mover(p, -1)} disabled={posicion === 0} aria-label={`Subir ${titulo}`}>
                    <IconArrowUp aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="adm__icono"
                    onClick={() => mover(p, 1)}
                    disabled={posicion === total - 1}
                    aria-label={`Bajar ${titulo}`}
                  >
                    <IconArrowDown aria-hidden="true" />
                  </button>
                </div>
                {p.url ? (
                  <a className="adm__icono" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${titulo} en una pestaña nueva`}>
                    <IconExternalLink aria-hidden="true" />
                  </a>
                ) : (
                  <span className="adm__icono" aria-hidden="true" />
                )}
                <button className="adm__btn adm__btn--chico" onClick={() => setEditando(p)} aria-label={`Editar ${titulo}`}>
                  <IconPencil aria-hidden="true" /> Editar
                </button>
                <button type="button" className="adm__icono adm__icono--peligro" onClick={() => setABorrar(p)} aria-label={`Borrar ${titulo}`}>
                  <IconTrash aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <Paginador pagina={pagina} total={total} onCambio={irAPagina} />

      {aBorrar && (
        <Confirmar
          titulo="¿Borrar este proyecto?"
          icono={<IconTrash />}
          textoConfirmar="Sí, borrar"
          peligro
          onCancelar={() => setABorrar(null)}
          onConfirmar={confirmarBorrado}
        >
          <div className="adm__modal-proyecto">
            <img src={aBorrar.imagen_movil || aBorrar.imagen} alt="" />
            <div>
              <strong>{aBorrar.es?.title || aBorrar.slug}</strong>
              <code>{aBorrar.slug}</code>
            </div>
          </div>
          <p>Se quitará de la lista y del sitio. Tendrás 10 segundos para deshacerlo.</p>
          {aBorrar.destacado && (
            <div className="adm__modal-aviso">
              <IconStar aria-hidden="true" /> Está destacado en el home: quedará con un proyecto menos.
            </div>
          )}
        </Confirmar>
      )}

      <Aviso aviso={aviso} />
    </>
  );
}

/* ---------- Raíz ---------- */

export default function Admin() {
  const [sesion, setSesion] = useState(undefined); // undefined = comprobando
  const [esAdmin, setEsAdmin] = useState(null);

  useEffect(() => {
    document.title = "Panel · Astravia Studio";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session));
    const { data } = supabase.auth.onAuthStateChange((_evento, nueva) => setSesion(nueva));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!sesion) {
      setEsAdmin(null);
      return;
    }
    let vivo = true;
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", sesion.user.id)
      .maybeSingle()
      .then(({ data }) => vivo && setEsAdmin(Boolean(data)));
    return () => {
      vivo = false;
    };
  }, [sesion]);

  const salir = () => supabase.auth.signOut();

  if (sesion === undefined || (sesion && esAdmin === null)) {
    return (
      <PantallaAcceso>
        <main className="adm__acceso-centro">
          <div className="adm__sub" role="status">
            <IconLoader className="adm__giro" aria-hidden="true" /> Cargando…
          </div>
        </main>
      </PantallaAcceso>
    );
  }
  if (!sesion) return <Login />;
  if (!esAdmin) {
    return (
      <PantallaAcceso>
        <main className="adm__acceso-centro">
          <div className="adm__login adm__login--vidrio">
            <span className="adm__insignia">
              <img src="/brand/isotipo-astravia.png" alt="Astravia" width="76" height="76" />
            </span>
            <header className="adm__login-cab">
              <h1>Sin permisos</h1>
              <p className="adm__sub">
                Tu cuenta ({sesion.user.email}) no es administradora. Pídele a un admin que te dé de alta.
              </p>
            </header>
            <button type="button" className="adm__btn adm__btn--ancho" onClick={salir}>
              <IconLogOut aria-hidden="true" /> Salir
            </button>
          </div>
        </main>
      </PantallaAcceso>
    );
  }

  return (
    <div className="adm">
      <BarraAdmin sesion={sesion} onSalir={salir} />
      <main className="adm__main container container--full">
        <div className="adm__contenido">
          <Lista />
        </div>
      </main>
    </div>
  );
}
