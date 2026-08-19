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
 * Obtiene el color correspondiente al tipo de contenido
 * @param tipo - Tipo de contenido
 * @returns Color en formato CSS
 */
export function obtenerColorTipo(tipo: string): string {
    const colores: Record<string, string> = {
        'PELÍCULA': '#2563eb',      // Azul
        'SERIE': '#8b5cf6',          // Púrpura
        'DOCUMENTAL': '#10b981'     // Verde
    };

    return colores[tipo.toUpperCase()] || '#6b7280';
}

/**
 * Formatea número para mostrar con separadores de miles
 * @param numero - Número a formatear
 * @returns String formateado (ej: "1,234")
 */
export function formatearNumero(numero: number): string {
    return numero.toLocaleString('es-ES');
}

/**
 * Extrae el ID de video de YouTube de una URL
 * @param url - URL de YouTube
 * @returns ID del video o string vacío si no es válida
 */
export function extraerYoutubeId(url: string): string {
    if (!url) return '';

    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);

    return match ? match[1] : '';
}

/**
 * Genera el HTML del iframe de YouTube
 * @param videoId - ID del video de YouTube
 * @returns HTML del iframe
 */
export function generarYoutubeEmbed(videoId: string): string {
    if (!videoId) return '';

    return `
        <div class="youtube-container">
            <iframe
                src="https://www.youtube.com/embed/${videoId}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="youtube-iframe"
            ></iframe>
        </div>
    `;
}
