import { Pelicula } from './domain/Pelicula';
import { Serie } from './domain/Serie';
import { Documental } from './domain/Documental';
import { Episodio } from './domain/Episodio';
import { Usuario } from './domain/Usuario';
import { ListaDeReproduccion } from './domain/ListaDeReproduccion';
import { Catalogo } from './domain/Catalogo';
import { Repositorio } from './services/repositorio';

/**
 * SEED DATA
 *
 * DEMUESTRA:
 * - DATOS DE EJEMPLO: Crea instancias de todas las clases
 *
 * RESPONSABILIDAD: Proporcionar datos iniciales para la aplicación
 */
export function crearDatos(repositorio: Repositorio) {
    const catalogoGuardado = repositorio.cargarCatalogo();
    const usuarioGuardado = repositorio.cargarUsuario();
    const listaGuardada = repositorio.cargarLista(usuarioGuardado || new Usuario('Tú', 'tu@ejemplo.com'));

    if (catalogoGuardado && usuarioGuardado && listaGuardada) {
        return {
            usuario: usuarioGuardado,
            catalogo: catalogoGuardado,
            miLista: listaGuardada
        };
    }

    const usuario = new Usuario('Tú', 'tu@ejemplo.com');
    const catalogo = new Catalogo();

    const pelicula1 = new Pelicula(
        'El Silencio de la Noche',
        2023,
        'Un thriller psicológico sobre un detective que persigue a un asesino en serie en una ciudad que nunca duerme.',
        142,
        'María González',
        'https://www.youtube.com/watch?v=jNQXAC9IVRw'
    );

    const pelicula2 = new Pelicula(
        'Horizontes Lejanos',
        2021,
        'Una aventura épica de ciencia ficción sobre la colonización de Marte y los desafíos humanos en el espacio.',
        178,
        'Carlos Rodríguez',
        'https://www.youtube.com/watch?v=9bZkp7q19f0'
    );

    const serie = new Serie(
        'Sombras del Pasado',
        2022,
        'Un drama histórico que sigue a una familia a través de tres generaciones, revelando secretos ocultos y traiciones.',
        'Ana Martínez',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    );

    const temporada1 = serie.agregarTemporada(1);
    temporada1.agregarEpisodio(new Episodio(1, 'El Comienzo', 45));
    temporada1.agregarEpisodio(new Episodio(2, 'Secretos Revelados', 48));
    temporada1.agregarEpisodio(new Episodio(3, 'La Primera Traición', 52));

    const temporada2 = serie.agregarTemporada(2);
    temporada2.agregarEpisodio(new Episodio(1, 'Consecuencias', 50));
    temporada2.agregarEpisodio(new Episodio(2, 'Redención', 55));

    const documental = new Documental(
        'Océanos Profundos',
        2024,
        'Un viaje visual a las profundidades de los océanos, explorando ecosistemas desconocidos y especies nunca antes vistas.',
        95,
        'Vida Marina',
        'Dr. Roberto Sánchez',
        'https://www.youtube.com/watch?v=h0B9zQ8j5-Y'
    );

    catalogo.agregar(pelicula1);
    catalogo.agregar(pelicula2);
    catalogo.agregar(serie);
    catalogo.agregar(documental);

    const miLista = new ListaDeReproduccion('Mi Lista', usuario);

    pelicula1.calificar(4);
    pelicula1.calificar(5);
    pelicula2.calificar(3);
    pelicula2.calificar(4);
    pelicula2.calificar(5);
    serie.calificar(5);
    serie.calificar(5);
    documental.calificar(4);

    repositorio.guardarCatalogo(catalogo);
    repositorio.guardarUsuario(usuario);
    repositorio.guardarLista(miLista);

    return {
        usuario,
        catalogo,
        miLista
    };
}
