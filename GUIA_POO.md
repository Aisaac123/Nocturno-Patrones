# Guía POO - Nocturno

Esta guía detalla cómo este proyecto implementa correctamente los pilares de la Programación Orientada a Objetos (POO), las relaciones UML, y la arquitectura de servicios según la planificación académica.

---

## 1. Arquitectura del Proyecto

### 1.1 Estructura de Carpetas

```
src/
├── domain/           # Capa de Dominio (POO puro)
│   ├── Contenido.ts          # Clase abstracta base
│   ├── Pelicula.ts           # Subclase concreta
│   ├── Serie.ts              # Subclase concreta
│   ├── Documental.ts         # Subclase concreta
│   ├── Usuario.ts            # Entidad de usuario
│   ├── Catalogo.ts           # Colección de contenidos
│   ├── ListaDeReproduccion.ts # Agregación de contenidos
│   ├── Temporada.ts          # Parte de Serie (Composición)
│   └── Episodio.ts           # Value Object
├── services/         # Capa de Servicios (Infraestructura)
│   ├── persistencia.ts       # Servicio genérico de localStorage
│   └── repositorio.ts        # Conversión DTO ↔ Dominio
├── ui/               # Capa de Presentación
│   ├── events.ts             # Manejo de eventos
│   └── renderers.ts          # Renderizado de UI
├── utils/            # Utilidades
│   ├── formatters.ts         # Formateo de datos
│   └── logger.ts             # Bitácora POO/UML
├── seed.ts           # Datos iniciales
└── main.ts           # Punto de entrada
```

### 1.2 Principios de Arquitectura

#### Separación de Responsabilidades (SRP)
- **Domain:** Solo lógica de negocio, POO puro
- **Services:** Persistencia y conversión de datos
- **UI:** Interacción con el DOM
- **Utils:** Funciones auxiliares sin estado

#### Patrón Repository
```typescript
// services/repositorio.ts
export class Repositorio {
    // Convierte instancias de clases a DTOs (JSON)
    contenidoToDto(contenido: any): any { }

    // Convierte DTOs a instancias de clases
    dtoToContenido(dto: any): any { }

    // Guarda/carga desde localStorage
    guardarCatalogo(catalogo: Catalogo): void { }
    cargarCatalogo(): Catalogo | null { }
}
```

**Beneficio:** El dominio no sabe nada de localStorage. La persistencia es un detalle de infraestructura.

---

## 2. Persistencia en localStorage

### 2.1 Servicio Genérico de Persistencia

```typescript
// services/persistencia.ts
export class Persistencia<T> {
    private readonly clave: string;

    constructor(clave: string) {
        this.clave = clave;
    }

    guardar(datos: T): void {
        const serializado = JSON.stringify(datos);
        localStorage.setItem(this.clave, serializado);
    }

    cargar(): T | null {
        const serializado = localStorage.getItem(this.clave);
        return serializado ? JSON.parse(serializado) : null;
    }
}
```

**Características POO:**
- **Encapsulamiento:** Oculta detalles de localStorage
- **Generics:** Tipo fuerte `<T>` para cualquier dato
- **Constructor:** Recibe clave como parámetro

### 2.2 Repositorio (Conversión DTO ↔ Dominio)

```typescript
// services/repositorio.ts
export class Repositorio {
    private persistenciaCatalogo: Persistencia<any[]>;
    private persistenciaUsuario: Persistencia<any>;
    private persistenciaLista: Persistencia<any>;

    constructor() {
        this.persistenciaCatalogo = new Persistencia('nocturno_catalogo');
        this.persistenciaUsuario = new Persistencia('nocturno_usuario');
        this.persistenciaLista = new Persistencia('nocturno_lista');
    }

    guardarCatalogo(catalogo: Catalogo): void {
        const dtos = catalogo.todos.map(c => this.contenidoToDto(c));
        this.persistenciaCatalogo.guardar(dtos);
    }

    cargarCatalogo(): Catalogo | null {
        const dtos = this.persistenciaCatalogo.cargar();
        const catalogo = new Catalogo();
        dtos.forEach(dto => {
            const contenido = this.dtoToContenido(dto);
            catalogo.agregar(contenido);
        });
        return catalogo;
    }
}
```

**Características POO:**
- **Encapsulamiento:** Oculta lógica de serialización
- **Constructor:** Inicializa servicios de persistencia
- **Composición:** Contiene instancias de `Persistencia`

### 2.3 Flujo de Persistencia

```
Usuario interactúa con UI
↓
Events llama a métodos de dominio
↓
Dominio modifica estado en memoria
↓
Repositorio convierte a DTOs
↓
Persistencia guarda en localStorage
```

---

## 3. Los 4 Pilares de POO

### 3.1 Abstracción

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

