import { Contenido } from './Contenido';

/**
 * CLASE Pelicula
 *
 * DEMUESTRA:
 * - HERENCIA: Extiende Contenido
 * - POLIMORFISMO: Implementa métodos abstractos específicos para películas
 * - ENCAPSULAMIENTO: duracionMin es privado
 *
 * RESPONSABILIDAD: Representar una película cinematográfica
 */
export class Pelicula extends Contenido {
    private duracionMin: number;
    public director: string;

    constructor(titulo: string, anio: number, sinopsis: string, duracionMin: number, director: string, youtubeUrl: string = '') {
        super(titulo, anio, sinopsis, youtubeUrl);
        this.duracionMin = duracionMin;
        this.director = director;
    }

    reproducir(): string {
        return `Reproduciendo película: ${this.titulo} (${this.anio}) - Dirigida por ${this.director}`;
    }

    duracionTotal(): number {
        return this.duracionMin;
    }

    get tipo(): string {
        return 'Película';
    }
}
