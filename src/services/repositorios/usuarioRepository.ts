import { Usuario } from '../../domain/Usuario';
import { Persistencia } from '../persistencia';
import { UsuarioMapper } from '../mappers/usuarioMapper';
import { log } from '../../utils/logger';

/**
 * REPOSITORIO UsuarioRepository
 *
 * DEMUESTRA:
 * - SINGLE RESPONSIBILITY: Solo maneja persistencia de Usuario
 * - DEPENDENCY INVERSION: Depende de abstracciones (Usuario)
 * - ENCAPSULAMIENTO: Oculta detalles de persistencia
 *
 * RESPONSABILIDAD: Gestionar persistencia de usuarios
 */
export class UsuarioRepository {
    private persistencia: Persistencia<any>;

    constructor() {
        this.persistencia = new Persistencia('nocturno_usuario');
    }

    /**
     * Guarda el usuario en persistencia
     * @param usuario - Usuario a persistir
     */
    guardar(usuario: Usuario): void {
        const dto = UsuarioMapper.toDto(usuario);
        this.persistencia.guardar(dto);
        log('PERSISTENCIA', 'Usuario guardado en localStorage');
    }

    /**
     * Carga el usuario desde persistencia
     * @returns Usuario cargado o null si no existe
     */
    cargar(): Usuario | null {
        const dto = this.persistencia.cargar();
        if (!dto) return null;

        const usuario = UsuarioMapper.fromDto(dto);
        log('PERSISTENCIA', 'Usuario cargado desde localStorage');
        return usuario;
    }

    /**
     * Elimina el usuario de persistencia
     */
    eliminar(): void {
        this.persistencia.eliminar();
        log('PERSISTENCIA', 'Usuario eliminado de localStorage');
    }

    /**
     * Verifica si existe un usuario en persistencia
     * @returns true si existe, false en caso contrario
     */
    existe(): boolean {
        return this.persistencia.existe();
    }
}
