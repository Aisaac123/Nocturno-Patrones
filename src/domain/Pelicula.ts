import { Contenido } from './Contenido';

/**
 * CLASE Pelicula
 *
 * DEMUESTRA:
 * - HERENCIA: Extiende Contenido, hereda todos sus campos y métodos
 * - POLIMORFISMO: Implementa reproducir(), duracionTotal() y get tipo()
 *   de forma específica para películas
 * - ENCAPSULAMIENTO: duracionMin es privado
 *
 * RESPONSABILIDAD: Representar una película cinematográfica
 */
export class Pelicula extends Contenido {
    // Campo privado - encapsulamiento
    private duracionMin: number;

    // Campo público - accesible directamente
    public director: string;

    constructor(titulo: string, anio: number, sinopsis: string, duracionMin: number, director: string, youtubeUrl: string = '') {
        super(titulo, anio, sinopsis, youtubeUrl);
        this.duracionMin = duracionMin;
        this.director = director;
    }

    /**
     * Implementación de método abstracto
     * POLIMORFISMO: Comportamiento específico para películas
     */
    reproducir(): string {
        return `Reproduciendo película: ${this.titulo} (${this.anio}) - Dirigida por ${this.director}`;
    }

    /**
     * Implementación de método abstracto
     * POLIMORFISMO: Retorna duración específica de película
     */
    duracionTotal(): number {
        return this.duracionMin;
    }

    /**
     * Implementación de getter abstracto
     * POLIMORFISMO: Identifica este contenido como película
     */
    get tipo(): string {
        return 'Película';
    }
}
