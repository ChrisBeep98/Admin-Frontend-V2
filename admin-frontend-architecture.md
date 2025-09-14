# Arquitectura y Fases del Frontend de Administración - Nevado Trek

Este documento detalla la arquitectura, las tecnologías y el desarrollo paso a paso del panel de administración para Nevado Trek.

## Fase 1: Configuración Inicial del Proyecto

### 1.1. Tecnologías y Herramientas

*   **Framework:** React v18+
*   **Bundler:** Vite
*   **Lenguaje:** TypeScript
*   **Librería de UI:** Material-UI (MUI)
*   **Gestor de Paquetes:** npm

### 1.2. Estructura del Proyecto (Inicial)

```
/admin-frontend
|-- /public
|-- /src
|   |-- /assets
|   |-- main.tsx
|   `-- App.tsx
|-- index.html
|-- package.json
|-- tsconfig.json
`-- vite.config.ts
```

### 1.3. Pasos de Configuración

1.  **Inicializar el proyecto:** Crear una nueva aplicación de React + TypeScript con Vite. `Realizado`
2.  **Instalar dependencias de UI:** Añadir Material-UI (`@mui/material`, `@emotion/react`, `@emotion/styled`) y los iconos (`@mui/icons-material`). `Realizado` (package.json actualizado).
3.  **Verificar script de desarrollo:** Asegurar que el comando `npm run dev` esté configurado en `package.json` para iniciar el servidor de desarrollo. `Realizado`

## Fase 2: Estructura y Tema Base de la Aplicación

### 2.1. Objetivos

*   Limpiar la plantilla inicial de Vite.
*   Establecer una base limpia con Material-UI, incluyendo un tema y reseteo de CSS.
*   Crear un componente principal de la aplicación como punto de partida.

### 2.2. Cambios Realizados

1.  **`main.tsx`:**
    *   Se eliminó la importación de `index.css`.
    *   Se importó `ThemeProvider`, `createTheme` y `CssBaseline` de Material-UI.
    *   Se configuró un tema oscuro (`dark mode`) por defecto para toda la aplicación.
    *   La aplicación ahora está envuelta en `ThemeProvider` y se aplica `CssBaseline` para unificar los estilos base.

2.  **`App.tsx`:**
    *   Se eliminó todo el código de la plantilla de Vite.
    *   El componente ahora muestra un encabezado simple (`<h1>Panel de Administración de Nevado Trek</h1>`) dentro de un `Container` de Material-UI.

3.  **Archivos CSS:**
    *   Se vació el contenido de `App.css` y `index.css`, ya que `CssBaseline` de MUI se encarga del reseteo de estilos.

## Fase 3: Sistema de Autenticación y Rutas

### 3.1. Enfoque

Se implementará un sistema de "login" basado en un token. El usuario introducirá un token de acceso que será validado contra un endpoint de administrador (`get_all_tours`). Si la validación es exitosa, se le dará acceso al panel.

### 3.2. Pasos de Implementación

1.  **Instalar Dependencias:** Se ha añadido `react-router-dom` al `package.json` para el manejo de rutas.
    *   **Acción Requerida:** El usuario debe ejecutar `npm install` para instalar la nueva dependencia.
2.  **Crear Estructura de Carpetas:** Se crearán los siguientes directorios en `src/`:
    *   `components/`: Para componentes reutilizables (ej. `ProtectedRoute`).
    *   `contexts/`: Para el `AuthContext` que manejará el estado de autenticación.
    *   `pages/`: Para los componentes de página (`Login`, `Dashboard`).
    *   `router/`: Para la configuración de las rutas.
    *   `services/`: Para la lógica de llamadas a la API.
3.  **Implementar Lógica de Autenticación:**
    *   **`AuthContext`:** Gestionará el token y el estado de autenticación (logueado/no logueado).
    *   **Página de Login:** Un formulario simple para introducir el token.
    *   **API Service:** Una función para verificar el token llamando al endpoint protegido.
4.  **Configurar Rutas:**
    *   Se usará `react-router-dom` para crear una ruta pública (`/login`) y rutas privadas para el panel de administración.
    *   Un componente `ProtectedRoute` redirigirá a los usuarios no autenticados a la página de login.

### 3.3. Estado Actual

Se ha actualizado el `package.json`. El siguiente paso es crear la estructura de archivos y directorios y luego implementar el código para el sistema de autenticación.
