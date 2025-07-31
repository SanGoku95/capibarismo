# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7a027d33-a21c-4cb3-bcb2-18ac557bbab2

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7a027d33-a21c-4cb3-bcb2-18ac557bbab2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7a027d33-a21c-4cb3-bcb2-18ac557bbab2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# 🥊 Presidential Punch Perú

**Análisis comparativo de las posturas de los candidatos para las elecciones presidenciales de Perú.**

Este proyecto ofrece una plataforma interactiva para comparar las propuestas y planes de gobierno de los candidatos, utilizando una matriz de debate detallada y fichas informativas. El objetivo es proporcionar a los votantes una herramienta clara y basada en datos para tomar decisiones informadas.

## ✨ Key Features

*   **Matriz de Debate:** Compara las posturas de los candidatos sobre temas y subtemas específicos.
*   **Filtros Dinámicos:** Filtra la matriz por tema de interés y por los candidatos que deseas comparar.
*   **Evidencia y Fuentes:** Cada postura está respaldada por evidencia y enlaces a las fuentes originales (planes de gobierno, entrevistas, etc.).
*   **Perfiles de Candidatos:** Fichas detalladas con información biográfica y profesional de cada candidato.
*   **Diseño Moderno:** Interfaz limpia y responsiva construida con un sistema de diseño moderno.

## 🛠️ Tech Stack

*   **Framework:** [React](https://react.dev/) con [Vite](https://vitejs.dev/)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Componentes UI:**
    *   [shadcn/ui](https://ui.shadcn.com/): Para la estructura general y componentes de la aplicación.
    *   [Material-UI (MUI)](https://mui.com/): Utilizado para la tabla de datos en la página de Debate.
    *   [Material React Table](https://www.material-react-table.com/): Para la matriz de debate interactiva.
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Gestión de Estado (Cliente):** [Zustand](https://zustand-demo.pmnd.rs/)
*   **Linting:** [ESLint](https://eslint.org/)

## 🚀 Getting Started

Sigue estos pasos para levantar el proyecto en tu máquina local.

### Prerequisites

Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu sistema (se recomienda la versión LTS).

### Installation

1.  **Clona el repositorio:**
    ```sh
    git clone https://github.com/tu-usuario/presidential-punch-peru.git
    ```

2.  **Navega al directorio del proyecto:**
    ```sh
    cd presidential-punch-peru
    ```

3.  **Instala las dependencias:**
    ```sh
    npm install
    ```

4.  **Inicia el servidor de desarrollo:**
    ```sh
    npm run dev
    ```

La aplicación estará disponible en `http://localhost:8080`.

##  NPM Scripts

*   `npm run dev`: Inicia el servidor de desarrollo con HMR.
*   `npm run build`: Compila la aplicación para producción.
*   `npm run lint`: Ejecuta el linter (ESLint) en el proyecto.
*   `npm run preview`: Previsualiza la build de producción localmente.
