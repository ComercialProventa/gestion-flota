/**
 * Utilidades de cálculo de fechas para vigencias legales.
 *
 * Reglas de negocio:
 * - Verde:   > 30 días restantes
 * - Amarillo: <= 30 días y > 10 días
 * - Rojo:    <= 10 días (o ya vencido)
 *
 * El porcentaje se calcula asumiendo un ciclo de 365 días como 100%.
 */

export type EstadoVigencia = "verde" | "amarillo" | "rojo";

export type InfoVigencia = {
  diasRestantes: number;
  porcentajeRestante: number;
  estadoColor: EstadoVigencia;
};

/**
 * Calcula la información de vigencia de un documento legal.
 *
 * @param fechaVencimiento - Fecha de vencimiento en formato string (YYYY-MM-DD)
 * @returns Objeto con días restantes, porcentaje (0-100) y estado de color
 */
export function calcularVigencia(fechaVencimiento: string | null): InfoVigencia | null {
  if (!fechaVencimiento) return null;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche
  const vence = new Date(fechaVencimiento);
  vence.setHours(0, 0, 0, 0);

  const diffMs = vence.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Porcentaje: 365 días = 100%, clamp entre 0 y 100
  const porcentajeRestante = Math.max(0, Math.min(100, Math.round((diasRestantes / 365) * 100)));

  // Determinar color según reglas de negocio
  let estadoColor: EstadoVigencia;
  if (diasRestantes <= 10) {
    estadoColor = "rojo";
  } else if (diasRestantes <= 30) {
    estadoColor = "amarillo";
  } else {
    estadoColor = "verde";
  }

  return { diasRestantes, porcentajeRestante, estadoColor };
}
