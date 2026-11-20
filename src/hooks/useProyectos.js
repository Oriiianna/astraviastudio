import { useEffect, useState } from 'react'
import {
  DESTACADOS_RESPALDO,
  PROYECTOS_RESPALDO,
  cargarProyectosPublicos,
} from '../lib/proyectos.js'

// Proyectos del portfolio: arranca con el respaldo del repo y los reemplaza
// por los del panel en cuanto llegan. Si la carga falla, se queda con el respaldo.
// { soloDestacados: true } → solo los destacados (los 6 del home).
export function useProyectos({ soloDestacados = false } = {}) {
  const [proyectos, setProyectos] = useState(
    soloDestacados ? DESTACADOS_RESPALDO : PROYECTOS_RESPALDO
  )

  useEffect(() => {
    let vivo = true
    cargarProyectosPublicos({ soloDestacados })
      .then((lista) => vivo && setProyectos(lista))
      .catch(() => {})
    return () => {
      vivo = false
    }
  }, [soloDestacados])

  return proyectos
}
