import { formatearDuracion, formatearEstrellas, formatearTipo, formatearNumero, extraerYoutubeId, generarYoutubeEmbed, obtenerColorTipo } from '../utils/formatters';
import { log } from '../utils/logger';

/**
 * UI - Renderers
 *
 * DEMUESTRA:
 * - SEPARACIÓN DE RESPONSABILIDADES: Lógica de presentación separada
 *   del dominio
 *
 * RESPONSABILIDAD: Renderizar la interfaz de usuario
 */

/**
 * Renderiza el catálogo completo
 * @param catalogo - Instancia del catálogo
 * @param onReproducir - Callback para acción de reproducir
 * @param onToggleLista - Callback para toggle de mi lista
 * @param onCalificar - Callback para calificar
 * @param onVerDetalle - Callback para ver detalle
 * @param onEliminar - Callback para eliminar
 */
export function renderCatalogo(
    catalogo: any,
    onReproducir: (contenido: any) => void,
    onToggleLista: (contenido: any) => void,
    onCalificar: (contenido: any, estrellas: number) => void,
    onVerDetalle: (contenido: any) => void,
    onEliminar: (contenido: any) => void
): void {
    const grid = document.getElementById('catalogo-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const contenidos = catalogo.todos;

    contenidos.forEach((contenido: any) => {
        const card = renderCard(contenido, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
        grid.appendChild(card);
    });

    log('ABSTRACCIÓN', `Renderizando catálogo con ${contenidos.length} contenidos usando interfaz común`);
}

/**
 * Renderiza una card individual de contenido
 */
function renderCard(
    contenido: any,
    onReproducir: (contenido: any) => void,
    onToggleLista: (contenido: any) => void,
    onCalificar: (contenido: any, estrellas: number) => void,
    onVerDetalle: (contenido: any) => void,
    onEliminar: (contenido: any) => void
): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card';

    const tipo = formatearTipo(contenido.tipo);
    const duracion = formatearDuracion(contenido.duracionTotal());
    const promedio = contenido.promedioCalificacion;
    const estrellas = formatearEstrellas(promedio);
    const votos = contenido.totalCalificaciones;
    const vistas = formatearNumero(contenido.totalVistas);
    const colorTipo = obtenerColorTipo(contenido.tipo);

    console.log(`Renderizando card "${contenido.titulo}":`, { promedio, estrellas, votos });

    card.innerHTML = `
        <div class="card-header">
            <span class="card-type" style="background-color: ${colorTipo};">${tipo}</span>
            <span class="card-year">${contenido.anio}</span>
        </div>
        <h3 class="card-title">${contenido.titulo}</h3>
        <p class="card-synopsis">${contenido.sinopsis}</p>
        <div class="card-meta">
            <span class="card-duration">⏱ ${duracion}</span>
            <div class="card-rating">
                <span class="stars">${estrellas}</span>
                <span class="rating-count">(${votos})</span>
            </div>
        </div>
        <div class="card-views">👁 ${vistas} vistas</div>
        <div class="card-actions">
            <button class="btn btn-primary btn-reproducir">▶ Reproducir</button>
            <button class="btn btn-secondary btn-mi-lista">+ Mi lista</button>
            <button class="btn btn-secondary btn-ver-detalle">Ver Detalle</button>
            <button class="btn btn-secondary btn-eliminar" style="background-color: var(--danger); border-color: var(--danger);">Eliminar</button>
        </div>
        <div class="star-selector">
            ${[1, 2, 3, 4, 5].map(n => `<button class="star-btn" data-estrellas="${n}">★</button>`).join('')}
        </div>
    `;

    // Event listeners
    const btnReproducir = card.querySelector('.btn-reproducir') as HTMLElement;
    btnReproducir.addEventListener('click', () => onReproducir(contenido));

    const btnMiLista = card.querySelector('.btn-mi-lista') as HTMLElement;
    btnMiLista.addEventListener('click', () => onToggleLista(contenido));

    const btnVerDetalle = card.querySelector('.btn-ver-detalle') as HTMLElement;
    btnVerDetalle.addEventListener('click', () => onVerDetalle(contenido));

    const btnEliminar = card.querySelector('.btn-eliminar') as HTMLElement;
    btnEliminar.addEventListener('click', () => onEliminar(contenido));

    const starButtons = card.querySelectorAll('.star-btn');
    starButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const estrellas = parseInt((e.target as HTMLElement).dataset.estrellas || '0');
            onCalificar(contenido, estrellas);
        });
    });

    return card;
}

