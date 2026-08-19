/**
 * CLASE Catalogo
 *
 * DEMUESTRA:
 * - ENCAPSULAMIENTO: items es privado, acceso controlado
 *
 * RESPONSABILIDAD: Administrar la colección de contenidos
 */
export class Catalogo {
    private items: Contenido[] = [];

    agregar(contenido: Contenido): void {
        this.items.push(contenido);
    }

    eliminar(contenido: Contenido): boolean {
        const index = this.items.indexOf(contenido);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    buscarPorTitulo(titulo: string): Contenido | null {
        return this.items.find(item => item.titulo === titulo) || null;
    }

    get todos(): Contenido[] {
        return [...this.items];
    }

    get totalItems(): number {
        return this.items.length;
    }
}

import { Contenido } from './Contenido';
