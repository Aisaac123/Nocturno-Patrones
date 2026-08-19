import { Contenido } from './Contenido';
import { Temporada } from './Temporada';

/**
 * CLASE Serie
 *
 * DEMUESTRA:
 * - HERENCIA: Extiende Contenido
 * - POLIMORFISMO: Implementa métodos abstractos de forma específica para series
 * - COMPOSICIÓN: Las temporadas viven solo dentro de esta instancia de Serie
 *   No hay setter externo que permita "trasplantar" temporadas entre series
 * - ENCAPSULAMIENTO: temporadas es privado, sin setter público
 *
 * RESPONSABILIDAD: Representar una serie de televisión con temporadas y episodios
 */
export class Serie extends Contenido {
    // Campo privado - COMPOSICIÓN estricta
    // Las temporadas viven y mueren con esta serie
    private temporadas: Temporada[] = [];

    // Campo público
    public creador: string;

    constructor(titulo: string, anio: number, sinopsis: string, creador: string, youtubeUrl: string = '') {
        super(titulo, anio, sinopsis, youtubeUrl);
        this.creador = creador;
    }

    /**
     * Método para agregar temporadas
     * COMPOSICIÓN: Solo se pueden agregar temporadas, no obtener o modificar
     * Esto asegura que las temporadas pertenezcan exclusivamente a esta serie
     */
    agregarTemporada(numero: number): Temporada {
        const temporada = new Temporada(numero);
        this.temporadas.push(temporada);
        return temporada;
    }

    /**
     * Método privado para obtener temporadas
     * ENCAPSULAMIENTO: Solo accesible internamente
     */
    private getTemporadas(): Temporada[] {
        return [...this.temporadas];
    }

    /**
     * Implementación de método abstracto
     * POLIMORFISMO: Comportamiento específico para series
     * Calcula la última temporada vista (simulado)
     */
    reproducir(): string {
        const ultimaTemporada = this.temporadas.length > 0
            ? this.temporadas[this.temporadas.length - 1].numero
            : 0;
        return `Reproduciendo serie: ${this.titulo} - Temporada ${ultimaTemporada}`;
    }

    /**
     * Implementación de método abstracto
     * POLIMORFISMO: Suma duración de todas las temporadas
     */
    duracionTotal(): number {
        return this.temporadas.reduce((total, temp) => total + temp.duracionMin, 0);
    }

    /**
     * Implementación de getter abstracto
     * POLIMORFISMO: Identifica este contenido como serie
     */
    get tipo(): string {
        return 'Serie';
    }

    /**
     * Getter para número de temporadas
     * ENCAPSULAMIENTO: Expone solo el count, no las temporadas
     */
    get totalTemporadas(): number {
        return this.temporadas.length;
    }

    /**
     * Método para obtener temporadas para UI
     * ENCAPSULAMIENTO: Retorna copia para evitar manipulación externa
     */
    obtenerTemporadas(): Temporada[] {
        return this.getTemporadas();
    }
}
