/**
 * CLASE Episodio
 *
 * DEMUESTRA:
 * - VALUE OBJECT: Clase simple sin identidad propia
 * - POLIMORFISMO: Sobrecarga de constructor
 *
 * RESPONSABILIDAD: Representar un episodio individual de una serie
 */
export class Episodio {
    readonly numero: number;
    readonly titulo: string;
    readonly duracionMin: number;

    constructor(numero: number, titulo: string, duracionMin: number);
    constructor(numero: number, titulo: string, duracionMin: number, descripcion: string);
    constructor(numero: number, titulo: string, duracionMin: number, descripcion?: string) {
        this.numero = numero;
        this.titulo = titulo;
        this.duracionMin = duracionMin;
    }
}
