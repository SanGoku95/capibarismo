# 🥊 Presidential Punch Perú

**Análisis comparativo de las posturas de los candidatos para las elecciones presidenciales de Perú.**

Este proyecto ofrece una plataforma interactiva para comparar las propuestas y planes de gobierno de los candidatos presidenciales, utilizando herramientas visuales modernas y análisis detallado. El objetivo es proporcionar a los votantes una herramienta clara y basada en datos para tomar decisiones informadas.

## ✨ Características Principales

*   **🗳️ Comparación:** Compara las posturas de los candidatos lado a lado sobre temas específicos con evidencia respaldada por fuentes.
*   **🧭 Brújula Política:** Visualización interactiva que posiciona a los candidatos en los ejes económico y social del espectro político.
*   **👤 Perfiles Detallados:** Fichas completas de cada candidato con información biográfica, trayectoria política, creencias clave y proyecto político.
*   **🔍 Filtros Dinámicos:** Filtra y personaliza las comparaciones por candidatos de interés.
*   **📰 Centro de Noticias:** Seguimiento de eventos y noticias relevantes de la campaña electoral.
*   **🤖 Asistente IA:** Chat interactivo para consultas sobre las propuestas y posturas de los candidatos.
*   **📱 Diseño Responsivo:** Interfaz optimizada para dispositivos móviles y de escritorio con tema inspirado en videojuegos de los 90s.

## 🛠️ Stack Tecnológico

*   **Framework:** [React](https://react.dev/) con [Vite](https://vitejs.dev/)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) - Sistema de componentes moderno y accesible
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitario
*   **Navegación:** [React Router](https://reactrouter.com/) - Routing del lado cliente
*   **Gestión de Estado:** [Zustand](https://zustand-demo.pmnd.rs/) - Estado global ligero
*   **Consultas:** [TanStack Query](https://tanstack.com/query) - Gestión de datos asíncrona
*   **Iconos:** [Lucide React](https://lucide.dev/) + [React Icons](https://react-icons.github.io/react-icons/)
*   **Linting:** [ESLint](https://eslint.org/) - Análisis de código estático

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base del sistema de diseño
│   ├── PoliticalCompass.tsx
│   ├── CandidatePicker.tsx
│   └── CompareView.tsx
├── pages/              # Páginas principales de la aplicación
│   ├── HomePage.tsx
│   ├── ComparePage.tsx
│   ├── PoliticalCompassPage.tsx
│   ├── CandidateProfile.tsx
│   ├── ChatPage.tsx
│   └── News.tsx
├── data/               # Datos estáticos de candidatos y eventos
├── hooks/              # Hooks personalizados
├── store/              # Gestión de estado global
└── lib/                # Utilidades y configuraciones
```

## 🚀 Inicio Rápido

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/presidential-punch-peru.git
    cd presidential-punch-peru
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

La aplicación estará disponible en `http://localhost`.

## 📋 Scripts Disponibles

*   `npm run dev` - Inicia el servidor de desarrollo con HMR
*   `npm run build` - Compila la aplicación para producción
*   `npm run preview` - Previsualiza la build de producción localmente
*   `npm run lint` - Ejecuta ESLint para análisis de código

## 🎨 Características del Diseño

El proyecto utiliza un tema visual inspirado en los videojuegos de lucha de los 90s:

- **Paleta de colores vibrantes** con contrastes altos
- **Tipografía pixelada** (Press Start 2P) para títulos
- **Elementos de interfaz chunky** con bordes definidos
- **Colores de equipo** (rojo/azul) para representar espectros políticos
- **Efectos visuales** como sombras y gradientes neón

## 🧭 Funcionalidades Clave

### Brújula Política
- Posicionamiento de candidatos en ejes económico (izquierda-derecha) y social (autoritario-libertario)
- Interacción clickeable para navegar a perfiles de candidatos
- Visualización responsiva que se adapta a diferentes tamaños de pantalla

### Comparación de Candidatos
- Vista lado a lado de las propuestas de múltiples candidatos
- Filtrado por temas específicos
- Enlaces a fuentes y evidencia respaldatoria

### Perfiles de Candidatos
- Información biográfica completa
- Trayectoria política detallada
- Creencias clave con evidencia
- Proyectos políticos y propuestas

### Chat con IA
- Asistente conversacional para consultas sobre candidatos
- Sugerencias de preguntas frecuentes
- Interfaz de chat moderna y responsiva

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
2. Commit tus cambios (`git commit -am 'Añade nueva característica'`)
3. Push a la rama (`git push origin feature/nueva-caracteristica`)
4. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
