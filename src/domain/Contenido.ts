/**
 * CLASE ABSTRACTA Contenido
 *
 * DEMUESTRA:
 * - ABSTRACCIÓN: Define la interfaz común para todos los tipos de contenido
 *   con métodos abstractos que las subclases deben implementar
 * - ENCAPSULAMIENTO: Campos privados y protegidos controlan el acceso
 *   a datos sensibles como calificaciones y usuarios que vieron el contenido
 *
 * RESPONSABILIDAD: Definir el contrato base para cualquier contenido
 * reproducible en la plataforma (películas, series, documentales)
 */
export abstract class Contenido {
    // Campos readonly - inmutables después de construcción
    readonly titulo: string;
    readonly anio: number;

    // Campo protegido - accesible solo por esta clase y sus subclases
    protected sinopsis: string;

    // Campo privado - completamente encapsulado, acceso controlado
    private calificaciones: number[] = [];

    // Campo protegido - accesible por subclases para tracking de vistas
    protected vistoPor: Set<any> = new Set();

    // Campo protegido - URL de YouTube para reproducción
    protected youtubeUrl: string;

    constructor(titulo: string, anio: number, sinopsis: string, youtubeUrl: string = '') {
        this.titulo = titulo;
        this.anio = anio;
        this.sinopsis = sinopsis;
        this.youtubeUrl = youtubeUrl;
    }

    /**
     * Método concreto - comportamiento compartido por todos los contenidos
     * ENCAPSULAMIENTO: Valida que la calificación esté en rango válido
     */
    calificar(estrellas: number): void {
        if (estrellas < 1 || estrellas > 5) {
            throw new Error('La calificación debe estar entre 1 y 5 estrellas');
        }
        this.calificaciones.push(estrellas);
    }

    /**
     * Getter con lógica encapsulada
     * ENCAPSULAMIENTO: Cálculo del promedio sin exponer el array interno
     */
    get promedioCalificacion(): number {
        if (this.calificaciones.length === 0) {
            return 0;
        }
        const suma = this.calificaciones.reduce((acc, val) => acc + val, 0);
        return suma / this.calificaciones.length;
    }

    /**
     * Getter para número de calificaciones
     * ENCAPSULAMIENTO: Expone solo el count, no los valores individuales
     */
    get totalCalificaciones(): number {
        return this.calificaciones.length;
    }

    /**
     * Método para marcar que un usuario vio este contenido
     * ENCAPSULAMIENTO: Controla el acceso al Set de usuarios
     */
    marcarVisto(usuario: any): void {
        this.vistoPor.add(usuario);
    }

    /**
     * Getter para total de vistas
     * ENCAPSULAMIENTO: Expone solo el tamaño del Set
     */
    get totalVistas(): number {
        return this.vistoPor.size;
    }

    /**
     * Getter para URL de YouTube
     * ENCAPSULAMIENTO: Expone la URL para reproducción
     */
    get urlYoutube(): string {
        return this.youtubeUrl;
    }

    /**
     * Setter para URL de YouTube
     * ENCAPSULAMIENTO: Controla la actualización de la URL
     */
    setUrlYoutube(url: string): void {
        this.youtubeUrl = url;
    }

    /**
     * MÉTODOS ABSTRACTOS - ABSTRACCIÓN
     * Cada subclase debe implementar estos según su naturaleza
     */
    abstract reproducir(): string;
    abstract duracionTotal(): number;
    abstract get tipo(): string;
}