### 3.2 Encapsulamiento

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

### 3.3 Herencia

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

    constructor(titulo: string, anio: number, sinopsis: string, duracionMin: number, director: string, youtubeUrl?: string) {
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

### 3.4 Polimorfismo

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

## 4. Relaciones UML

### 4.1 Asociación

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

### 4.2 Agregación

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

### 4.3 Composición

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

### 4.4 Dependencia

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

## 5. Patrones Adicionales

### 5.1 Value Object

**Definición:** Objeto simple definido por sus atributos, sin identidad propia.

**Implementación:** `Episodio`

```typescript
export class Episodio {
    readonly numero: number;
    readonly titulo: string;
    readonly duracionMin: number;

    constructor(numero: number, titulo: string, duracionMin: number);
    constructor(numero: number, titulo: string, duracionMin: number, descripcion: string);
    constructor(numero: number, titulo: string, duracionMin: number, descripcion?: string) {
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
- Constructor sobrecargado para flexibilidad.

### 5.2 Repository Pattern

**Definición:** Abstrae el almacenamiento de datos, separando lógica de dominio de persistencia.

**Implementación:** `Repositorio`

```typescript
export class Repositorio {
    guardarCatalogo(catalogo: Catalogo): void {
        const dtos = catalogo.todos.map(c => this.contenidoToDto(c));
        this.persistenciaCatalogo.guardar(dtos);
    }

    cargarCatalogo(): Catalogo | null {
        const dtos = this.persistenciaCatalogo.cargar();
        // Convierte DTOs a instancias de clases
    }
}
```

**Beneficios:**
- El dominio no sabe de localStorage.
- Fácil cambiar de storage (localStorage → IndexedDB → API).
- Código testeable sin dependencia de storage real.

---

## 6. Uso Correcto de TypeScript

### 6.1 Tipado Fuerte

**Sin `any`:** Todos los parámetros y retornos tienen tipos explícitos.

```typescript
// ❌ INCORRECTO
calificar(estrellas: any): void { }

// ✅ CORRECTO
calificar(estrellas: number): void { }
```

### 6.2 Interfaces para contratos

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

### 6.3 Sobrecargas tipadas

```typescript
// Múltiples firmas, una implementación
reproducir(): string;
reproducir(autoplay: boolean): string;
reproducir(autoplay: boolean = false): string {
    // Implementación real
}
```

### 6.4 Generics

```typescript
export class Persistencia<T> {
    guardar(datos: T): void { }
    cargar(): T | null { }
}

// Uso
const persistenciaCatalogo = new Persistencia<Contenido[]>('catalogo');
```

---

## 7. Checklist de Criterios Cumplidos

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
- [x] Generics (`Persistencia<T>`)

### Arquitectura
- [x] Separación de capas (Domain, Services, UI, Utils)
- [x] Patrón Repository para persistencia
- [x] Servicio genérico de persistencia
- [x] DTOs para conversión entre dominio y storage
- [x] Inyección de dependencias (Repositorio en seed y events)

### Persistencia
- [x] Todo el estado en localStorage
- [x] Conversión automática DTO ↔ Dominio
- [x] Carga automática al iniciar
- [x] Guardado automático en cada cambio
- [x] Datos iniciales solo si no hay localStorage

### KISS (Keep It Simple, Stupid)
- [x] Comentarios concisos solo donde es necesario
- [x] Funciones pequeñas y con una responsabilidad
- [x] Sin abstracciones prematuras
- [x] Código legible y directo

---

## 8. Ejemplos de Uso

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

### Persistencia automática
```typescript
// Al crear datos, se guardan automáticamente
const datos = crearDatos(repositorio);
// → localStorage actualizado

// Al modificar, se guarda automáticamente
catalogo.agregar(nuevaPelicula);
// → localStorage actualizado

// Al recargar la página, se restauran
const datos = crearDatos(repositorio);
// → Datos cargados desde localStorage
```

---

## 9. Conclusión

Este proyecto demuestra una implementación académica correcta de POO con arquitectura limpia:

1. **Pilares sólidos:** Abstracción, encapsulamiento, herencia y polimorfismo están claramente implementados.
2. **Relaciones UML precisas:** Asociación, agregación, composición y dependencia se usan en los contextos correctos.
3. **TypeScript profesional:** Tipado fuerte, sin `any`, con sobrecargas, generics y abstracciones.
4. **Arquitectura limpia:** Separación de capas, patrón Repository, servicios genéricos.
5. **Persistencia completa:** Todo el estado en localStorage con conversión automática DTO ↔ Dominio.
6. **Código limpio:** KISS aplicado, comentarios concisos, código legible.

El código es un ejemplo académico excelente para explicar y evaluar conceptos de POO, arquitectura de software y persistencia en un contexto real.
