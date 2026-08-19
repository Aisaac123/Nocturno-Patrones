import { Episodio } from './Episodio';

/**
 * CLASE Temporada
 *
 * DEMUESTRA:
 * - COMPOSICIÓN (parte de): Las temporadas viven solo dentro de una Serie
 * - ENCAPSULAMIENTO: episodios es privado, acceso controlado
 * - POLIMORFISMO: Sobrecarga de constructor
 *
 * RESPONSABILIDAD: Representar una temporada de una serie con sus episodios
 */
export class Temporada {
    readonly numero: number;
    private episodios: Episodio[] = [];

    constructor(numero: number);
    constructor(numero: number, episodiosIniciales: Episodio[]);
    constructor(numero: number, episodiosIniciales?: Episodio[]) {
        this.numero = numero;
        if (episodiosIniciales) {
            this.episodios = [...episodiosIniciales];
        }
    }

    agregarEpisodio(episodio: Episodio): void {
        this.episodios.push(episodio);
    }

    get duracionMin(): number {
        return this.episodios.reduce((total, ep) => total + ep.duracionMin, 0);
    }

    getEpisodios(): Episodio[] {
        return [...this.episodios];
    }
}
