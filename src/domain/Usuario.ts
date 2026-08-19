/**
 * CLASE Usuario
 *
 * DEMUESTRA:
 * - ASOCIACIÓN: Relación débil con Contenido a través del historial
 * - ENCAPSULAMIENTO: Email es privado, historial es privado
 * - POLIMORFISMO: Sobrecarga de ver() y constructor
 *
 * RESPONSABILIDAD: Representar a un usuario de la plataforma
 */
export class Usuario {
    readonly nombre: string;
    private email: string;
    private historial: Contenido[] = [];

    constructor(nombre: string, email: string);
    constructor(nombre: string, email: string, historialInicial: Contenido[]);
    constructor(nombre: string, email: string, historialInicial?: Contenido[]) {
        this.nombre = nombre;
        this.email = email;
        if (historialInicial) {
            this.historial = [...historialInicial];
        }
    }

    ver(contenido: Contenido): string;
    ver(contenido: Contenido, autoplay: boolean): string;
    ver(contenido: Contenido, autoplay: boolean = false): string {
        this.historial.push(contenido);
        contenido.marcarVisto(this);
        if (autoplay) {
            return contenido.reproducir(true);
        }
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
