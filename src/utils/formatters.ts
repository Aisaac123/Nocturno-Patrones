/**
 * Utils - Formatters
 *
 * RESPONSABILIDAD: Formatear datos para presentación
 */

export function formatearDuracion(minutos: number): string {
    if (minutos < 60) return `${minutos}m`;
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return mins > 0 ? `${horas}h ${mins}m` : `${horas}h`;
}

export function formatearEstrellas(promedio: number): string {
    const estrellas = Math.round(promedio);
    return '★'.repeat(estrellas) + '☆'.repeat(5 - estrellas);
}

export function formatearTipo(tipo: string): string {
    return tipo;
}

export function formatearNumero(numero: number): string {
    return numero.toLocaleString('es-ES');
}

export function extraerYoutubeId(url: string): string {
    if (!url) return '';

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return '';
}

export function generarYoutubeEmbed(videoId: string): string {
    return `
        <div class="youtube-container">
            <iframe
                class="youtube-iframe"
                src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        </div>
    `;
}

export function obtenerColorTipo(tipo: string): string {
    const colores: Record<string, string> = {
        'Película': '#2563eb',
        'Serie': '#8b5cf6',
        'Documental': '#10b981'
    };
    return colores[tipo] || '#6b7280';
}
