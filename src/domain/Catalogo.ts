/**
 * CLASE Catalogo
 *
 * DEMUESTRA:
 * - ENCAPSULAMIENTO: items es privado, acceso controlado
 *
 * RESPONSABILIDAD: Administrar la colección de contenidos disponibles
 * en la plataforma
 */
export class Catalogo {
    // Campo privado - encapsulamiento
    private items: any[] = [];

    /**
     * Método para agregar contenido al catálogo
     * ENCAPSULAMIENTO: Controla qué se agrega al catálogo
     */
    agregar(contenido: any): void {
        this.items.push(contenido);
    }

    /**
     * Método para eliminar contenido del catálogo
     * ENCAPSULAMIENTO: Controla qué se elimina del catálogo
     */
    eliminar(contenido: any): boolean {
        const index = this.items.indexOf(contenido);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Método para buscar contenido por título
     * ENCAPSULAMIENTO: Búsqueda controlada
     */
    buscarPorTitulo(titulo: string): any | null {
        return this.items.find(item => item.titulo === titulo) || null;
    }

    /**
     * Getter para todos los items
     * ENCAPSULAMIENTO: Retorna copia para evitar manipulación externa
     */
    get todos(): any[] {
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
