/**
 * CLASE ListaDeReproduccion
 *
 * DEMUESTRA:
 * - AGREGACIÓN: Contiene referencias a Contenido sin controlar su ciclo de vida
 * - ENCAPSULAMIENTO: items es privado, acceso controlado
 *
 * RESPONSABILIDAD: Lista personalizada de contenidos favoritos
 */
export class ListaDeReproduccion {
    readonly nombre: string;
    readonly propietario: Usuario;
    private items: Contenido[] = [];

    constructor(nombre: string, propietario: Usuario) {
        this.nombre = nombre;
        this.propietario = propietario;
    }

    agregar(contenido: Contenido): void {
        if (!this.items.includes(contenido)) {
            this.items.push(contenido);
        }
    }

    quitar(contenido: Contenido): void {
        const index = this.items.indexOf(contenido);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    contiene(contenido: Contenido): boolean {
        return this.items.includes(contenido);
    }

    getItems(): Contenido[] {
        return [...this.items];
    }

    get totalItems(): number {
        return this.items.length;
    }
}

import { Usuario } from './Usuario';
import { Contenido } from './Contenido';
