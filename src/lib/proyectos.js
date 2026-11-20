import fallback from '../data/proyectos.json'
import { SUPABASE_KEY, SUPABASE_URL } from './supabaseConfig.js'

// Cuántos proyectos destacados muestra el home. La base lo impone con un
// trigger (limitar_destacados), así que este número tiene que coincidir.
export const LIMITE_DESTACADOS = 6

// Forma que usa el sitio: la misma del respaldo (proyectos.json).
export const deFila = (fila) => ({
  slug: fila.slug,
  url: fila.url,
  accent: fila.accent,
  imagen: fila.imagen,
  imagenMovil: fila.imagen_movil,
  publicado: fila.publicado,
  destacado: fila.destacado,
  es: fila.es ?? {},
  en: fila.en ?? {},
})

// Respaldo: lo que hay en el repo. Se usa mientras carga y si Supabase falla
// (proyecto pausado, sin red…), así el portfolio nunca queda vacío.
export const PROYECTOS_RESPALDO = fallback.proyectos.filter((p) => p.publicado)
export const DESTACADOS_RESPALDO = PROYECTOS_RESPALDO.filter((p) => p.destacado).slice(0, LIMITE_DESTACADOS)

const cache = {}

// Lectura pública: sin librería, solo la API REST. El RLS devuelve únicamente
// los proyectos publicados. Con soloDestacados trae los del home (máx. 6);
// sin él, todos (para el futuro botón "Ver más").
export async function cargarProyectosPublicos({ soloDestacados = false } = {}) {
  const clave = soloDestacados ? 'destacados' : 'todos'
  if (cache[clave]) return cache[clave]
  const filtro = soloDestacados ? `&destacado=eq.true&limit=${LIMITE_DESTACADOS}` : ''
  const respuesta = await fetch(
    `${SUPABASE_URL}/rest/v1/proyectos?select=slug,url,accent,imagen,imagen_movil,publicado,destacado,es,en&publicado=eq.true${filtro}&order=orden.asc`,
    { headers: { apikey: SUPABASE_KEY } }
  )
  if (!respuesta.ok) throw new Error(`Supabase ${respuesta.status}`)
  const filas = await respuesta.json()
  if (!Array.isArray(filas) || filas.length === 0) throw new Error('Sin proyectos')
  cache[clave] = filas.map(deFila)
  return cache[clave]
}
