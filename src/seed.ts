import { Usuario } from './domain/Usuario';
import { ListaDeReproduccion } from './domain/ListaDeReproduccion';
import { Catalogo } from './domain/Catalogo';
import { Repositorio } from './services/repositorio';
import { ContenidoFactory, DatosPelicula, DatosSerie, DatosDocumental } from './services/contenidoFactory';

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

    const datosPelicula1: DatosPelicula = {
        titulo: 'The Matrix',
        anio: 1999,
        sinopsis: 'Un hacker descubre que el mundo que conoce es una simulación creada por máquinas inteligentes.',
        duracionMin: 136,
        director: 'Lana Wachowski, Lilly Wachowski',
        youtubeUrl: 'https://www.youtube.com/watch?v=vKQi3bBA1y8'
    };
    const pelicula1 = ContenidoFactory.crearPelicula(datosPelicula1);

    const datosPelicula2: DatosPelicula = {
        titulo: 'Inception',
        anio: 2010,
        sinopsis: 'Un ladrón que roba secretos corporativos a través del uso de tecnología de compartir sueños.',
        duracionMin: 148,
        director: 'Christopher Nolan',
        youtubeUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
    };
    const pelicula2 = ContenidoFactory.crearPelicula(datosPelicula2);

    const datosSerie: DatosSerie = {
        titulo: 'Breaking Bad',
        anio: 2008,
        sinopsis: 'Un profesor de química de secundaria con cáncer terminal se convierte en fabricante de metanfetamina.',
        creador: 'Vince Gilligan',
        youtubeUrl: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
        temporadas: [
            {
                numero: 1,
                episodios: [
                    { numero: 1, titulo: 'Pilot', duracionMin: 49, youtubeUrl: 'https://www.youtube.com/watch?v=HhesaQXLuRY' },
                    { numero: 2, titulo: 'Cat\'s in the Bag...', duracionMin: 48, youtubeUrl: 'https://www.youtube.com/watch?v=t4H8DSFm2i0' },
                    { numero: 3, titulo: '...And the Bag\'s in the River', duracionMin: 46, youtubeUrl: 'https://www.youtube.com/watch?v=DCidKqcY2n4' }
                ]
            },
            {
                numero: 2,
                episodios: [
                    { numero: 1, titulo: 'Seven Thirty-Seven', duracionMin: 48, youtubeUrl: 'https://www.youtube.com/watch?v=RTpR5XU8s6s' },
                    { numero: 2, titulo: 'Grilled', duracionMin: 43, youtubeUrl: 'https://www.youtube.com/watch?v=tE9-UwchYo4' }
                ]
            }
        ]
    };
    const serie = ContenidoFactory.crearSerie(datosSerie);

    const datosDocumental: DatosDocumental = {
        titulo: 'Planet Earth',
        anio: 2006,
        sinopsis: 'Serie documental que explora la diversidad de vida en nuestro planeta.',
        duracionMin: 600,
        tema: 'Naturaleza y Vida Silvestre',
        investigador: 'BBC Natural History Unit',
        youtubeUrl: 'https://www.youtube.com/watch?v=JkaxUblCGz0'
    };
    const documental = ContenidoFactory.crearDocumental(datosDocumental);

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
