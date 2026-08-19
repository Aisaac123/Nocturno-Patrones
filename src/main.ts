// Punto de entrada de la aplicación Nocturno
// Este archivo orquesta toda la aplicación

import { crearDatos } from './seed';
import { renderCatalogo, renderMiLista } from './ui/renderers';
import { setupEventListeners, switchTab } from './ui/events';
import { log, limpiarBitacora } from './utils/logger';

console.log('Nocturno - Iniciando aplicación...');

/**
 * Función principal que inicializa y ejecuta la aplicación
 */
function main(): void {
    // Limpiar bitácora al inicio
    limpiarBitacora();

    // Crear datos de ejemplo
    const datos = crearDatos();
    const { usuario, catalogo, miLista } = datos;

    log('HERENCIA', 'Creando instancias de subclases (Pelicula, Serie, Documental) que extienden Contenido');
    log('COMPOSICIÓN', 'Creando Serie con Temporadas que viven solo dentro de ella');

    // Configurar event listeners
    const handlers = setupEventListeners(datos);

    // Renderizar catálogo inicial
    renderCatalogo(
        catalogo,
        handlers.onReproducir,
        handlers.onToggleLista,
        handlers.onCalificar,
        handlers.onVerDetalle,
        handlers.onEliminar
    );

    // Renderizar lista de reproducción inicial
    renderMiLista(miLista, handlers.onQuitar, handlers.onVerDetalle);

    // Configurar navegación de tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const tabId = target.dataset.tab;
            if (tabId) {
                switchTab(tabId);
            }
        });
    });

    // Configurar selector de tipo de contenido
    const tipoSelector = document.getElementById('tipo-contenido') as HTMLSelectElement;
    if (tipoSelector) {
        tipoSelector.addEventListener('change', (e) => {
            const tipo = (e.target as HTMLSelectElement).value;

            // Ocultar todos los formularios
            document.getElementById('form-pelicula')!.style.display = 'none';
            document.getElementById('form-serie')!.style.display = 'none';
            document.getElementById('form-documental')!.style.display = 'none';

            // Mostrar el formulario correspondiente
            if (tipo === 'pelicula') {
                document.getElementById('form-pelicula')!.style.display = 'block';
            } else if (tipo === 'serie') {
                document.getElementById('form-serie')!.style.display = 'block';
            } else if (tipo === 'documental') {
                document.getElementById('form-documental')!.style.display = 'block';
            }
        });
    }

    // Configurar formularios
    const formPelicula = document.getElementById('form-pelicula');
    if (formPelicula) {
        formPelicula.addEventListener('submit', handlers.onAgregarPelicula);
    }

    const formSerie = document.getElementById('form-serie');
    if (formSerie) {
        formSerie.addEventListener('submit', handlers.onAgregarSerie);
    }

    const formDocumental = document.getElementById('form-documental');
    if (formDocumental) {
        formDocumental.addEventListener('submit', handlers.onAgregarDocumental);
    }

    log('ABSTRACCIÓN', 'Aplicación iniciada usando interfaz común de Contenido para todos los tipos');
    console.log('Nocturno - Aplicación inicializada correctamente');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
