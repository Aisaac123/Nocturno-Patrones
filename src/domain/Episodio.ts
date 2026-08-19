/**
 * CLASE Episodio
 *
 * DEMUESTRA:
 * - VALUE OBJECT: Clase simple sin identidad propia,
 *   definida por sus atributos (numero, titulo, duracion)
 *
 * RESPONSABILIDAD: Representar un episodio individual de una serie
 */
export class Episodio {
    readonly numero: number;
    readonly titulo: string;
    readonly duracionMin: number;

    constructor(numero: number, titulo: string, duracionMin: number) {
        this.numero = numero;
        this.titulo = titulo;
        this.duracionMin = duracionMin;
    }
}
