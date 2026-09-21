import { Contenido } from '../../domain/Contenido';
import { Pelicula } from '../../domain/Pelicula';
import { Serie } from '../../domain/Serie';
import { Documental } from '../../domain/Documental';
import { ContenidoFactory } from '../contenidoFactory';
import { log } from '../../utils/logger';

/**
 * MAPPER ContenidoMapper
 *
 * DEMUESTRA:
 * - SINGLE RESPONSIBILITY: Solo maneja conversión entre Contenido y DTO
 * - ENCAPSULAMIENTO: Oculta lógica de serialización/deserialización
 *
 * RESPONSABILIDAD: Convertir entre instancias de Contenido y DTOs para persistencia
 */
export class ContenidoMapper {
    /**
     * Convierte una instancia de Contenido a DTO para persistencia
     * @param contenido - Instancia de Contenido a serializar
     * @returns DTO representando el contenido
     */
    static toDto(contenido: Contenido): any {
        if (contenido instanceof Pelicula) {
            return {
                tipo: 'Pelicula',
                titulo: contenido.titulo,
                anio: contenido.anio,
                sinopsis: contenido.sinopsisPublica,
                duracionMin: (contenido as Pelicula)['duracionMin'],
                director: contenido.director,
                youtubeUrl: contenido.urlYoutube,
                calificaciones: contenido.calificacionesArray
            };
        }
        if (contenido instanceof Serie) {
            const temporadasDto = contenido.obtenerTemporadas().map((t: any) => ({
                numero: t.numero,
                episodios: t.getEpisodios().map((e: any) => ({
                    numero: e.numero,
                    titulo: e.titulo,
                    duracionMin: e.duracionMin,
                    youtubeUrl: (e as any).youtubeUrl || ''
                }))
            }));
            return {
                tipo: 'Serie',
                titulo: contenido.titulo,
                anio: contenido.anio,
                sinopsis: contenido.sinopsisPublica,
                creador: contenido.creador,
                youtubeUrl: contenido.urlYoutube,
                temporadas: temporadasDto,
                calificaciones: contenido.calificacionesArray
            };
        }
        if (contenido instanceof Documental) {
            return {
                tipo: 'Documental',
                titulo: contenido.titulo,
                anio: contenido.anio,
                sinopsis: contenido.sinopsisPublica,
                duracionMin: (contenido as Documental)['duracionMin'],
                tema: contenido.tema,
                investigador: contenido.investigador,
                youtubeUrl: contenido.urlYoutube,
                calificaciones: contenido.calificacionesArray
            };
        }
        return null;
    }

    /**
     * Convierte un DTO a una instancia de Contenido
     * @param dto - DTO deserializado desde persistencia
     * @returns Instancia de Contenido o null si hay error
     */
    static fromDto(dto: any): Contenido | null {
        try {
            const contenido = ContenidoFactory.crearContenido(dto.tipo, dto);
            log('FACTORY METHOD', `Contenido "${dto.titulo}" (${dto.tipo}) recreado desde persistencia usando ContenidoFactory`);
            contenido.restaurarCalificaciones(dto.calificaciones);
            return contenido;
        } catch (error) {
            console.error(`Error al deserializar contenido: ${(error as Error).message}`);
            return null;
        }
    }
}
