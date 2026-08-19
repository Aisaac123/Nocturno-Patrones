import { log } from '../utils/logger';
import { renderMiLista, actualizarBotonesMiLista, renderCatalogo, renderDetalleContenido } from './renderers';
import { Pelicula } from '../domain/Pelicula';
import { Serie } from '../domain/Serie';
import { Documental } from '../domain/Documental';
import { Episodio } from '../domain/Episodio';
import { Contenido } from '../domain/Contenido';
import { Usuario } from '../domain/Usuario';
import { Catalogo } from '../domain/Catalogo';
import { ListaDeReproduccion } from '../domain/ListaDeReproduccion';
import { Repositorio } from '../services/repositorio';

interface DatosAplicacion {
    usuario: Usuario;
    catalogo: Catalogo;
    miLista: ListaDeReproduccion;
}

interface Handlers {
    onReproducir: (contenido: Contenido) => void;
    onToggleLista: (contenido: Contenido) => void;
    onQuitar: (contenido: Contenido) => void;
    onCalificar: (contenido: Contenido, estrellas: number) => void;
    onVerDetalle: (contenido: Contenido) => void;
    onEliminar: (contenido: Contenido) => void;
    onAgregarPelicula: (event: Event) => void;
    onAgregarSerie: (event: Event) => void;
    onAgregarDocumental: (event: Event) => void;
}

export function setupEventListeners(datos: DatosAplicacion, repositorio: Repositorio): Handlers {
    const { usuario, catalogo, miLista } = datos;

    const guardarTodo = () => {
        repositorio.guardarCatalogo(catalogo);
        repositorio.guardarUsuario(usuario);
        repositorio.guardarLista(miLista);
        log('PERSISTENCIA', 'Estado guardado en localStorage');
    };

    const onReproducir = (contenido: Contenido) => {
        log('ASOCIACIÓN', `Usuario "${usuario.nombre}" iniciando ASOCIACIÓN con "${contenido.titulo}"`);
        const resultado = usuario.ver(contenido);
        log('POLIMORFISMO', resultado);

        (window as any).contenidoActual = contenido;
        renderDetalleContenido(contenido);
        switchTab('detalle');
        renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
        guardarTodo();
    };

    const onToggleLista = (contenido: Contenido) => {
        if (miLista.contiene(contenido)) {
            miLista.quitar(contenido);
            log('AGREGACIÓN', `Quitando "${contenido.titulo}" de lista`);
        } else {
            miLista.agregar(contenido);
            log('AGREGACIÓN', `Agregando "${contenido.titulo}" a lista`);
        }

        renderMiLista(miLista, onQuitar, onVerDetalle);
        actualizarBotonesMiLista(miLista, catalogo.todos);
        guardarTodo();
    };

    const onQuitar = (contenido: Contenido) => {
        miLista.quitar(contenido);
        log('AGREGACIÓN', `Quitando "${contenido.titulo}" de lista`);

        renderMiLista(miLista, onQuitar, onVerDetalle);
        actualizarBotonesMiLista(miLista, catalogo.todos);
        guardarTodo();
    };

    const onCalificar = (contenido: Contenido, estrellas: number) => {
        try {
            contenido.calificar(estrellas);
            log('ENCAPSULAMIENTO', `Calificando "${contenido.titulo}" con ${estrellas} estrellas`);
            log('POLIMORFISMO', `Promedio actualizado: ${contenido.promedioCalificacion.toFixed(1)}`);

            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
            guardarTodo();
        } catch (error) {
            log('ENCAPSULAMIENTO', `Error al calificar: ${(error as Error).message}`);
        }
    };

    const onVerDetalle = (contenido: Contenido) => {
        (window as any).contenidoActual = contenido;
        renderDetalleContenido(contenido);
        switchTab('detalle');
    };

    const onEliminar = (contenido: Contenido) => {
        if (confirm(`¿Estás seguro de eliminar "${contenido.titulo}"?`)) {
            catalogo.eliminar(contenido);

            if (miLista.contiene(contenido)) {
                miLista.quitar(contenido);
            }

            log('ENCAPSULAMIENTO', `Eliminando "${contenido.titulo}" del catálogo`);

            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
            renderMiLista(miLista, onQuitar, onVerDetalle);
            guardarTodo();
        }
    };

    const onAgregarPelicula = (event: Event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const titulo = formData.get('titulo') as string;
        const anio = parseInt(formData.get('anio') as string);
        const sinopsis = formData.get('sinopsis') as string;
        const duracion = parseInt(formData.get('duracion') as string);
        const director = formData.get('director') as string;
        const youtubeUrl = formData.get('youtubeUrl') as string;

        try {
            const nuevaPelicula = new Pelicula(titulo, anio, sinopsis, duracion, director, youtubeUrl);
            catalogo.agregar(nuevaPelicula);

            log('HERENCIA', `Nueva instancia de Pelicula creada extendiendo Contenido`);
            log('POLIMORFISMO', `Película "${titulo}" agregada al catálogo`);

            form.reset();
            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
            switchTab('catalogo');
            guardarTodo();
        } catch (error) {
            log('ENCAPSULAMIENTO', `Error al crear película: ${(error as Error).message}`);
        }
    };

    const onAgregarSerie = (event: Event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const titulo = formData.get('titulo') as string;
        const anio = parseInt(formData.get('anio') as string);
        const sinopsis = formData.get('sinopsis') as string;
        const creador = formData.get('creador') as string;
        const youtubeUrl = formData.get('youtubeUrl') as string;

        const temporadasData = (window as any).temporadasTemporales || [];

        try {
            const nuevaSerie = new Serie(titulo, anio, sinopsis, creador, youtubeUrl);

            temporadasData.forEach((tData: any) => {
                const temporada = nuevaSerie.agregarTemporada(tData.numero);
                tData.episodios.forEach((eData: any) => {
                    temporada.agregarEpisodio(new Episodio(eData.numero, eData.titulo, eData.duracionMin));
                });
            });

            if (nuevaSerie.totalTemporadas === 0) {
                const temporada1 = nuevaSerie.agregarTemporada(1);
                temporada1.agregarEpisodio(new Episodio(1, 'Piloto', 45));
            }

            catalogo.agregar(nuevaSerie);

            log('HERENCIA', `Nueva instancia de Serie creada extendiendo Contenido`);
            log('COMPOSICIÓN', `Serie "${titulo}" creada con ${nuevaSerie.totalTemporadas} temporadas`);

            form.reset();
            (window as any).temporadasTemporales = [];
            actualizarPreviewTemporadas();
            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
            switchTab('catalogo');
            guardarTodo();
        } catch (error) {
            log('ENCAPSULAMIENTO', `Error al crear serie: ${(error as Error).message}`);
        }
    };

    const onAgregarDocumental = (event: Event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const titulo = formData.get('titulo') as string;
        const anio = parseInt(formData.get('anio') as string);
        const sinopsis = formData.get('sinopsis') as string;
        const duracion = parseInt(formData.get('duracion') as string);
        const tema = formData.get('tema') as string;
        const investigador = formData.get('investigador') as string;
        const youtubeUrl = formData.get('youtubeUrl') as string;

        try {
            const nuevoDocumental = new Documental(titulo, anio, sinopsis, duracion, tema, investigador, youtubeUrl);
            catalogo.agregar(nuevoDocumental);

            log('HERENCIA', `Nueva instancia de Documental creada extendiendo Contenido`);
            log('POLIMORFISMO', `Documental "${titulo}" agregado al catálogo`);

            form.reset();
            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
            switchTab('catalogo');
            guardarTodo();
        } catch (error) {
            log('ENCAPSULAMIENTO', `Error al crear documental: ${(error as Error).message}`);
        }
    };

    return {
        onReproducir,
        onToggleLista,
        onQuitar,
        onCalificar,
        onVerDetalle,
        onEliminar,
        onAgregarPelicula,
        onAgregarSerie,
        onAgregarDocumental
    };
}

