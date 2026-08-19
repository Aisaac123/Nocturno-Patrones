/**
 * CLASE Usuario
 *
 * DEMUESTRA:
 * - ASOCIACIÓN: Relación débil con Contenido a través del historial
 *   El usuario "conoce" contenidos pero no los posee ni controla su ciclo de vida
 * - ENCAPSULAMIENTO: Email es privado, historial es privado
 *
 * RESPONSABILIDAD: Representar a un usuario de la plataforma con su
 * historial de visualizaciones
 */
export class Usuario {
    // Campo readonly - inmutable después de construcción
    readonly nombre: string;

    // Campo privado - completamente encapsulado
    private email: string;

    // Campo privado - historial de visualizaciones
    // ASOCIACIÓN: Referencias a Contenido sin propiedad
    private historial: any[] = [];

    constructor(nombre: string, email: string) {
        this.nombre = nombre;
        this.email = email;
    }

    /**
     * Método para ver un contenido
     * ASOCIACIÓN: Establece relación temporal con Contenido
     * - Agrega al historial del usuario
     * - Notifica al contenido que fue visto
     * - Inicia la reproducción
     */
    ver(contenido: any): string {
        // Agregar al historial (ASOCIACIÓN)
        this.historial.push(contenido);

        // Notificar al contenido que fue visto
        contenido.marcarVisto(this);

        // Reproducir el contenido
        return contenido.reproducir();
    }

    /**
     * Getter para historial
     * ENCAPSULAMIENTO: Retorna copia para evitar manipulación externa
     */
    getHistorial(): any[] {
        return [...this.historial];
    }

    /**
     * Getter para email (encapsulado)
     */
    getEmail(): string {
        return this.email;
    }
}
