<div align="center">
  <img src="/BaristaFlowP/src/assets/logo.png" alt="BaristaFlow Logo" width="120" />

  <h1>☕ BaristaFlow</h1>

  <p>
    <strong>La plataforma integral para los amantes del café de especialidad.</strong>
    <br />
    Conecta, aprende y descubre en un ecosistema único.
  </p>

  <p>
    <a href="#-características-principales">Características</a> •
    <a href="#-tecnologías-utilizadas">Tech Stack</a> •
    <a href="#-instalación-y-configuración">Instalación</a> •
    <a href="#-manual-de-usuario">Manual de Usuario</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/STATUS-EN%20DESARROLLO-orange?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/VERSION-1.0.0-blue?style=for-the-badge" alt="Version" />
  </p>

  <br />
  
  ![BaristaFlow Banner](https://via.placeholder.com/1200x400?text=BaristaFlow+Platform)
</div>

<hr />

## 🚀 Características Principales

<table border="0">
  <tr>
    <td width="50%" valign="top">
      <h3>🎓 Educación y Cursos</h3>
      <ul>
        <li><strong>E-learning:</strong> Cursos desde nivel básico hasta avanzado.</li>
        <li><strong>Roles de Educador:</strong> Creación y gestión de contenido propio.</li>
        <li><strong>Tracking:</strong> Interfaz dedicada para seguimiento de progreso.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🛒 Tienda de Especialidad</h3>
      <ul>
        <li><strong>E-commerce:</strong> Venta de granos, métodos (V60, Chemex) y accesorios.</li>
        <li><strong>Gestión:</strong> Carrito de compras y simulación de pagos.</li>
        <li><strong>Catálogo:</strong> Filtrado avanzado de productos.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📖 Recetario Interactivo</h3>
      <ul>
        <li><strong>Guías paso a paso:</strong> Tiempos, gramajes y temperaturas.</li>
        <li><strong>Multimedia:</strong> Video tutoriales integrados en las recetas.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>👥 Comunidad</h3>
      <ul>
        <li><strong>Blog:</strong> Artículos, experiencias y noticias del mundo del café.</li>
        <li><strong>Social:</strong> Perfiles de usuario, biografías y estadísticas.</li>
      </ul>
    </td>
  </tr>
</table>

<br />

## 🛠️ Tecnologías Utilizadas

<div align="center">

### Frontend
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />

### Backend & Servicios
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
<img src="https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white" alt="Firebase" />

</div>

## 📦 Instalación y Configuración

Sigue estos pasos para levantar el entorno de desarrollo localmente.

### Prerrequisitos
* Node.js (v16+)
* npm o yarn
* Cuenta de Firebase activa

### 1. Clonar Repositorio

```bash
git clone https://github.com/TESBrunoBRM/BaristaFlow.git
cd BaristaFlow
```

### 2. Configuración del Backend (API)

El backend maneja la lógica de cursos, blogs y correos.

```bash
cd baristaflow-api
npm install
```

**Variables de Entorno (.env):**
Crea un archivo `.env` en `baristaflow-api/` con las siguientes variables (reemplaza con tus datos):

```env
PORT=3001
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
# Firebase Config (Opcional si usas Admin SDK, pero recomendado para Client SDK)
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_APP_ID=tu_app_id
```

**Iniciar Backend:**
```bash
npm run dev
```

### 3. Configuración del Frontend

La interfaz de usuario principal.

```bash
cd ../BaristaFlowP
npm install
```

**Configuración de Firebase:**
Asegúrate de que `src/firebase.ts` tenga la configuración correcta de tu proyecto Firebase.

**Iniciar Frontend:**
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### 4. Reglas de Firebase (Importante)

Para que la aplicación funcione correctamente (especialmente la creación de cursos y blogs), debes configurar las reglas de **Realtime Database** en tu consola de Firebase:

```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      ".indexOn": ["username", "displayName"],
      "$uid": {
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "products": {
      ".read": true,
      ".write": "auth != null"
    },
    "blogs": {
      ".read": true,
      ".write": "auth != null"
    },
    "courses": {
      ".read": true,
      ".write": true, 
      ".indexOn": ["authorId"]
    },
    "orders": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

---

## 📘 Manual de Usuario

Bienvenido a la guía oficial de **BaristaFlow**.

### 1. Gestión de Cuenta

*   **Registro**: Usa el formulario o inicia sesión con Google para acceder a todas las funciones.
*   **Perfil**: En tu perfil puedes ver tus estadísticas, editar tu biografía y ver tus cursos activos.

### 2. Módulos Principales

#### ☕ Recetas
Explora métodos de preparación como V60, Chemex o Espresso. Cada receta incluye pasos detallados, tiempos y videos explicativos.

#### 🎓 Cursos (Rol Estudiante)
*   Navega por el catálogo de cursos.
*   Inscríbete para acceder al **Ambiente de Aprendizaje**.
*   Sigue tu progreso lección por lección.

#### 🛒 Tienda
*   Compra granos de café, cafeteras y accesorios.
*   Agrega productos al carrito y simula el proceso de pago.
*   Recibirás un correo de confirmación (si el backend está configurado).

#### 👥 Comunidad
*   Lee blogs escritos por otros baristas.
*   Comparte tus propias experiencias creando tus publicaciones.

### 3. Manual para Educadores

Si deseas compartir tu conocimiento, puedes solicitar el rol de **Educador**.

1.  Ve a tu **Perfil** y selecciona **"Convertirme en Educador"**.
2.  Una vez aprobado, tendrás acceso al **Panel de Educador**.
3.  **Crear Curso**:
    *   Define título, precio y nivel.
    *   Usa el editor interactivo para agregar lecciones de texto, video o imágenes.
    *   Publica tu curso para que otros estudiantes se inscriban.

---

<div align="center">
  <p>Hecho con ☕ y ❤️ por el equipo de BaristaFlow</p>
</div>
