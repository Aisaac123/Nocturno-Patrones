# Guía POO - Nocturno

Esta guía detalla cómo este proyecto implementa correctamente los pilares de la Programación Orientada a Objetos (POO) y las relaciones UML según la planificación académica.

---

## 1. Los 4 Pilares de POO

### 1.1 Abstracción

**Definición:** Ocultar detalles de implementación y mostrar solo funcionalidad esencial.

**Implementación en el proyecto:**

#### Clase `Contenido` (Abstracta)
```typescript
export abstract class Contenido {
    abstract reproducir(): string;
    abstract reproducir(autoplay: boolean): string;
    abstract duracionTotal(): number;
    abstract get tipo(): string;
}
```

- **Por qué es abstracción:** Define el contrato que todas las subclases deben cumplir sin especificar cómo lo hacen.
- **Beneficio:** El código cliente trabaja con `Contenido` sin importar si es `Pelicula`, `Serie` o `Documental`.

#### Subclases implementan abstracción
```typescript
// Pelicula.ts
reproducir(): string {
    return `Reproduciendo película: ${this.titulo}...`;
}

// Serie.ts
reproducir(): string {
    return `Reproduciendo serie: ${this.titulo}...`;
}

// Documental.ts
reproducir(): string {
    return `Reproduciendo documental: ${this.titulo}...`;
}
```

- Cada subclase implementa `reproducir()` según su naturaleza específica.

---

### 1.2 Encapsulamiento

**Definición:** Restringir acceso a los detalles internos de un objeto y exponer solo lo necesario.

**Implementación en el proyecto:**

#### Campos privados
```typescript
export class Contenido {
    private calificaciones: number[] = [];  // Solo accesible dentro de Contenido
    protected sinopsis: string;            // Accesible por subclases
    protected vistoPor: Set<Usuario>;       // Accesible por subclases
}
```

- **`private`:** Nadie fuera de la clase puede modificar directamente.
- **`protected`:** Solo la clase y sus herederos pueden acceder.

#### Getters controlados
```typescript
get promedioCalificacion(): number {
    if (this.calificaciones.length === 0) return 0;
    return this.calificaciones.reduce((acc, val) => acc + val, 0) / this.calificaciones.length;
}

get sinopsisPublica(): string {
    return this.sinopsis;  // Expone sinopsis protegida de forma controlada
}
```

- **Beneficio:** El array `calificaciones` nunca se expone directamente, evitando manipulación externa.

#### Métodos con validación
```typescript
calificar(estrellas: number): void {
    if (estrellas < 1 || estrellas > 5) {
        throw new Error('La calificación debe estar entre 1 y 5');
    }
    this.calificaciones.push(estrellas);
}
```

- El estado interno se modifica solo a través de métodos controlados con validación.

---

### 1.3 Herencia

**Definición:** Crear nuevas clases basadas en clases existentes, reutilizando código.

**Implementación en el proyecto:**

#### Jerarquía de clases
```
Contenido (abstracta)
├── Pelicula
├── Serie
└── Documental
```

#### Subclases extienden Contenido
```typescript
export class Pelicula extends Contenido {
    private duracionMin: number;
    public director: string;

    constructor(...) {
        super(titulo, anio, sinopsis, youtubeUrl);  // Llama al constructor padre
        this.duracionMin = duracionMin;
        this.director = director;
    }
}
```

- **`extends`:** Hereda todos los campos y métodos de `Contenido`.
- **`super()`:** Inicializa la parte heredada.
- **Beneficio:** Código compartido (título, año, sinopsis, calificaciones) no se duplica.

---

### 1.4 Polimorfismo

**Definición:** Objetos de diferentes tipos pueden comportarse de manera uniforme a través de una interfaz común.

**Implementación en el proyecto:**

#### Polimorfismo por sobrescrita (Override)
```typescript
// Misma firma, comportamiento diferente
const contenidos: Contenido[] = [pelicula, serie, documental];

contenidos.forEach(c => {
    console.log(c.reproducir());  // Cada uno imprime su mensaje específico
});
```

- Cada subclase implementa `reproducir()` de forma diferente.

#### Polimorfismo por sobrecarga (Overload)
```typescript
// Contenido.ts
calificar(estrellas: number): void;
calificar(estrellas: number, usuario: Usuario): void;
calificar(estrellas: number, usuario?: Usuario): void {
    // Implementación con parámetro opcional
}

// Uso
contenido.calificar(5);                    // Solo califica
contenido.calificar(5, usuario);           // Califica y marca como visto
```