/**
 * Renderiza la lista de reproducción del usuario
 * @param lista - Instancia de ListaDeReproduccion
 * @param onQuitar - Callback para quitar de la lista
 * @param onVerDetalle - Callback para ver detalle
 */
export function renderMiLista(lista: any, onQuitar: (contenido: any) => void, onVerDetalle: (contenido: any) => void): void {
    const container = document.getElementById('mi-lista-content');
    if (!container) return;

    const items = lista.getItems();

    if (items.length === 0) {
        container.innerHTML = '<div class="mi-lista-empty">Tu lista está vacía. Agrega contenidos desde el catálogo.</div>';
        return;
    }

    container.innerHTML = '';

    const listaContainer = document.createElement('div');
    listaContainer.className = 'lista-items';

    items.forEach((contenido: any) => {
        const item = document.createElement('div');
        item.className = 'lista-item';
        item.innerHTML = `
            <div class="lista-item-info">
                <div class="lista-item-titulo">${contenido.titulo}</div>
                <div class="lista-item-meta">
                    ${contenido.tipo} • ${contenido.anio} • ${formatearDuracion(contenido.duracionTotal())}
                </div>
            </div>
            <div class="lista-item-actions">
                <button class="btn btn-sm btn-secondary btn-ver-detalle">Ver Detalle</button>
                <button class="btn btn-sm btn-secondary btn-quitar">Quitar</button>
            </div>
        `;

        const btnVerDetalle = item.querySelector('.btn-ver-detalle') as HTMLElement;
        btnVerDetalle.addEventListener('click', () => onVerDetalle(contenido));

        const btnQuitar = item.querySelector('.btn-quitar') as HTMLElement;
        btnQuitar.addEventListener('click', () => onQuitar(contenido));

        listaContainer.appendChild(item);
    });

    container.appendChild(listaContainer);

    log('AGREGACIÓN', `Renderizando lista de reproducción con ${items.length} contenidos (referencias sin propiedad)`);
}

/**
 * Renderiza el detalle de un contenido en la página específica
 * @param contenido - Instancia de Contenido
 */
