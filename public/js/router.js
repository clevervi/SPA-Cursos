// === PLANTILLA SPA CURSOS ===
// Instrucciones: Implementa la lógica de enrutamiento y vistas importando las funciones necesarias desde views.js y auth.js.
// Puedes agregar, modificar o eliminar rutas según lo requiera tu aplicación.

// Importa los módulos necesarios para el enrutamiento y la autenticación
import { auth } from './auth.js';
import {
  showLogin,         // Función para mostrar la vista de login
  showRegister,      // Función para mostrar la vista de registro
  showDashboard,     // Función para mostrar la vista principal del dashboard
  showCourses,       // Función para mostrar la lista de cursos
  showCreateCourse,  // Función para mostrar el formulario de creación de curso
  showEditCourse,    // Función para mostrar el formulario de edición de curso
  renderNotFound     // Función para mostrar la página no encontrada
} from './views.js';

// Define las rutas de tu Single Page Application (SPA)
// Cada clave es un hash de URL y su valor es la función de vista correspondiente
const routes = {
  '#/login': showLogin,             // Ruta para la vista de login
  '#/register': showRegister,       // Ruta para la vista de registro
  '#/dashboard': showDashboard,     // Ruta para el dashboard principal (requiere autenticación)
  '#/dashboard/courses': showCourses, // Ruta para el listado de cursos (requiere autenticación)
  '#/dashboard/courses/create': showCreateCourse, // Ruta para crear un nuevo curso (solo admin)
  // Las rutas dinámicas como '#/dashboard/courses/edit/:id' se manejan con lógica adicional
};

/**
 * Función principal de enrutamiento.
 * Se encarga de determinar la vista a mostrar basándose en el hash de la URL.
 * También implementa la protección de rutas.
 */
export function router() {
  // Obtiene el hash actual de la URL, o establece '#/login' como ruta por defecto
  const path = location.hash || '#/login';
  // Obtiene la información del usuario autenticado
  const user = auth.getUser();

  // Protección de rutas: Redirige a login si el usuario no está autenticado y intenta acceder a una ruta de dashboard
  if (path.startsWith('#/dashboard') && !auth.isAuthenticated()) {
    location.hash = '#/login'; // Redirige a la página de login
    return; // Detiene la ejecución del router
  }

  // Protección de rutas: Evita que usuarios logueados accedan a las páginas de login o registro
  if ((path === '#/login' || path === '#/register') && auth.isAuthenticated()) {
    location.hash = '#/dashboard'; // Redirige al dashboard
    return; // Detiene la ejecución del router
  }

  // Manejo de rutas dinámicas: Ruta para editar un curso
  // Si la ruta comienza con '#/dashboard/courses/edit/', llama a showEditCourse
  if (path.startsWith('#/dashboard/courses/edit/')) {
    showEditCourse(); // Esta función se encargará de extraer el ID del curso de la URL
    return; // Detiene la ejecución del router
  }

  // Cargar la vista correspondiente:
  // Busca la función de vista en el objeto 'routes' usando el hash actual
  const view = routes[path];
  if (view) {
    // Si se encuentra una vista, la ejecuta
    view();
  } else {
    // Si la ruta no coincide con ninguna definida, muestra la página de "no encontrada"
    renderNotFound();
  }
}

// Nota: Los listeners para 'DOMContentLoaded' y 'hashchange' se inicializan en app.js
// window.addEventListener('hashchange', router);
// window.addEventListener('DOMContentLoaded', router);