- **Beneficio:** Misma función con diferentes combinaciones de parámetros.

#### Sobrecarga de constructor
```typescript
// Catalogo.ts
constructor();                                    // Catálogo vacío
constructor(contenidosIniciales: Contenido[]);     // Catálogo con datos

// Uso
const catalogo1 = new Catalogo();
const catalogo2 = new Catalogo([pelicula, serie]);
```

- Permite crear objetos de diferentes formas según necesidad.

#### Sobrecarga de reproducir
```typescript
// Contenido.ts
abstract reproducir(): string;
abstract reproducir(autoplay: boolean): string;

// Pelicula.ts
reproducir(autoplay: boolean = false): string {
    if (autoplay) {
        return `🎬 AUTOREPRODUCIENDO película...`;
    }
    return `Reproduciendo película...`;
}
```

- Mismo método con parámetro opcional para comportamiento extendido.

---

## 2. Relaciones UML

### 2.1 Asociación

**Definición:** Relación "usa-a" temporal entre objetos. Uno conoce al otro pero no controla su ciclo de vida.

**Implementación:** `Usuario` → `Contenido`

```typescript
export class Usuario {
    private historial: Contenido[] = [];

    ver(contenido: Contenido): string {
        this.historial.push(contenido);  // Usuario conoce Contenido
        contenido.marcarVisto(this);      // Asociación bidireccional
        return contenido.reproducir();
    }
}
```

**Características:**
- `Usuario` tiene referencias a `Contenido` en su historial.
- Si `Usuario` se destruye, `Contenido` sigue existiendo en el catálogo.
- **Relación débil:** No hay propiedad del ciclo de vida.

---

### 2.2 Agregación

**Definición:** Relación "tiene-a" donde el todo tiene referencias a las partes, pero las partes pueden existir independientemente.

**Implementación:** `ListaDeReproduccion` → `Contenido`

```typescript
export class ListaDeReproduccion {
    private items: Contenido[] = [];

    agregar(contenido: Contenido): void {
        if (!this.items.includes(contenido)) {
            this.items.push(contenido);  // Referencia, no propiedad
        }
    }

    quitar(contenido: Contenido): void {
        const index = this.items.indexOf(contenido);
        if (index > -1) {
            this.items.splice(index, 1);  // Quita referencia
        }
    }
}
```

**Características:**
- La lista contiene referencias a contenidos del catálogo.
- Si la lista se destruye, los contenidos siguen existiendo en el catálogo.
- **Relación débil:** Las partes son independientes del todo.

---

### 2.3 Composición

**Definición:** Relación "es-parte-de" donde el todo controla el ciclo de vida de las partes. Si el todo muere, las partes mueren.

**Implementación:** `Serie` → `Temporada` → `Episodio`

```typescript
export class Serie extends Contenido {
    private temporadas: Temporada[] = [];  // Array privado, sin setter público

    agregarTemporada(numero: number): Temporada {
        const temporada = new Temporada(numero);  // Se crea internamente
        this.temporadas.push(temporada);
        return temporada;
    }

    // NO hay setter para temporadas
    // NO hay forma de inyectar temporadas externas
}
```

**Características:**
- Las temporadas se crean **dentro** de la serie.
- No hay setter público para `temporadas`.
- Si la serie se destruye, sus temporadas no tienen sentido fuera de ella.
- **Relación fuerte:** Las partes dependen del todo.

---

### 2.4 Dependencia

**Definición:** Relación "usa-temporalmente" donde un objeto depende de otro para funcionar.

**Implementación:** `Usuario.ver()` depende de `Contenido.reproducir()`

```typescript
export class Usuario {
    ver(contenido: Contenido): string {
        // Usuario DEPENDE de Contenido para esta operación
        return contenido.reproducir();  // Llama a método de Contenido
    }
}
```

**Características:**
- `Usuario` depende de `Contenido` solo durante la ejecución de `ver()`.
- No es una relación permanente como Asociación.
- **Temporal:** La dependencia existe solo durante la llamada al método.

---

## 3. Patrones Adicionales

### 3.1 Value Object

**Definición:** Objeto simple definido por sus atributos, sin identidad propia.

