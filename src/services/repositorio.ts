import { Pelicula } from '../domain/Pelicula';
import { Serie } from '../domain/Serie';
import { Documental } from '../domain/Documental';
import { Usuario } from '../domain/Usuario';
import { ListaDeReproduccion } from '../domain/ListaDeReproduccion';
import { Catalogo } from '../domain/Catalogo';
import { Episodio } from '../domain/Episodio';
import { Temporada } from '../domain/Temporada';
import { Persistencia } from './persistencia';

/**
 * SERVICIO Repositorio
 *
 * DEMUESTRA:
 * - ENCAPSULAMIENTO: Oculta lógica de serialización/deserialización
 * - SINGLE RESPONSIBILITY: Solo maneja conversión entre objetos y DTOs
 *
 * RESPONSABILIDAD: Convertir entre instancias de clases y JSON para localStorage
 */
export class Repositorio {
    private persistenciaCatalogo: Persistencia<any[]>;
    private persistenciaUsuario: Persistencia<any>;
    private persistenciaLista: Persistencia<any>;

    constructor() {
        this.persistenciaCatalogo = new Persistencia('nocturno_catalogo');
        this.persistenciaUsuario = new Persistencia('nocturno_usuario');
        this.persistenciaLista = new Persistencia('nocturno_lista');
    }

    guardarCatalogo(catalogo: Catalogo): void {
        const dtos = catalogo.todos.map(c => this.contenidoToDto(c));
        this.persistenciaCatalogo.guardar(dtos);
    }

    cargarCatalogo(): Catalogo | null {
        const dtos = this.persistenciaCatalogo.cargar();
        if (!dtos) return null;

        const catalogo = new Catalogo();
        dtos.forEach(dto => {
            const contenido = this.dtoToContenido(dto);
            if (contenido) catalogo.agregar(contenido);
        });
        return catalogo;
    }

    guardarUsuario(usuario: Usuario): void {
        const dto = this.usuarioToDto(usuario);
        this.persistenciaUsuario.guardar(dto);
    }

    cargarUsuario(): Usuario | null {
        const dto = this.persistenciaUsuario.cargar();
        if (!dto) return null;
        return this.dtoToUsuario(dto);
    }

    guardarLista(lista: ListaDeReproduccion): void {
        const dto = this.listaToDto(lista);
        this.persistenciaLista.guardar(dto);
    }

    cargarLista(usuario: Usuario): ListaDeReproduccion | null {
        const dto = this.persistenciaLista.cargar();
        if (!dto) return null;
        return this.dtoToLista(dto, usuario);
    }

    private contenidoToDto(contenido: any): any {
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
            const temporadasDto = contenido.obtenerTemporadas().map(t => ({
                numero: t.numero,
                episodios: t.getEpisodios().map(e => ({
                    numero: e.numero,
                    titulo: e.titulo,
                    duracionMin: e.duracionMin
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

    private dtoToContenido(dto: any): any {
        switch (dto.tipo) {
            case 'Pelicula':
                const pelicula = new Pelicula(
                    dto.titulo,
                    dto.anio,
                    dto.sinopsis,
                    dto.duracionMin,
                    dto.director,
                    dto.youtubeUrl
                );
                this.restaurarCalificaciones(pelicula, dto.calificaciones);
                return pelicula;
            case 'Serie':
                const serie = new Serie(
                    dto.titulo,
                    dto.anio,
                    dto.sinopsis,
                    dto.creador,
                    dto.youtubeUrl
                );
                dto.temporadas.forEach((tDto: any) => {
                    const temporada = serie.agregarTemporada(tDto.numero);
                    tDto.episodios.forEach((eDto: any) => {
                        temporada.agregarEpisodio(new Episodio(eDto.numero, eDto.titulo, eDto.duracionMin));
                    });
                });
                this.restaurarCalificaciones(serie, dto.calificaciones);
                return serie;
            case 'Documental':
                const documental = new Documental(
                    dto.titulo,
                    dto.anio,
                    dto.sinopsis,
                    dto.duracionMin,
                    dto.tema,
                    dto.investigador,
                    dto.youtubeUrl
                );
                this.restaurarCalificaciones(documental, dto.calificaciones);
                return documental;
            default:
                return null;
        }
    }

    private usuarioToDto(usuario: Usuario): any {
        return {
            nombre: usuario.nombre,
            email: usuario.getEmail()
        };
    }

    private dtoToUsuario(dto: any): Usuario {
        return new Usuario(dto.nombre, dto.email);
    }

    private listaToDto(lista: ListaDeReproduccion): any {
        return {
            nombre: lista.nombre,
            items: lista.getItems().map(c => this.contenidoToDto(c))
        };
    }

    private dtoToLista(dto: any, usuario: Usuario): ListaDeReproduccion {
        const lista = new ListaDeReproduccion(dto.nombre, usuario);
        if (dto.items) {
            const catalogo = this.cargarCatalogo();
            if (catalogo) {
                dto.items.forEach((itemDto: any) => {
                    const contenido = catalogo.buscarPorTitulo(itemDto.titulo);
                    if (contenido) lista.agregar(contenido);
                });
            }
        }
        return lista;
    }

    private restaurarCalificaciones(contenido: any, calificaciones: number[]): void {
        contenido.restaurarCalificaciones(calificaciones);
    }

    limpiarTodo(): void {
        this.persistenciaCatalogo.eliminar();
        this.persistenciaUsuario.eliminar();
        this.persistenciaLista.eliminar();
    }
}
