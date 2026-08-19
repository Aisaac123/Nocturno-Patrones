# Nocturno - Plataforma de Streaming

Mini plataforma de streaming desarrollada en TypeScript vanilla para demostrar los 4 pilares de Programación Orientada a Objetos (POO) y las 4 relaciones UML.

## 🎯 Objetivo Académico

Este proyecto fue desarrollado como trabajo académico para el curso de Patrones de Diseño, con el propósito de demostrar la implementación práctica de:

### Pilares de POO
- **ABSTRACCIÓN:** Clase abstracta `Contenido` con métodos abstractos
- **ENCAPSULAMIENTO:** Campos privados/protegidos con getters y validación
- **HERENCIA:** Pelicula, Serie, Documental extienden Contenido
- **POLIMORFISMO:** Implementaciones específicas de métodos en cada subclase

### Relaciones UML
- **COMPOSICIÓN:** Serie - Temporada - Episodio (ciclo de vida compartido)
- **AGREGACIÓN:** ListaDeReproduccion - Contenido (referencias sin propiedad)
- **ASOCIACIÓN:** Usuario - Contenido (relación débil a través de historial)
- **DEPENDENCIA:** Usuario usa Contenido en método `ver()`

## 🛠️ Stack Tecnológico

- **Lenguaje:** TypeScript (vanilla, sin frameworks)
- **Compilación:** TypeScript Compiler (tsc) + esbuild para bundling
- **Estilos:** CSS3 vanilla
- **Runtime:** Navegador (ES2020+)

## 📁 Estructura del Proyecto

```
nocturno/
├── src/
│   ├── domain/             # Clases de dominio (POO pura)
│   │   ├── Contenido.ts    # Clase abstracta base
│   │   ├── Pelicula.ts     # Subclase Pelicula
│   │   ├── Serie.ts        # Subclase Serie con composición
│   │   ├── Documental.ts   # Subclase Documental
│   │   ├── Episodio.ts     # Value object Episodio
│   │   ├── Temporada.ts    # Clase Temporada
│   │   ├── Usuario.ts      # Clase Usuario
│   │   ├── ListaDeReproduccion.ts  # Clase ListaDeReproduccion
│   │   └── Catalogo.ts     # Clase Catalogo
│   ├── ui/                 # Lógica de presentación
│   │   ├── renderers.ts    # Funciones de renderizado
│   │   └── events.ts       # Manejadores de eventos
│   ├── utils/              # Helpers y utilidades
│   │   ├── formatters.ts   # Formato de tiempo, estrellas, etc.
│   │   └── logger.ts       # Bitácora de conceptos POO/UML
│   ├── seed.ts             # Datos de ejemplo
│   └── main.ts             # Punto de entrada
├── index.html              # Estructura HTML
├── styles.css              # Estilos visuales
├── tsconfig.json           # Configuración TypeScript
├── package.json            # Dependencias
└── README.md              # Este archivo
```

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js (v14 o superior)
- npm (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd nocturno
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Compilar el proyecto**
   ```bash
   npm run build
   ```

   Este comando:
   - Compila los archivos TypeScript a JavaScript
   - Crea un bundle con esbuild en `dist/bundle.js`

4. **Ejecutar la aplicación**

   **Opción A: Abrir directamente (recomendado)**
   - Simplemente abre el archivo `index.html` en tu navegador
   - No requiere servidor HTTP

   **Opción B: Con servidor local**
   ```bash
   npx serve . -l 3000
   ```
   Luego abre `http://localhost:3000` en tu navegador

## 📱 Funcionalidades

### CRUD Completo
- **CREATE:** Agregar películas, series y documentales con enlaces de YouTube
- **READ:** Visualizar catálogo, lista de reproducción y detalles
- **UPDATE:** Sistema de calificación con estrellas (1-5)
- **DELETE:** Eliminar contenidos del catálogo

### Características de UI
- **Navegación por tabs:** Catálogo, Agregar, Mi Lista, Bitácora
- **Cards de contenido:** Muestran tipo, año, sinopsis, duración, calificación
- **Colores por tipo:** Películas (azul), Series (púrpura), Documentales (verde)
- **Sistema de rating:** Calificación promedio con estrellas visuales
- **Reproductor YouTube:** Integración de videos reales en la página de detalle
- **Lista de reproducción:** Gestión de contenidos favoritos
- **Detalle de contenido:** Página dedicada con reproductor integrado
- **Bitácora POO/UML:** Registro en tiempo real de conceptos activados

### Reproducción de Videos
- **Soporte YouTube:** Links de YouTube opcionales para cada contenido
- **Reproductor integrado:** Iframe de YouTube en página de detalle
- **Botón reproducir:** Acceso directo al reproductor desde catálogo o detalle
- **Videos de ejemplo:** Seed data incluye videos reales de YouTube

## 🎓 Conceptos POO/UML Demostrados

Cada acción en la aplicación activa diferentes conceptos que se muestran en la bitácora:

- 🔵 **ABSTRACCIÓN:** Uso de interfaces comunes
- 🟢 **ENCAPSULAMIENTO:** Validación y control de acceso
- 🟠 **HERENCIA:** Extensión de clases base
- 🟣 **POLIMORFISMO:** Comportamiento específico por subclase
- 🔴 **COMPOSICIÓN:** Ciclo de vida compartido (Serie-Temporada)
- 🟡 **AGREGACIÓN:** Referencias sin propiedad (Lista-Contenido)
- 🔷 **ASOCIACIÓN:** Relación débil (Usuario-Contenido)

## 📝 Datos de Ejemplo

El proyecto incluye datos iniciales con videos reales de YouTube:
- 2 películas con directores, duraciones y videos de YouTube
- 1 serie con 2 temporadas, 2-3 episodios cada una y video
- 1 documental con tema, investigador y video
- 1 usuario "Tú"
- 1 lista de reproducción vacía

## 🔧 Scripts Disponibles

```bash
npm run build    # Compila TypeScript y crea bundle
npm run watch    # Modo watch para desarrollo (compilación automática)
```

## 🎨 Diseño

- **Paleta de colores:** Profesional y sobria (grises oscuros con acento azul)
- **Colores por tipo:** Películas (azul), Series (púrpura), Documentales (verde)
- **Tipografía:** System fonts (Arial, Segoe UI, Roboto)
- **Responsive:** Adaptable a dispositivos móviles con diseño mobile-first
- **Estilo:** Limpio y moderno, optimizado para uso académico

## 📄 Licencia

Este proyecto es un trabajo académico desarrollado para fines educativos.

## 👨‍🏫 Autor

Desarrollado como trabajo práctico para el curso de Patrones de Diseño.
