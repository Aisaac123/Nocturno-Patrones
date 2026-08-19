import { log } from '../utils/logger';
import { renderMiLista, actualizarBotonesMiLista, renderCatalogo, renderDetalleContenido } from './renderers';
import { Pelicula } from '../domain/Pelicula';
import { Serie } from '../domain/Serie';
import { Documental } from '../domain/Documental';
import { Episodio } from '../domain/Episodio';

/**
 * UI - Events
 *
 * DEMUESTRA:
 * - MANEJO DE EVENTOS: Separación de lógica de eventos del renderizado
 *
 * RESPONSABILIDAD: Configurar y manejar eventos de la interfaz
 */

/**
 * Configura todos los event listeners de la aplicación
 * @param datos - Objeto con todas las instancias de la aplicación
 */
export function setupEventListeners(datos: any): any {
    const { usuario, catalogo, miLista } = datos;

    // Handler para reproducir contenido
    const onReproducir = (contenido: any) => {
        log('ASOCIACIÓN', `Usuario "${usuario.nombre}" iniciando ASOCIACIÓN con "${contenido.titulo}"`);
        const resultado = usuario.ver(contenido);
        log('POLIMORFISMO', resultado);

        // Re-renderizar catálogo para actualizar vistas
        renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
    };

    // Handler para toggle de mi lista
    const onToggleLista = (contenido: any) => {
        if (miLista.contiene(contenido)) {
            miLista.quitar(contenido);
            log('AGREGACIÓN', `Quitando "${contenido.titulo}" de lista (removiendo referencia)`);
        } else {
            miLista.agregar(contenido);
            log('AGREGACIÓN', `Agregando "${contenido.titulo}" a lista (agregando referencia)`);
        }

        renderMiLista(miLista, onQuitar, onVerDetalle);
        actualizarBotonesMiLista(miLista, catalogo.todos);
    };

    // Handler para quitar de mi lista
    const onQuitar = (contenido: any) => {
        miLista.quitar(contenido);
        log('AGREGACIÓN', `Quitando "${contenido.titulo}" de lista (removiendo referencia)`);

        renderMiLista(miLista, onQuitar, onVerDetalle);
        actualizarBotonesMiLista(miLista, catalogo.todos);
    };

    // Handler para calificar
    const onCalificar = (contenido: any, estrellas: number) => {
        try {
            contenido.calificar(estrellas);
            log('ENCAPSULAMIENTO', `Calificando "${contenido.titulo}" con ${estrellas} estrellas (validación 1-5)`);
            log('POLIMORFISMO', `Promedio actualizado: ${contenido.promedioCalificacion.toFixed(1)}`);

            // Re-renderizar catálogo para mostrar nueva calificación
            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
        } catch (error) {
            log('ENCAPSULAMIENTO', `Error al calificar: ${(error as Error).message}`);
        }
    };

    // Handler para ver detalle
    const onVerDetalle = (contenido: any) => {
        // Guardar referencia al contenido actual
        (window as any).contenidoActual = contenido;

        // Renderizar detalle en la página específica
        renderDetalleContenido(contenido);

        // Cambiar al tab de detalle
        switchTab('detalle');
    };

    // Handler para eliminar contenido
    const onEliminar = (contenido: any) => {
        if (confirm(`¿Estás seguro de eliminar "${contenido.titulo}"?`)) {
            catalogo.eliminar(contenido);

            // También quitar de mi lista si está allí
            if (miLista.contiene(contenido)) {
                miLista.quitar(contenido);
            }

            log('ENCAPSULAMIENTO', `Eliminando "${contenido.titulo}" del catálogo`);

            // Re-renderizar todo
            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
            renderMiLista(miLista, onQuitar, onVerDetalle);
        }
    };

    // Handler para agregar película desde formulario
    const onAgregarPelicula = (event: Event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const titulo = formData.get('titulo') as string;
        const anio = parseInt(formData.get('anio') as string);
        const sinopsis = formData.get('sinopsis') as string;
        const duracion = parseInt(formData.get('duracion') as string);
        const director = formData.get('director') as string;

        try {
            const nuevaPelicula = new Pelicula(titulo, anio, sinopsis, duracion, director);
            catalogo.agregar(nuevaPelicula);

            log('HERENCIA', `Nueva instancia de Pelicula creada extendiendo Contenido`);
            log('POLIMORFISMO', `Película "${titulo}" agregada al catálogo con su implementación específica`);

            // Limpiar formulario
            form.reset();

            // Re-renderizar catálogo
            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);

            // Cambiar al tab de catálogo
            switchTab('catalogo');
        } catch (error) {
            log('ENCAPSULAMIENTO', `Error al crear película: ${(error as Error).message}`);
        }
    };

    // Handler para agregar serie desde formulario
    const onAgregarSerie = (event: Event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const titulo = formData.get('titulo') as string;
        const anio = parseInt(formData.get('anio') as string);
        const sinopsis = formData.get('sinopsis') as string;
        const creador = formData.get('creador') as string;

        try {
            const nuevaSerie = new Serie(titulo, anio, sinopsis, creador);

            // Agregar una temporada de ejemplo
            const temporada1 = nuevaSerie.agregarTemporada(1);
            temporada1.agregarEpisodio(new Episodio(1, 'Piloto', 45));
            temporada1.agregarEpisodio(new Episodio(2, 'Desarrollo', 42));

            catalogo.agregar(nuevaSerie);

            log('HERENCIA', `Nueva instancia de Serie creada extendiendo Contenido`);
            log('COMPOSICIÓN', `Serie "${titulo}" creada con temporadas que viven solo dentro de ella`);

            // Limpiar formulario
            form.reset();

            // Re-renderizar catálogo
            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);

            // Cambiar al tab de catálogo
            switchTab('catalogo');
        } catch (error) {
            log('ENCAPSULAMIENTO', `Error al crear serie: ${(error as Error).message}`);
        }
    };

    // Handler para agregar documental desde formulario
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

        try {
            const nuevoDocumental = new Documental(titulo, anio, sinopsis, duracion, tema, investigador);
            catalogo.agregar(nuevoDocumental);

            log('HERENCIA', `Nueva instancia de Documental creada extendiendo Contenido`);
            log('POLIMORFISMO', `Documental "${titulo}" agregado al catálogo con su implementación específica`);

            // Limpiar formulario
            form.reset();

            // Re-renderizar catálogo
            renderCatalogo(catalogo, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);

            // Cambiar al tab de catálogo
            switchTab('catalogo');
        } catch (error) {
            log('ENCAPSULAMIENTO', `Error al crear documental: ${(error as Error).message}`);
        }
    };

    // Retornar handlers para usar en renderers
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

/**
 * Función para cambiar entre tabs
 * @param tabId - ID del tab a mostrar
 */
export function switchTab(tabId: string): void {
    // Ocultar todos los contenidos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Desactivar todos los tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar el contenido seleccionado
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // Activar el tab seleccionado
    const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}
