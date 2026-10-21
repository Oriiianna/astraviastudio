import { useEffect, useRef } from "react";

// La site key es pública por diseño (va en el HTML de cualquier web que use
// Turnstile). La clave secreta vive solo en el servidor (TURNSTILE_SECRET_KEY).
// Para probar en local sin dominio autorizado: VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAFfOREHnZWPiR9Q4";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise;

// El script se baja una sola vez y solo cuando el formulario está cerca.
function cargarScript() {
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(window.turnstile);
      script.onerror = () => {
        scriptPromise = undefined; // permite reintentar
        reject(new Error("turnstile"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

// Widget invisible: solo se ve si Cloudflare considera necesario un reto.
// `onToken` recibe el token (o null si expira o falla); `resetSignal` cambia
// cada vez que hay que pedir un token nuevo (los tokens valen una sola vez).
export default function Turnstile({ onToken, resetSignal }) {
  const contenedorRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    const el = contenedorRef.current;
    let cancelado = false;

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observer.disconnect();
        cargarScript()
          .then((turnstile) => {
            if (cancelado || !turnstile) return;
            widgetIdRef.current = turnstile.render(el, {
              sitekey: SITE_KEY,
              theme: "dark",
              appearance: "interaction-only",
              size: el.clientWidth && el.clientWidth < 300 ? "compact" : "flexible",
              callback: (token) => onTokenRef.current(token),
              "expired-callback": () => onTokenRef.current(null),
              "error-callback": () => {
                onTokenRef.current(null);
                return true;
              },
            });
          })
          .catch(() => onTokenRef.current(null));
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);

    return () => {
      cancelado = true;
      observer.disconnect();
      if (widgetIdRef.current != null) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetSignal && widgetIdRef.current != null) {
      window.turnstile?.reset(widgetIdRef.current);
    }
  }, [resetSignal]);

  return <div className="contact__turnstile" ref={contenedorRef} />;
}