export function renderDetalleContenido(contenido: any): void {
    const container = document.getElementById('detalle-content');
    if (!container) return;

    const tipo = formatearTipo(contenido.tipo);
    const duracion = formatearDuracion(contenido.duracionTotal());
    const promedio = contenido.promedioCalificacion;
    const estrellas = formatearEstrellas(promedio);
    const votos = contenido.totalCalificaciones;
    const vistas = formatearNumero(contenido.totalVistas);
    const colorTipo = obtenerColorTipo(contenido.tipo);
    const youtubeId = extraerYoutubeId(contenido.urlYoutube);
    const youtubeEmbed = youtubeId ? generarYoutubeEmbed(youtubeId) : '';

    let html = `
        <div class="detalle-header">
            <div>
                <span class="detalle-tipo" style="background-color: ${colorTipo};">${tipo}</span>
                <h2 class="detalle-titulo">${contenido.titulo}</h2>
                <div class="detalle-meta">
                    ${contenido.anio} • ${duracion} • ${vistas} vistas
                </div>
            </div>
            <button class="btn btn-secondary btn-volver">← Volver</button>
        </div>

        ${youtubeEmbed ? youtubeEmbed : '<p style="color: var(--text-secondary); font-style: italic;">No hay video disponible</p>'}

        <p class="detalle-sinopsis">${contenido.sinopsis}</p>

        <div class="detalle-info-grid">
            <div class="detalle-info-item">
                <div class="detalle-info-label">Calificación</div>
                <div class="detalle-info-value">${estrellas} (${votos} votos)</div>
            </div>
            <div class="detalle-info-item">
                <div class="detalle-info-label">Duración</div>
                <div class="detalle-info-value">${duracion}</div>
            </div>
            <div class="detalle-info-item">
                <div class="detalle-info-label">Vistas</div>
                <div class="detalle-info-value">${vistas}</div>
            </div>
        </div>

        <div class="detalle-actions">
            <button class="btn btn-primary btn-reproducir-detalle">▶ Reproducir</button>
            <button class="btn btn-secondary btn-mi-lista-detalle">+ Mi lista</button>
        </div>
    `;

    // Campos específicos según tipo
    if (contenido.tipo === 'Película' && contenido.director) {
        html += `
            <div class="detalle-info-item">
                <div class="detalle-info-label">Director</div>
                <div class="detalle-info-value">${contenido.director}</div>
            </div>
        `;
    }

    if (contenido.tipo === 'Serie') {
        html += `
            <div class="detalle-info-item">
                <div class="detalle-info-label">Creador</div>
                <div class="detalle-info-value">${contenido.creador}</div>
            </div>
            <div class="detalle-info-item">
                <div class="detalle-info-label">Temporadas</div>
                <div class="detalle-info-value">${contenido.totalTemporadas}</div>
            </div>
        `;

        const temporadas = contenido.obtenerTemporadas();
        temporadas.forEach((temporada: any) => {
            const episodios = temporada.getEpisodios();
            html += `
                <div class="temporada">
                    <h4 class="temporada-header">Temporada ${temporada.numero} - ${formatearDuracion(temporada.duracionMin)}</h4>
                    <ul class="episodios-list">
                        ${episodios.map((ep: any) => `
                            <li class="episodio-item">
                                Episodio ${ep.numero}: ${ep.titulo} (${ep.duracionMin}m)
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });

        log('COMPOSICIÓN', `Renderizando detalle de serie con ${temporadas.length} temporadas (ciclo de vida compartido)`);
    }

    if (contenido.tipo === 'Documental') {
        html += `
            <div class="detalle-info-item">
                <div class="detalle-info-label">Tema</div>
                <div class="detalle-info-value">${contenido.tema}</div>
            </div>
            <div class="detalle-info-item">
                <div class="detalle-info-label">Investigador</div>
                <div class="detalle-info-value">${contenido.investigador}</div>
            </div>
        `;
    }

    container.innerHTML = html;

    // Event listener para volver
    const btnVolver = container.querySelector('.btn-volver') as HTMLElement;
    btnVolver.addEventListener('click', () => {
        // Cambiar al tab de catálogo manualmente
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById('catalogo')?.classList.add('active');
        document.querySelector('[data-tab="catalogo"]')?.classList.add('active');
    });

    log('POLIMORFISMO', `Renderizando detalle de ${contenido.tipo}: ${contenido.titulo}`);
}

/**
 * Actualiza el estado visual de los botones de "Mi lista"
 * @param lista - Instancia de ListaDeReproduccion
 * @param contenidos - Todos los contenidos del catálogo
 */
export function actualizarBotonesMiLista(lista: any, contenidos: any[]): void {
    contenidos.forEach((contenido: any) => {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const titulo = card.querySelector('.card-title')?.textContent;
            if (titulo === contenido.titulo) {
                const btn = card.querySelector('.btn-mi-lista') as HTMLElement;
                if (lista.contiene(contenido)) {
                    btn.textContent = '✓ En lista';
                    btn.classList.add('active');
                } else {
                    btn.textContent = '+ Mi lista';
                    btn.classList.remove('active');
                }
            }
        });
    });
}
