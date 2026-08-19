import { formatearDuracion, formatearEstrellas, formatearTipo, formatearNumero, extraerYoutubeId, generarYoutubeEmbed, obtenerColorTipo } from '../utils/formatters';
import { log } from '../utils/logger';
import { Contenido } from '../domain/Contenido';
import { Pelicula } from '../domain/Pelicula';
import { Serie } from '../domain/Serie';
import { Documental } from '../domain/Documental';
import { Temporada } from '../domain/Temporada';
import { Episodio } from '../domain/Episodio';

/**
 * UI - Renderers
 *
 * RESPONSABILIDAD: Renderizar la interfaz de usuario
 */
export function renderCatalogo(
    catalogo: { todos: Contenido[] },
    onReproducir: (contenido: Contenido) => void,
    onToggleLista: (contenido: Contenido) => void,
    onCalificar: (contenido: Contenido, estrellas: number) => void,
    onVerDetalle: (contenido: Contenido) => void,
    onEliminar: (contenido: Contenido) => void
): void {
    const grid = document.getElementById('catalogo-grid');
    if (!grid) return;

    grid.innerHTML = '';

    catalogo.todos.forEach((contenido: Contenido) => {
        const card = renderCard(contenido, onReproducir, onToggleLista, onCalificar, onVerDetalle, onEliminar);
        grid.appendChild(card);
    });

    log('ABSTRACCIÓN', `Renderizando catálogo con ${catalogo.todos.length} contenidos`);
}

function renderCard(
    contenido: Contenido,
    onReproducir: (contenido: Contenido) => void,
    onToggleLista: (contenido: Contenido) => void,
    onCalificar: (contenido: Contenido, estrellas: number) => void,
    onVerDetalle: (contenido: Contenido) => void,
    onEliminar: (contenido: Contenido) => void
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

    card.innerHTML = `
        <div class="card-header">
            <span class="card-type" style="background-color: ${colorTipo};">${tipo}</span>
            <span class="card-year">${contenido.anio}</span>
        </div>
        <h3 class="card-title">${contenido.titulo}</h3>
        <p class="card-sinopsis">${contenido.sinopsisPublica}</p>
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

export function renderMiLista(
    lista: { contiene: (contenido: Contenido) => boolean; getItems: () => Contenido[] },
    onQuitar: (contenido: Contenido) => void,
    onVerDetalle: (contenido: Contenido) => void
): void {
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

    items.forEach((contenido: Contenido) => {
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

    log('AGREGACIÓN', `Renderizando lista de reproducción con ${items.length} contenidos`);
}

export function renderDetalleContenido(contenido: Contenido, onReproducirDetalle?: (contenido: Contenido) => void, onToggleListaDetalle?: (contenido: Contenido) => void, miLista?: { contiene: (contenido: Contenido) => boolean }): void {
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

        <p class="detalle-sinopsis">${contenido.sinopsisPublica}</p>

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
            <button class="btn btn-secondary btn-mi-lista-detalle">${miLista && miLista.contiene(contenido) ? '✓ En lista' : '+ Mi lista'}</button>
        </div>
    `;

    if (contenido.tipo === 'Película' && (contenido as Pelicula).director) {
        html += `
            <div class="detalle-info-item">
                <div class="detalle-info-label">Director</div>
                <div class="detalle-info-value">${(contenido as Pelicula).director}</div>
            </div>
        `;
    }

    if (contenido.tipo === 'Serie') {
        html += `
            <div class="detalle-info-item">
                <div class="detalle-info-label">Creador</div>
                <div class="detalle-info-value">${(contenido as Serie).creador}</div>
            </div>
            <div class="detalle-info-item">
                <div class="detalle-info-label">Temporadas</div>
                <div class="detalle-info-value">${(contenido as Serie).totalTemporadas}</div>
            </div>
        `;

        const temporadas = (contenido as Serie).obtenerTemporadas();
        temporadas.forEach((temporada: Temporada) => {
            const episodios = temporada.getEpisodios();
            html += `
                <div class="temporada">
                    <h4 class="temporada-header">Temporada ${temporada.numero} - ${formatearDuracion(temporada.duracionMin)}</h4>
                    <ul class="episodios-list">
                        ${episodios.map((ep: Episodio) => `
                            <li class="episodio-item episodio-interactivo" data-titulo="${ep.titulo}" data-url="${(ep as any).youtubeUrl || ''}">
                                <span class="episodio-info">Episodio ${ep.numero}: ${ep.titulo} (${ep.duracionMin}m)</span>
                                ${(ep as any).youtubeUrl ? '<span class="episodio-play">▶</span>' : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });

        log('COMPOSICIÓN', `Renderizando detalle de serie con ${temporadas.length} temporadas`);
    }

    if (contenido.tipo === 'Documental') {
        html += `
            <div class="detalle-info-item">
                <div class="detalle-info-label">Tema</div>
                <div class="detalle-info-value">${(contenido as Documental).tema}</div>
            </div>
            <div class="detalle-info-item">
                <div class="detalle-info-label">Investigador</div>
                <div class="detalle-info-value">${(contenido as Documental).investigador}</div>
            </div>
        `;
    }

    container.innerHTML = html;

    const btnVolver = container.querySelector('.btn-volver') as HTMLElement;
    btnVolver.addEventListener('click', () => {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById('catalogo')?.classList.add('active');
        document.querySelector('[data-tab="catalogo"]')?.classList.add('active');
    });

    const btnReproducirDetalle = container.querySelector('.btn-reproducir-detalle') as HTMLElement;
    if (btnReproducirDetalle && onReproducirDetalle) {
        btnReproducirDetalle.addEventListener('click', () => onReproducirDetalle(contenido));
    }

    const btnMiListaDetalle = container.querySelector('.btn-mi-lista-detalle') as HTMLElement;
    if (btnMiListaDetalle && onToggleListaDetalle) {
        btnMiListaDetalle.addEventListener('click', () => {
            onToggleListaDetalle(contenido);
            if (miLista) {
                btnMiListaDetalle.textContent = miLista.contiene(contenido) ? '✓ En lista' : '+ Mi lista';
                btnMiListaDetalle.classList.toggle('active', miLista.contiene(contenido));
            }
        });
    }

    const episodiosInteractivos = container.querySelectorAll('.episodio-interactivo');
    episodiosInteractivos.forEach(ep => {
        ep.addEventListener('click', () => {
            const url = (ep as HTMLElement).dataset.url;
            if (url) {
                const youtubeId = extraerYoutubeId(url);
                const youtubeEmbed = youtubeId ? generarYoutubeEmbed(youtubeId) : '';
                const playerContainer = container.querySelector('.youtube-container');
                if (youtubeEmbed && playerContainer) {
                    playerContainer.innerHTML = youtubeEmbed;
                }
            }
        });
    });

    log('POLIMORFISMO', `Renderizando detalle de ${contenido.tipo}: ${contenido.titulo}`);
}

export function actualizarBotonesMiLista(
    lista: { contiene: (contenido: Contenido) => boolean },
    contenidos: Contenido[]
): void {
    contenidos.forEach((contenido: Contenido) => {
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
