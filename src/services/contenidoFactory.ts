import { Pelicula } from '../domain/Pelicula';
import { Serie } from '../domain/Serie';
import { Documental } from '../domain/Documental';
import { Episodio } from '../domain/Episodio';
import { Contenido } from '../domain/Contenido';

/**
 * FACTORY METHOD - ContenidoFactory
 *
 * DEMUESTRA:
 * - FACTORY METHOD: Patrón creacional que encapsula la lógica de creación de objetos
 * - ENCAPSULAMIENTO: Oculta la complejidad de instanciación de cada tipo de contenido
 * - SINGLE RESPONSIBILITY: Responsabilidad única de crear instancias de Contenido
 * - OPEN/CLOSED: Abierto para extensión (nuevos tipos), cerrado para modificación
 *
 * RESPONSABILIDAD: Centralizar la creación de instancias de Contenido (Pelicula, Serie, Documental)
 *
 * VENTAJAS:
 * - Centraliza la lógica de creación en un solo lugar
 * - Facilita agregar nuevos tipos de contenido sin modificar código existente
 * - Permite validación y lógica de pre/post-creación consistente
 * - Reduce duplicación de código de instanciación
 */
export class ContenidoFactory {
    /**
     * Crea una instancia de Pelicula
     * @param datos - Objeto con los datos requeridos para crear una Pelicula
     * @returns Instancia de Pelicula
     */
    static crearPelicula(datos: DatosPelicula): Pelicula {
        return new Pelicula(
            datos.titulo,
            datos.anio,
            datos.sinopsis,
            datos.duracionMin,
            datos.director,
            datos.youtubeUrl || ''
        );
    }

    /**
     * Crea una instancia de Serie
     * @param datos - Objeto con los datos requeridos para crear una Serie
     * @returns Instancia de Serie
     */
    static crearSerie(datos: DatosSerie): Serie {
        const serie = new Serie(
            datos.titulo,
            datos.anio,
            datos.sinopsis,
            datos.creador,
            datos.youtubeUrl || ''
        );

        if (datos.temporadas && datos.temporadas.length > 0) {
            datos.temporadas.forEach(tData => {
                const temporada = serie.agregarTemporada(tData.numero);
                if (tData.episodios && tData.episodios.length > 0) {
                    tData.episodios.forEach(eData => {
                        temporada.agregarEpisodio(
                            new Episodio(
                                eData.numero,
                                eData.titulo,
                                eData.duracionMin,
                                eData.youtubeUrl || ''
                            )
                        );
                    });
                }
            });
        }

        return serie;
    }

    /**
     * Crea una instancia de Documental
     * @param datos - Objeto con los datos requeridos para crear un Documental
     * @returns Instancia de Documental
     */
    static crearDocumental(datos: DatosDocumental): Documental {
        return new Documental(
            datos.titulo,
            datos.anio,
            datos.sinopsis,
            datos.duracionMin,
            datos.tema,
            datos.investigador,
            datos.youtubeUrl || ''
        );
    }

    /**
     * Método factory genérico que crea cualquier tipo de Contenido
     * basándose en el tipo especificado
     * @param tipo - Tipo de contenido a crear ('Pelicula', 'Serie', 'Documental')
     * @param datos - Datos específicos del tipo de contenido
     * @returns Instancia de Contenido del tipo especificado
     * @throws Error si el tipo no es válido
     */
    static crearContenido(tipo: string, datos: any): Contenido {
        switch (tipo) {
            case 'Pelicula':
                return this.crearPelicula(datos as DatosPelicula);
            case 'Serie':
                return this.crearSerie(datos as DatosSerie);
            case 'Documental':
                return this.crearDocumental(datos as DatosDocumental);
            default:
                throw new Error(`Tipo de contenido no válido: ${tipo}`);
        }
    }
}

/**
 * Interfaces para los datos de creación de cada tipo de contenido
 * Esto proporciona type safety y documentación clara de qué datos se requieren
 */
export interface DatosPelicula {
    titulo: string;
    anio: number;
    sinopsis: string;
    duracionMin: number;
    director: string;
    youtubeUrl?: string;
}

export interface DatosSerie {
    titulo: string;
    anio: number;
    sinopsis: string;
    creador: string;
    youtubeUrl?: string;
    temporadas?: DatosTemporada[];
}

export interface DatosTemporada {
    numero: number;
    episodios?: DatosEpisodio[];
}

export interface DatosEpisodio {
    numero: number;
    titulo: string;
    duracionMin: number;
    youtubeUrl?: string;
}

export interface DatosDocumental {
    titulo: string;
    anio: number;
    sinopsis: string;
    duracionMin: number;
    tema: string;
    investigador: string;
    youtubeUrl?: string;
}
