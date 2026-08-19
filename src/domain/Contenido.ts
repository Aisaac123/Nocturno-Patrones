/**
 * CLASE ABSTRACTA Contenido
 *
 * DEMUESTRA:
 * - ABSTRACCIÓN: Define la interfaz común para todos los tipos de contenido
 * - ENCAPSULAMIENTO: Campos privados/protegidos con acceso controlado
 *
 * RESPONSABILIDAD: Contrato base para contenido reproducible
 */
export abstract class Contenido {
    readonly titulo: string;
    readonly anio: number;
    protected sinopsis: string;
    private calificaciones: number[] = [];
    protected vistoPor: Set<Usuario> = new Set();
    protected youtubeUrl: string;

    constructor(titulo: string, anio: number, sinopsis: string, youtubeUrl: string = '') {
        this.titulo = titulo;
        this.anio = anio;
        this.sinopsis = sinopsis;
        this.youtubeUrl = youtubeUrl;
    }

    calificar(estrellas: number): void {
        if (estrellas < 1 || estrellas > 5) {
            throw new Error('La calificación debe estar entre 1 y 5');
        }
        this.calificaciones.push(estrellas);
    }

    get promedioCalificacion(): number {
        if (this.calificaciones.length === 0) return 0;
        return this.calificaciones.reduce((acc, val) => acc + val, 0) / this.calificaciones.length;
    }

    get totalCalificaciones(): number {
        return this.calificaciones.length;
    }

    marcarVisto(usuario: Usuario): void {
        this.vistoPor.add(usuario);
    }

    get totalVistas(): number {
        return this.vistoPor.size;
    }

    get urlYoutube(): string {
        return this.youtubeUrl;
    }

    setUrlYoutube(url: string): void {
        this.youtubeUrl = url;
    }

    get sinopsisPublica(): string {
        return this.sinopsis;
    }

    abstract reproducir(): string;
    abstract duracionTotal(): number;
    abstract get tipo(): string;
}

import { Usuario } from './Usuario';