**Implementación:** `Episodio`

```typescript
export class Episodio {
    readonly numero: number;
    readonly titulo: string;
    readonly duracionMin: number;

    constructor(numero: number, titulo: string, duracionMin: number) {
        this.numero = numero;
        this.titulo = titulo;
        this.duracionMin = duracionMin;
    }
}
```

**Características:**
- Todos los campos son `readonly` (inmutables).
- No tiene métodos de comportamiento complejo.
- Definido completamente por sus valores.

---

## 4. Uso Correcto de TypeScript

### 4.1 Tipado Fuerte

**Sin `any`:** Todos los parámetros y retornos tienen tipos explícitos.

```typescript
// ❌ INCORRECTO
calificar(estrellas: any): void { }

// ✅ CORRECTO
calificar(estrellas: number): void { }
```

### 4.2 Interfaces para contratos

```typescript
interface DatosAplicacion {
    usuario: Usuario;
    catalogo: Catalogo;
    miLista: ListaDeReproduccion;
}

interface Handlers {
    onReproducir: (contenido: Contenido) => void;
    onCalificar: (contenido: Contenido, estrellas: number) => void;
}
```

### 4.3 Sobrecargas tipadas

```typescript
// Múltiples firmas, una implementación
reproducir(): string;
reproducir(autoplay: boolean): string;
reproducir(autoplay: boolean = false): string {
    // Implementación real
}
```

---

## 5. Checklist de Criterios Cumplidos

### Pilares POO
- [x] **Abstracción:** Clase abstracta `Contenido` con métodos abstractos
- [x] **Encapsulamiento:** Campos `private`/`protected`, getters controlados
- [x] **Herencia:** `Pelicula`, `Serie`, `Documental` extienden `Contenido`
- [x] **Polimorfismo:** Sobrescrita de métodos, sobrecarga de funciones

### Relaciones UML
- [x] **Asociación:** `Usuario` - `Contenido` (historial de visualizaciones)
- [x] **Agregación:** `ListaDeReproduccion` - `Contenido` (referencias independientes)
- [x] **Composición:** `Serie` - `Temporada` (ciclo de vida compartido)
- [x] **Dependencia:** `Usuario.ver()` depende de `Contenido.reproducir()`

### TypeScript Avanzado
- [x] Cero uso de `any`
- [x] Tipado fuerte en todo el código
- [x] Sobrecarga de métodos
- [x] Sobrecarga de constructores
- [x] Interfaces explícitas
- [x] Clases abstractas

### KISS (Keep It Simple, Stupid)
- [x] Comentarios concisos solo donde es necesario
- [x] Funciones pequeñas y con una responsabilidad
- [x] Sin abstracciones prematuras
- [x] Código legible y directo

---

## 6. Ejemplos de Uso

### Crear instancias con diferentes constructores
```typescript
// Constructor simple
const pelicula1 = new Pelicula('Título', 2023, 'Sinopsis', 120, 'Director');

// Constructor con YouTube URL
const pelicula2 = new Pelicula('Título', 2023, 'Sinopsis', 120, 'Director', 'youtube_url');
```

### Polimorfismo en acción
```typescript
const contenidos: Contenido[] = [pelicula, serie, documental];

contenidos.forEach(c => {
    console.log(c.reproducir());      // Cada uno se comporta diferente
    console.log(c.duracionTotal());   // Cada uno calcula diferente
    console.log(c.tipo);              // Cada uno retorna su tipo
});
```

### Sobrecarga de métodos
```typescript
// Solo calificar
contenido.calificar(5);

// Calificar y marcar como visto
contenido.calificar(5, usuario);

// Reproducir normal
contenido.reproducir();

// Reproducir con autoplay
contenido.reproducir(true);
```

---

## 7. Conclusión

Este proyecto demuestra una implementación académica correcta de POO:

1. **Pilares sólidos:** Abstracción, encapsulamiento, herencia y polimorfismo están claramente implementados.
2. **Relaciones UML precisas:** Asociación, agregación, composición y dependencia se usan en los contextos correctos.
3. **TypeScript profesional:** Tipado fuerte, sin `any`, con sobrecargas y abstracciones.
4. **Código limpio:** KISS aplicado, comentarios concisos, código legible.

El código es un ejemplo académico excelente para explicar y evaluar conceptos de POO en un contexto real.
