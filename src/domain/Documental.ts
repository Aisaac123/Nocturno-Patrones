import { Contenido } from './Contenido';

/**
 * CLASE Documental
 *
 * DEMUESTRA:
 * - HERENCIA: Extiende Contenido
 * - POLIMORFISMO: Implementa métodos abstractos de forma específica para documentales
 * - ENCAPSULAMIENTO: duracionMin es privado
 *
 * RESPONSABILIDAD: Representar un documental cinematográfico
 */
export class Documental extends Contenido {
    // Campo privado - encapsulamiento
    private duracionMin: number;

    // Campos públicos - accesibles directamente
    public tema: string;
    public investigador: string;

    constructor(titulo: string, anio: number, sinopsis: string, duracionMin: number, tema: string, investigador: string) {
        super(titulo, anio, sinopsis);
        this.duracionMin = duracionMin;
        this.tema = tema;
        this.investigador = investigador;
    }

    /**
     * Implementación de método abstracto
     * POLIMORFISMO: Comportamiento específico para documentales
     */
    reproducir(): string {
        return `Reproduciendo documental: ${this.titulo} - Tema: ${this.tema} - Investigado por ${this.investigador}`;
    }

    /**
     * Implementación de método abstracto
     * POLIMORFISMO: Retorna duración específica del documental
     */
    duracionTotal(): number {
        return this.duracionMin;
    }

    /**
     * Implementación de getter abstracto
     * POLIMORFISMO: Identifica este contenido como documental
     */
    get tipo(): string {
        return 'Documental';
    }
}
