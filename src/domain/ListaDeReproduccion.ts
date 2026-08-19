import { Usuario } from './Usuario';

/**
 * CLASE ListaDeReproduccion
 *
 * DEMUESTRA:
 * - AGREGACIÓN: Contiene referencias a Contenido pero NO controla su ciclo de vida
 *   Los contenidos pueden existir independientemente de la lista
 *   agregar()/quitar() solo referencian, no crean ni destruyen contenidos
 * - ENCAPSULAMIENTO: items es privado, acceso controlado
 *
 * RESPONSABILIDAD: Representar una lista personalizada de contenidos
 * favoritos de un usuario
 */
export class ListaDeReproduccion {
    readonly nombre: string;
    readonly propietario: Usuario;

    // Campo privado - encapsulamiento
    // AGREGACIÓN: Referencias a Contenido sin propiedad del ciclo de vida
    private items: any[] = [];

    constructor(nombre: string, propietario: Usuario) {
        this.nombre = nombre;
        this.propietario = propietario;
    }

    /**
     * Método para agregar contenido a la lista
     * AGREGACIÓN: Solo referencia el contenido, no lo crea
     * El contenido ya existe independientemente
     */
    agregar(contenido: any): void {
        if (!this.items.includes(contenido)) {
            this.items.push(contenido);
        }
    }

    /**
     * Método para quitar contenido de la lista
     * AGREGACIÓN: Solo remueve la referencia, no destruye el contenido
     * El contenido sigue existiendo en el catálogo
     */
    quitar(contenido: any): void {
        const index = this.items.indexOf(contenido);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }

    /**
     * Método para verificar si un contenido está en la lista
     */
    contiene(contenido: any): boolean {
        return this.items.includes(contenido);
    }

    /**
     * Getter para items
     * ENCAPSULAMIENTO: Retorna copia para evitar manipulación externa
     */
    getItems(): any[] {
        return [...this.items];
    }

    /**
     * Getter para total de items
     * ENCAPSULAMIENTO: Expone solo el count
     */
    get totalItems(): number {
        return this.items.length;
    }
}
