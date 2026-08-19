/**
 * CLASE Usuario
 *
 * DEMUESTRA:
 * - ASOCIACIÓN: Relación débil con Contenido a través del historial
 * - ENCAPSULAMIENTO: Email es privado, historial es privado
 *
 * RESPONSABILIDAD: Representar a un usuario de la plataforma
 */
export class Usuario {
    readonly nombre: string;
    private email: string;
    private historial: Contenido[] = [];

    constructor(nombre: string, email: string) {
        this.nombre = nombre;
        this.email = email;
    }

    ver(contenido: Contenido): string {
        this.historial.push(contenido);
        contenido.marcarVisto(this);
        return contenido.reproducir();
    }

    getHistorial(): Contenido[] {
        return [...this.historial];
    }

    getEmail(): string {
        return this.email;
    }
}

import { Contenido } from './Contenido';
