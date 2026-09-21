import { ListaDeReproduccion } from '../../domain/ListaDeReproduccion';
import { Usuario } from '../../domain/Usuario';
import { Catalogo } from '../../domain/Catalogo';
import { ContenidoMapper } from './contenidoMapper';

/**
 * MAPPER ListaMapper
 *
 * DEMUESTRA:
 * - SINGLE RESPONSIBILITY: Solo maneja conversión entre ListaDeReproduccion y DTO
 * - ENCAPSULAMIENTO: Oculta lógica de serialización/deserialización
 * - ELIMINA TEMPORAL COUPLING: Catálogo se pasa como parámetro en lugar de recargar
 *
 * RESPONSABILIDAD: Convertir entre instancias de ListaDeReproduccion y DTOs para persistencia
 */
export class ListaMapper {
    /**
     * Convierte una instancia de ListaDeReproduccion a DTO para persistencia
     * @param lista - Instancia de ListaDeReproduccion a serializar
     * @returns DTO representando la lista
     */
    static toDto(lista: ListaDeReproduccion): any {
        return {
            nombre: lista.nombre,
            items: lista.getItems().map(c => ContenidoMapper.toDto(c))
        };
    }

    /**
     * Convierte un DTO a una instancia de ListaDeReproduccion
     * @param dto - DTO deserializado desde persistencia
     * @param usuario - Usuario propietario de la lista
     * @param catalogo - Catálogo para buscar referencias de contenido
     * @returns Instancia de ListaDeReproduccion
     */
    static fromDto(dto: any, usuario: Usuario, catalogo: Catalogo): ListaDeReproduccion {
        const lista = new ListaDeReproduccion(dto.nombre, usuario);
        if (dto.items) {
            dto.items.forEach((itemDto: any) => {
                const contenido = catalogo.buscarPorTitulo(itemDto.titulo);
                if (contenido) lista.agregar(contenido);
            });
        }
        return lista;
    }
}
