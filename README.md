# ☕ BaristaFlow

**BaristaFlow** es una plataforma integral diseñada para los amantes del café de especialidad. Conecta a entusiastas, baristas y educadores en un ecosistema único que combina aprendizaje, comercio y comunidad.

![BaristaFlow Banner](https://via.placeholder.com/1200x400?text=BaristaFlow+Platform)

## 🚀 Características Principales

### 🎓 Educación y Cursos
- **Plataforma de E-learning**: Cursos estructurados desde nivel básico hasta avanzado.
- **Roles de Educador**: Los usuarios aprobados pueden crear y gestionar sus propios cursos.
- **Ambiente de Aprendizaje**: Interfaz dedicada para el seguimiento de lecciones y progreso.

### 🛒 Tienda de Especialidad
- **E-commerce Completo**: Venta de granos de café, métodos de extracción (V60, Chemex, etc.) y accesorios.
- **Carrito de Compras**: Gestión de pedidos y simulación de pasarela de pagos.

### 📖 Recetario Interactivo
- **Catálogo de Recetas**: Guías paso a paso para diferentes métodos de preparación.
- **Detalles Ricos**: Tiempos, gramajes, temperaturas y video tutoriales integrados.

### 👥 Comunidad
- **Blog Comunitario**: Espacio para compartir artículos, experiencias y noticias.
- **Perfiles Sociales**: Seguimiento de usuarios, biografías personalizadas y estadísticas de actividad.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Biblioteca principal de UI.
- **TypeScript**: Para un código robusto y tipado.
- **Vite**: Build tool de alto rendimiento.
- **Tailwind CSS**: Framework de estilos utility-first.
- **React Router DOM**: Navegación SPA.
- **Context API**: Gestión de estado global (Auth, Cart).

### Backend & Servicios
- **Node.js & Express**: API REST para gestión de blogs y productos (simulado/local).
- **Firebase**:
  - **Authentication**: Gestión de usuarios y sesiones.
  - **Realtime Database**: Almacenamiento de perfiles, notificaciones y datos en tiempo real.
  - **Storage**: Alojamiento de imágenes de perfil y recursos.

## 📦 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente.

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Cuenta de Firebase configurada

### 1. Clonar el Repositorio
```bash
git clone https://github.com/TESBrunoBRM/BaristaFlow.git
cd BaristaFlow
```

### 2. Configurar el Frontend (`BaristaFlowP`)
```bash
cd BaristaFlowP
npm install
```

**Variables de Entorno**:
Crea un archivo `.env` en `BaristaFlowP/` con tus credenciales de Firebase:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_DATABASE_URL=tu_database_url
```

### 3. Configurar el Backend (`baristaflow-api`)
```bash
cd ../baristaflow-api
npm install
```

### 4. Ejecutar el Proyecto

**Backend (Terminal 1):**
```bash
cd baristaflow-api
npm run dev
# El servidor correrá en http://localhost:3000
```

**Frontend (Terminal 2):**
```bash
cd BaristaFlowP
npm run dev
# La aplicación abrirá en http://localhost:5173
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un pull request para mejoras.

1. Haz un Fork del proyecto.
2. Crea tu rama de funcionalidad (`git checkout -b feature/AmazingFeature`).
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---
Desarrollado con ☕ y ❤️ por el equipo de BaristaFlow.
