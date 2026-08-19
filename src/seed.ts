import { Pelicula } from './domain/Pelicula';
import { Serie } from './domain/Serie';
import { Documental } from './domain/Documental';
import { Episodio } from './domain/Episodio';
import { Usuario } from './domain/Usuario';
import { ListaDeReproduccion } from './domain/ListaDeReproduccion';
import { Catalogo } from './domain/Catalogo';

/**
 * SEED DATA
 *
 * DEMUESTRA:
 * - DATOS DE EJEMPLO: Crea instancias de todas las clases
 *   con datos realistas para probar la aplicación
 *
 * RESPONSABILIDAD: Proporcionar datos iniciales para la aplicación
 */

/**
 * Crea y retorna todos los datos de ejemplo
 */
export function crearDatos() {
    // Crear usuario
    const usuario = new Usuario('Tú', 'tu@ejemplo.com');

    // Crear catálogo
    const catalogo = new Catalogo();

    // Crear 2 películas con director y duración distintos
    const pelicula1 = new Pelicula(
        'El Silencio de la Noche',
        2023,
        'Un thriller psicológico sobre un detective que persigue a un asesino en serie en una ciudad que nunca duerme.',
        142,
        'María González'
    );

    const pelicula2 = new Pelicula(
        'Horizontes Lejanos',
        2021,
        'Una aventura épica de ciencia ficción sobre la colonización de Marte y los desafíos humanos en el espacio.',
        178,
        'Carlos Rodríguez'
    );

    // Crear 1 serie con 2 temporadas, 2-3 episodios cada una
    const serie = new Serie(
        'Sombras del Pasado',
        2022,
        'Un drama histórico que sigue a una familia a través de tres generaciones, revelando secretos ocultos y traiciones.',
        'Ana Martínez'
    );

    // Temporada 1 con 3 episodios
    const temporada1 = serie.agregarTemporada(1);
    temporada1.agregarEpisodio(new Episodio(1, 'El Comienzo', 45));
    temporada1.agregarEpisodio(new Episodio(2, 'Secretos Revelados', 48));
    temporada1.agregarEpisodio(new Episodio(3, 'La Primera Traición', 52));

    // Temporada 2 con 2 episodios
    const temporada2 = serie.agregarTemporada(2);
    temporada2.agregarEpisodio(new Episodio(1, 'Consecuencias', 50));
    temporada2.agregarEpisodio(new Episodio(2, 'Redención', 55));

    // Crear 1 documental
    const documental = new Documental(
        'Océanos Profundos',
        2024,
        'Un viaje visual a las profundidades de los océanos, explorando ecosistemas desconocidos y especies nunca antes vistas.',
        95,
        'Vida Marina',
        'Dr. Roberto Sánchez'
    );

    // Agregar todo al catálogo
    catalogo.agregar(pelicula1);
    catalogo.agregar(pelicula2);
    catalogo.agregar(serie);
    catalogo.agregar(documental);

    // Crear lista de reproducción vacía
    const miLista = new ListaDeReproduccion('Mi Lista', usuario);

    // Agregar algunas calificaciones de ejemplo
    pelicula1.calificar(4);
    pelicula1.calificar(5);
    pelicula2.calificar(3);
    pelicula2.calificar(4);
    pelicula2.calificar(5);
    serie.calificar(5);
    serie.calificar(5);
    documental.calificar(4);

    return {
        usuario,
        catalogo,
        miLista,
        pelicula1,
        pelicula2,
        serie,
        documental
    };
}
