import { Contenido } from './Contenido';

/**
 * CLASE Documental
 *
 * DEMUESTRA:
 * - HERENCIA: Extiende Contenido
 * - POLIMORFISMO: Implementa métodos abstractos específicos para documentales
 * - ENCAPSULAMIENTO: duracionMin es privado
 *
 * RESPONSABILIDAD: Representar un documental cinematográfico
 */
export class Documental extends Contenido {
    private duracionMin: number;
    public tema: string;
    public investigador: string;

    constructor(titulo: string, anio: number, sinopsis: string, duracionMin: number, tema: string, investigador: string, youtubeUrl: string = '') {
        super(titulo, anio, sinopsis, youtubeUrl);
        this.duracionMin = duracionMin;
        this.tema = tema;
        this.investigador = investigador;
    }

    reproducir(): string {
        return `Reproduciendo documental: ${this.titulo} - Tema: ${this.tema} - Investigado por ${this.investigador}`;
    }

    duracionTotal(): number {
        return this.duracionMin;
    }

    get tipo(): string {
        return 'Documental';
    }
}
