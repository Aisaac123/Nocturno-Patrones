/**
 * UTILS - Logger
 *
 * DEMUESTRA:
 * - BITÁCORA POO/UML: Sistema de logging que registra qué conceptos
 *   de POO/UML se activan durante la ejecución
 *
 * RESPONSABILIDAD: Registrar y mostrar conceptos de POO/UML en la bitácora
 */

type ConceptoPOO = 'ABSTRACCIÓN' | 'ENCAPSULAMIENTO' | 'HERENCIA' | 'POLIMORFISMO' | 'COMPOSICIÓN' | 'AGREGACIÓN' | 'ASOCIACIÓN' | 'PERSISTENCIA';

const colores: Record<ConceptoPOO, string> = {
    'ABSTRACCIÓN': 'badge-abstraccion',
    'ENCAPSULAMIENTO': 'badge-encapsulamiento',
    'HERENCIA': 'badge-herencia',
    'POLIMORFISMO': 'badge-polimorfismo',
    'COMPOSICIÓN': 'badge-composicion',
    'AGREGACIÓN': 'badge-agregacion',
    'ASOCIACIÓN': 'badge-asociacion',
    'PERSISTENCIA': 'badge-info'
};

/**
 * Agrega una entrada a la bitácora con el concepto y mensaje
 * @param concepto - Concepto de POO/UML que se activó
 * @param mensaje - Descripción de lo que ocurrió
 */
export function log(concepto: ConceptoPOO, mensaje: string): void {
    const bitacoraContent = document.getElementById('bitacora-content');
    if (!bitacoraContent) return;

    const timestamp = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const badgeClass = colores[concepto];

    const entry = document.createElement('div');
    entry.className = 'bitacora-entry';
    entry.innerHTML = `
        <span class="timestamp">[${timestamp}]</span>
        <span class="badge ${badgeClass}">${concepto}</span>
        <span class="mensaje">${mensaje}</span>
    `;

    bitacoraContent.appendChild(entry);

    // Auto-scroll al final
    bitacoraContent.scrollTop = bitacoraContent.scrollHeight;
}

/**
 * Limpia la bitácora
 */
export function limpiarBitacora(): void {
    const bitacoraContent = document.getElementById('bitacora-content');
    if (!bitacoraContent) return;

    bitacoraContent.innerHTML = '';
}
