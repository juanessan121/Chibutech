# Chibutech Frontend 💧

Bienvenido al frontend del **ERP Chibutech** (Sistema Central de Gestión para Juntas de Agua). Este proyecto está construido con React, Vite y utiliza una estética Glassmorphism para proporcionar una experiencia de usuario moderna, rápida y dinámica.

## 🛠️ Tecnologías Principales

*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Routing:** React Router DOM (v6)
*   **Estilos:** Vanilla CSS (Glassmorphism, Variables Nativas)
*   **Iconografía:** Lucide React
*   **Notificaciones:** Sonner
*   **Formularios:** React Hook Form
*   **Estado:** Zustand (para el manejo de la sesión de usuario y permisos)

## 🚀 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu máquina antes de empezar:

*   [Node.js](https://nodejs.org/es/) (Versión 18.x o superior)
*   NPM (viene incluido con Node.js)

## 📦 Instalación y Configuración Local

1.  **Abre la terminal** en la carpeta `frontend` del proyecto:
    ```bash
    cd d:\ChibuleoProyect\Chibutech\frontend
    ```

2.  **Instala las dependencias** del proyecto:
    ```bash
    npm install
    ```

3.  **Ejecuta el servidor de desarrollo local**:
    ```bash
    npm run dev
    ```

4.  **Accede a la aplicación**:
    Abre tu navegador y entra a: `http://localhost:5173`

> [!TIP]
> **Modo Mock:** Actualmente el frontend está diseñado para funcionar de manera independiente mostrando datos de prueba (`mocks`) mientras se conecta el backend oficial. Puedes iniciar sesión y navegar por todos los módulos sin necesidad de base de datos para pruebas visuales.

## 📁 Estructura del Proyecto

*   `/src/assets/`: Imágenes de fondo generadas, iconos y multimedia.
*   `/src/components/`: Componentes reutilizables de UI (Tarjetas, modales, etc.).
*   `/src/layouts/`: Estructuras base de la aplicación (`AuthLayout`, `DashboardLayout`).
*   `/src/pages/`: Las pantallas principales (Login, Landing, Dashboard, Módulos).
*   `/src/routes/`: Configuración de enrutamiento y protección de rutas (`AppRouter.jsx`).
*   `/src/services/`: Lógica de consumo de API (`axiosConfig.js`, etc.).
*   `/src/store/`: Estado global de Zustand (`useAuthStore.js`).
*   `index.css`: Hoja de estilos global, variables de color y clases glassmorphism.

## 🔒 Usuarios de Prueba (Mocks)

Para probar los diferentes roles y pantallas de la aplicación en modo desarrollo, puedes iniciar sesión (con cualquier contraseña) usando las siguientes cédulas en la pantalla de inicio:

*   **Administrador:** `1111111111` (Acceso a todos los módulos)
*   **Directiva:** `2222222222` (Acceso a mingas, multas y reportes)
*   **Usuario/Agricultor:** `3333333333` (Acceso solo a sus deudas y turnos)

---
*Desarrollado para la comunidad de Chibuleo.*
