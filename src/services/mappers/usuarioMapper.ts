import { Usuario } from '../../domain/Usuario';

/**
 * MAPPER UsuarioMapper
 *
 * DEMUESTRA:
 * - SINGLE RESPONSIBILITY: Solo maneja conversión entre Usuario y DTO
 * - ENCAPSULAMIENTO: Oculta lógica de serialización/deserialización
 *
 * RESPONSABILIDAD: Convertir entre instancias de Usuario y DTOs para persistencia
 */
export class UsuarioMapper {
    /**
     * Convierte una instancia de Usuario a DTO para persistencia
     * @param usuario - Instancia de Usuario a serializar
     * @returns DTO representando el usuario
     */
    static toDto(usuario: Usuario): any {
        return {
            nombre: usuario.nombre,
            email: usuario.getEmail()
        };
    }

    /**
     * Convierte un DTO a una instancia de Usuario
     * @param dto - DTO deserializado desde persistencia
     * @returns Instancia de Usuario
     */
    static fromDto(dto: any): Usuario {
        return new Usuario(dto.nombre, dto.email);
    }
}
