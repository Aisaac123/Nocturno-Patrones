import { Episodio } from './Episodio';

/**
 * CLASE Temporada
 *
 * DEMUESTRA:
 * - COMPOSICIÓN (parte de): Las temporadas viven solo dentro de una Serie
 * - ENCAPSULAMIENTO: episodios es privado, acceso controlado
 *
 * RESPONSABILIDAD: Representar una temporada de una serie con sus episodios
 */
export class Temporada {
    readonly numero: number;

    // Campo privado - encapsulamiento estricto
    private episodios: Episodio[] = [];

    constructor(numero: number) {
        this.numero = numero;
    }

    /**
     * Método para agregar episodios
     * ENCAPSULAMIENTO: Controla cómo se agregan episodios
     */
    agregarEpisodio(episodio: Episodio): void {
        this.episodios.push(episodio);
    }

    /**
     * Getter para duración total
     * ENCAPSULAMIENTO: Cálculo sin exponer el array interno
     */
    get duracionMin(): number {
        return this.episodios.reduce((total, ep) => total + ep.duracionMin, 0);
    }

    /**
     * Getter para episodios
     * ENCAPSULAMIENTO: Retorna copia para evitar manipulación externa
     */
    getEpisodios(): Episodio[] {
        return [...this.episodios];
    }
}
