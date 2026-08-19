/**
 * SERVICIO Persistencia
 *
 * DEMUESTRA:
 * - ENCAPSULAMIENTO: Oculta detalles de localStorage
 * - SINGLE RESPONSIBILITY: Solo maneja persistencia
 *
 * RESPONSABILIDAD: Gestionar persistencia en localStorage
 */
export class Persistencia<T> {
    private readonly clave: string;

    constructor(clave: string) {
        this.clave = clave;
    }

    guardar(datos: T): void {
        try {
            const serializado = JSON.stringify(datos);
            localStorage.setItem(this.clave, serializado);
        } catch (error) {
            console.error(`Error al guardar ${this.clave}:`, error);
        }
    }

    cargar(): T | null {
        try {
            const serializado = localStorage.getItem(this.clave);
            if (serializado === null) return null;
            return JSON.parse(serializado);
        } catch (error) {
            console.error(`Error al cargar ${this.clave}:`, error);
            return null;
        }
    }

    eliminar(): void {
        localStorage.removeItem(this.clave);
    }

    existe(): boolean {
        return localStorage.getItem(this.clave) !== null;
    }
}
