/**
 * UTILS - Formatters
 *
 * DEMUESTRA:
 * - HELPERS PARA UX: Funciones auxiliares para mejorar la experiencia
 *   de usuario sin violar principios de POO en el dominio
 *
 * RESPONSABILIDAD: Formatear datos para presentación en la UI
 */

/**
 * Formatea duración en minutos a formato "Xh Ym"
 * @param minutos - Duración total en minutos
 * @returns String formateado (ej: "2h 30m")
 */
export function formatearDuracion(minutos: number): string {
    if (minutos <= 0) return '0m';

    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    if (horas > 0 && mins > 0) {
        return `${horas}h ${mins}m`;
    } else if (horas > 0) {
        return `${horas}h`;
    } else {
        return `${mins}m`;
    }
}

/**
 * Formatea promedio de calificación a representación visual de estrellas
 * @param promedio - Promedio de calificación (0-5)
 * @returns String con emojis de estrellas (ej: "★★★★☆")
 */
export function formatearEstrellas(promedio: number): string {
    const estrellas = Math.round(promedio);
    let resultado = '';

    for (let i = 0; i < 5; i++) {
        if (i < estrellas) {
            resultado += '★';
        } else {
            resultado += '☆';
        }
    }

    return resultado;
}

/**
 * Formatea tipo de contenido para mostrar en UI
 * @param tipo - Tipo de contenido (ej: "Película", "Serie")
 * @returns String formateado
 */
export function formatearTipo(tipo: string): string {
    return tipo.toUpperCase();
}

/**
 * Formatea número para mostrar con separadores de miles
 * @param numero - Número a formatear
 * @returns String formateado (ej: "1,234")
 */
export function formatearNumero(numero: number): string {
    return numero.toLocaleString('es-ES');
}
