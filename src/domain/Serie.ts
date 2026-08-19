import { Contenido } from './Contenido';
import { Temporada } from './Temporada';

/**
 * CLASE Serie
 *
 * DEMUESTRA:
 * - HERENCIA: Extiende Contenido
 * - POLIMORFISMO: Implementa métodos abstractos específicos para series
 * - COMPOSICIÓN: Temporadas viven solo dentro de esta instancia
 * - ENCAPSULAMIENTO: temporadas es privado, sin setter público
 *
 * RESPONSABILIDAD: Representar una serie de televisión
 */
export class Serie extends Contenido {
    private temporadas: Temporada[] = [];
    public creador: string;

    constructor(titulo: string, anio: number, sinopsis: string, creador: string, youtubeUrl: string = '') {
        super(titulo, anio, sinopsis, youtubeUrl);
        this.creador = creador;
    }

    agregarTemporada(numero: number): Temporada {
        const temporada = new Temporada(numero);
        this.temporadas.push(temporada);
        return temporada;
    }

    private getTemporadas(): Temporada[] {
        return [...this.temporadas];
    }

    reproducir(): string {
        const ultimaTemporada = this.temporadas.length > 0
            ? this.temporadas[this.temporadas.length - 1].numero
            : 0;
        return `Reproduciendo serie: ${this.titulo} - Temporada ${ultimaTemporada}`;
    }

    duracionTotal(): number {
        return this.temporadas.reduce((total, temp) => total + temp.duracionMin, 0);
    }

    get tipo(): string {
        return 'Serie';
    }

    get totalTemporadas(): number {
        return this.temporadas.length;
    }

    obtenerTemporadas(): Temporada[] {
        return this.getTemporadas();
    }
}
