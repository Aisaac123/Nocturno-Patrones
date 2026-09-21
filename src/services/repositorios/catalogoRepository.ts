import { Catalogo } from '../../domain/Catalogo';
import { Contenido } from '../../domain/Contenido';
import { Persistencia } from '../persistencia';
import { ContenidoMapper } from '../mappers/contenidoMapper';
import { log } from '../../utils/logger';

/**
 * REPOSITORIO CatalogoRepository
 *
 * DEMUESTRA:
 * - SINGLE RESPONSIBILITY: Solo maneja persistencia de Catalogo
 * - DEPENDENCY INVERSION: Depende de abstracciones (Catalogo, Contenido)
 * - ENCAPSULAMIENTO: Oculta detalles de persistencia
 *
 * RESPONSABILIDAD: Gestionar persistencia del catálogo de contenidos
 */
export class CatalogoRepository {
    private persistencia: Persistencia<any[]>;

    constructor() {
        this.persistencia = new Persistencia('nocturno_catalogo');
    }

    /**
     * Guarda el catálogo en persistencia
     * @param catalogo - Catálogo a persistir
     */
    guardar(catalogo: Catalogo): void {
        const dtos = catalogo.todos.map(c => ContenidoMapper.toDto(c));
        this.persistencia.guardar(dtos);
        log('PERSISTENCIA', 'Catálogo guardado en localStorage');
    }

    /**
     * Carga el catálogo desde persistencia
     * @returns Catálogo cargado o null si no existe
     */
    cargar(): Catalogo | null {
        const dtos = this.persistencia.cargar();
        if (!dtos) return null;

        const catalogo = new Catalogo();
        dtos.forEach(dto => {
            const contenido = ContenidoMapper.fromDto(dto);
            if (contenido) catalogo.agregar(contenido);
        });

        log('PERSISTENCIA', 'Catálogo cargado desde localStorage');
        return catalogo;
    }

    /**
     * Elimina el catálogo de persistencia
     */
    eliminar(): void {
        this.persistencia.eliminar();
        log('PERSISTENCIA', 'Catálogo eliminado de localStorage');
    }

    /**
     * Verifica si existe un catálogo en persistencia
     * @returns true si existe, false en caso contrario
     */
    existe(): boolean {
        return this.persistencia.existe();
    }
}
