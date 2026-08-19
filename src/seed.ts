import { Pelicula } from './domain/Pelicula';
import { Serie } from './domain/Serie';
import { Documental } from './domain/Documental';
import { Episodio } from './domain/Episodio';
import { Usuario } from './domain/Usuario';
import { ListaDeReproduccion } from './domain/ListaDeReproduccion';
import { Catalogo } from './domain/Catalogo';
import { Repositorio } from './services/repositorio';

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
        'The Matrix',
        1999,
        'Un hacker descubre que el mundo que conoce es una simulación creada por máquinas inteligentes.',
        136,
        'Lana Wachowski, Lilly Wachowski',
        'https://www.youtube.com/watch?v=vKQi3bBA1y8' // Trailer oficial
    );

    const pelicula2 = new Pelicula(
        'Inception',
        2010,
        'Un ladrón que roba secretos corporativos a través del uso de tecnología de compartir sueños.',
        148,
        'Christopher Nolan',
        'https://www.youtube.com/watch?v=YoHD9XEInc0' // Trailer oficial
    );

    const serie = new Serie(
        'Breaking Bad',
        2008,
        'Un profesor de química de secundaria con cáncer terminal se convierte en fabricante de metanfetamina.',
        'Vince Gilligan',
        'https://www.youtube.com/watch?v=HhesaQXLuRY' // Tráiler oficial
    );

    const temporada1 = serie.agregarTemporada(1);
    temporada1.agregarEpisodio(new Episodio(1, 'Pilot', 49));
    temporada1.agregarEpisodio(new Episodio(2, 'Cat\'s in the Bag...', 48));
    temporada1.agregarEpisodio(new Episodio(3, '...And the Bag\'s in the River', 46));

    const temporada2 = serie.agregarTemporada(2);
    temporada2.agregarEpisodio(new Episodio(1, 'Seven Thirty-Seven', 48));
    temporada2.agregarEpisodio(new Episodio(2, 'Grilled', 43));

    const documental = new Documental(
        'Planet Earth',
        2006,
        'Serie documental que explora la diversidad de vida en nuestro planeta.',
        600,
        'Naturaleza y Vida Silvestre',
        'BBC Natural History Unit',
        'https://www.youtube.com/watch?v=JkaxUblCGz0' // Tráiler oficial
    );

    catalogo.agregar(pelicula1);
    catalogo.agregar(pelicula2);
    catalogo.agregar(serie);
    catalogo.agregar(documental);

    const miLista = new ListaDeReproduccion('Mi Lista', usuario);

    pelicula1.calificar(5);
    pelicula1.calificar(5);
    pelicula2.calificar(5);
    pelicula2.calificar(4);
    pelicula2.calificar(5);
    serie.calificar(5);
    serie.calificar(5);
    documental.calificar(5);

    repositorio.guardarCatalogo(catalogo);
    repositorio.guardarUsuario(usuario);
    repositorio.guardarLista(miLista);

    return {
        usuario,
        catalogo,
        miLista
    };
}