export const actualizarPreviewEpisodios = (): void => {
    const preview = document.getElementById('episodios-preview');
    const episodiosTemporales = (window as any).episodiosTemporales || [];
    if (!preview) return;

    if (episodiosTemporales.length === 0) {
        preview.innerHTML = '<span style="color: var(--text-secondary); font-size: 0.85rem;">Sin episodios</span>';
    } else {
        preview.innerHTML = episodiosTemporales.map((e: any, i: number) =>
            `<div style="display: flex; justify-content: space-between; align-items: center; color: var(--text-primary); font-size: 0.85rem; padding: 0.25rem 0; border-bottom: 1px solid var(--border);">
                <span>${i + 1}. ${e.titulo} (${e.duracionMin}m)</span>
                <button type="button" onclick="eliminarEpisodioTemp(${i})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 1rem;">×</button>
            </div>`
        ).join('');
    }
};

export const actualizarPreviewTemporadas = (): void => {
    const preview = document.getElementById('temporadas-preview');
    const temporadasTemporales = (window as any).temporadasTemporales || [];
    if (!preview) return;

    if (temporadasTemporales.length === 0) {
        preview.innerHTML = '';
    } else {
        preview.innerHTML = temporadasTemporales.map((t: any, i: number) =>
            `<div style="background-color: var(--bg-secondary); padding: 0.75rem; border-radius: 4px; margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong style="color: var(--text-primary);">Temporada ${t.numero}</strong>
                    <button type="button" onclick="eliminarTemporadaTemp(${i})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 1rem;">×</button>
                </div>
                <div style="color: var(--text-secondary); font-size: 0.85rem;">
                    ${t.episodios.length} episodio${t.episodios.length !== 1 ? 's' : ''}
                </div>
            </div>`
        ).join('');
    }
};

(window as any).eliminarEpisodioTemp = (index: number): void => {
    const episodios = (window as any).episodiosTemporales || [];
    episodios.splice(index, 1);
    actualizarPreviewEpisodios();
};

(window as any).eliminarTemporadaTemp = (index: number): void => {
    const temporadas = (window as any).temporadasTemporales || [];
    temporadas.splice(index, 1);
    actualizarPreviewTemporadas();
};

export function switchTab(tabId: string): void {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}
