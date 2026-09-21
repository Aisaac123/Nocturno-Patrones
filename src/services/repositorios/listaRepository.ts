import { ListaDeReproduccion } from '../../domain/ListaDeReproduccion';
import { Usuario } from '../../domain/Usuario';
import { Catalogo } from '../../domain/Catalogo';
import { Persistencia } from '../persistencia';
import { ListaMapper } from '../mappers/listaMapper';
import { log } from '../../utils/logger';

/**
 * REPOSITORIO ListaRepository
 *
 * DEMUESTRA:
 * - SINGLE RESPONSIBILITY: Solo maneja persistencia de ListaDeReproduccion
 * - DEPENDENCY INVERSION: Depende de abstracciones (ListaDeReproduccion, Usuario, Catalogo)
 * - ENCAPSULAMIENTO: Oculta detalles de persistencia
 * - ELIMINA TEMPORAL COUPLING: Catálogo se pasa como parámetro en lugar de recargar
 *
 * RESPONSABILIDAD: Gestionar persistencia de listas de reproducción
 */
export class ListaRepository {
    private persistencia: Persistencia<any>;

    constructor() {
        this.persistencia = new Persistencia('nocturno_lista');
    }

    /**
     * Guarda la lista de reproducción en persistencia
     * @param lista - Lista a persistir
     */
    guardar(lista: ListaDeReproduccion): void {
        const dto = ListaMapper.toDto(lista);
        this.persistencia.guardar(dto);
        log('PERSISTENCIA', 'Lista de reproducción guardada en localStorage');
    }

    /**
     * Carga la lista de reproducción desde persistencia
     * @param usuario - Usuario propietario de la lista
     * @param catalogo - Catálogo para buscar referencias de contenido
     * @returns Lista cargada o null si no existe
     */
    cargar(usuario: Usuario, catalogo: Catalogo): ListaDeReproduccion | null {
        const dto = this.persistencia.cargar();
        if (!dto) return null;

        const lista = ListaMapper.fromDto(dto, usuario, catalogo);
        log('PERSISTENCIA', 'Lista de reproducción cargada desde localStorage');
        return lista;
    }

    /**
     * Elimina la lista de reproducción de persistencia
     */
    eliminar(): void {
        this.persistencia.eliminar();
        log('PERSISTENCIA', 'Lista de reproducción eliminada de localStorage');
    }

    /**
     * Verifica si existe una lista en persistencia
     * @returns true si existe, false en caso contrario
     */
    existe(): boolean {
        return this.persistencia.existe();
    }
}
