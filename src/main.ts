import { crearDatos } from './seed';
import { renderCatalogo, renderMiLista } from './ui/renderers';
import { setupEventListeners, switchTab } from './ui/events';
import { log, limpiarBitacora } from './utils/logger';
import { Repositorio } from './services/repositorio';

console.log('Nocturno - Iniciando aplicación...');

function main(): void {
    limpiarBitacora();

    const repositorio = new Repositorio();
    const datos = crearDatos(repositorio);
    const { usuario, catalogo, miLista } = datos;

    log('PERSISTENCIA', 'Datos cargados desde localStorage');
    log('HERENCIA', 'Creando instancias de subclases (Pelicula, Serie, Documental)');
    log('COMPOSICIÓN', 'Serie creada con Temporadas que viven solo dentro de ella');

    const handlers = setupEventListeners(datos, repositorio);

    renderCatalogo(
        catalogo,
        handlers.onReproducir,
        handlers.onToggleLista,
        handlers.onCalificar,
        handlers.onVerDetalle,
        handlers.onEliminar
    );

    renderMiLista(miLista, handlers.onQuitar, handlers.onVerDetalle);

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const tabId = target.dataset.tab;
            if (tabId) {
                switchTab(tabId);
            }
        });
    });

    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('click', () => {
            switchTab('catalogo');
        });
        logo.style.cursor = 'pointer';
    }

    const tipoSelector = document.getElementById('tipo-contenido') as HTMLSelectElement;
    if (tipoSelector) {
        tipoSelector.addEventListener('change', (e) => {
            const tipo = (e.target as HTMLSelectElement).value;

            document.getElementById('form-pelicula')!.style.display = 'none';
            document.getElementById('form-serie')!.style.display = 'none';
            document.getElementById('form-documental')!.style.display = 'none';

            if (tipo === 'pelicula') {
                document.getElementById('form-pelicula')!.style.display = 'block';
            } else if (tipo === 'serie') {
                document.getElementById('form-serie')!.style.display = 'block';
            } else if (tipo === 'documental') {
                document.getElementById('form-documental')!.style.display = 'block';
            }
        });
    }

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

    log('ABSTRACCIÓN', 'Aplicación iniciada usando interfaz común de Contenido');
    console.log('Nocturno - Aplicación inicializada correctamente');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
