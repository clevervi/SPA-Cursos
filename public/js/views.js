// === PLANTILLA SPA CURSOS ===
// Instrucciones: Implementa aquí las funciones de renderizado de vistas.
// Usa el DOM para mostrar formularios, listas y mensajes según la ruta activa.
// Puedes usar fetch o el módulo api.js para obtener datos.
// Usa el módulo auth.js para autenticación.

import { api } from './api.js';     // Importa el módulo de la API para interactuar con el backend
import { auth } from './auth.js';   // Importa el módulo de autenticación para gestionar el estado del usuario
import { router } from './router.js'; // Importa el enrutador para redirigir después de ciertas acciones

// Obtiene el elemento principal de la aplicación donde se renderizarán las vistas
const appContainer = document.getElementById('app');

/**
 * Función auxiliar para manejar la navegación a través de enlaces internos.
 * Evita la recarga completa de la página.
 */
function navigateTo(hash) { //
  location.hash = hash; //
  router(); //
}

/**
 * Muestra un mensaje de página no encontrada.
 */
export function renderNotFound() {
  appContainer.innerHTML = `
    <div class="container card">
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <button id="dashboard-btn-notfound">Ir al Dashboard</button>
    </div>
  `;
  document.getElementById('dashboard-btn-notfound').onclick = () => navigateTo('#/dashboard'); //
}

/**
 * Muestra la vista de login.
 * Permite al usuario iniciar sesión con sus credenciales.
 */
export async function showLogin() {
  appContainer.innerHTML = `
    <div class="login-container">
      <form id="login-form" class="login-form card">
        <h2 style="text-align:center; margin-bottom:1em;">Iniciar Sesión</h2>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Contraseña" required>
        <button type="submit">Entrar</button>
        <p style="text-align:center; margin-top:1em;">
          ¿No tienes cuenta? <a href="#/register" id="register-link-login">Regístrate aquí</a>
        </p>
      </form>
      <div id="message-box" class="alert" style="display:none;"></div>
    </div>
  `;

  const loginForm = document.getElementById('login-form');
  const messageBox = document.getElementById('message-box');
  const registerLink = document.getElementById('register-link-login'); //

  loginForm.onsubmit = async e => {
    e.preventDefault(); // Evita el envío por defecto del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await auth.login(email, password); // Intenta iniciar sesión
      navigateTo('#/dashboard'); // Redirige al dashboard en caso de éxito //
    } catch (err) {
      // Muestra un mensaje de error si el login falla
      messageBox.textContent = err.message;
      messageBox.style.display = 'block';
      setTimeout(() => { messageBox.style.display = 'none'; }, 3000); // Oculta el mensaje después de 3 segundos
    }
  };

  registerLink.onclick = (e) => { //
    e.preventDefault(); //
    navigateTo('#/register'); //
  };
}

/**
 * Muestra la vista de registro de nuevo usuario.
 * Permite a los usuarios crear una nueva cuenta.
 */
export async function showRegister() {
  appContainer.innerHTML = `
    <div class="login-container">
      <form id="register-form" class="login-form card">
        <h2 style="text-align:center; margin-bottom:1em;">Registro de Usuario</h2>
        <input type="text" id="name" placeholder="Nombre" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Contraseña" required>
        <button type="submit">Registrar</button>
        <p style="text-align:center; margin-top:1em;">
          ¿Ya tienes cuenta? <a href="#/login" id="login-link-register">Inicia sesión aquí</a>
        </p>
      </form>
      <div id="message-box" class="alert" style="display:none;"></div>
    </div>
  `;

  const registerForm = document.getElementById('register-form');
  const messageBox = document.getElementById('message-box');
  const loginLink = document.getElementById('login-link-register'); //

  registerForm.onsubmit = async e => {
    e.preventDefault(); // Evita el envío por defecto del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      await auth.register(name, email, password); // Intenta registrar al usuario
      navigateTo('#/dashboard'); // Redirige al dashboard en caso de éxito //
    } catch (err) {
      // Muestra un mensaje de error si el registro falla
      messageBox.textContent = err.message;
      messageBox.style.display = 'block';
      setTimeout(() => { messageBox.style.display = 'none'; }, 3000);
    }
  };

  loginLink.onclick = (e) => { //
    e.preventDefault(); //
    navigateTo('#/login'); //
  };
}

/**
 * Muestra la vista principal del dashboard.
 * Incluye un saludo al usuario y enlaces de navegación.
 */
export async function showDashboard() {
  const user = auth.getUser(); // Obtiene el usuario autenticado
  if (!user) {
    navigateTo('#/login'); // Si no hay usuario, redirige a login //
    return;
  }

  appContainer.innerHTML = `
    <div class="container">
      <h2>Bienvenido, ${user.name} (${user.role === 'admin' ? 'Administrador' : 'Estudiante'})</h2>
      <button id="logout-btn">Cerrar Sesión</button>
      <nav>
        <button id="view-courses-btn">Ver Cursos</button>
        ${user.role === 'admin' ? `<button id="create-course-btn">Crear Curso</button>` : ''}
      </nav>
    </div>
  `;

  // Asigna el evento de clic al botón de cerrar sesión
  document.getElementById('logout-btn').onclick = () => {
    auth.logout(); // Llama a la función de logout
    router(); // Recarga el enrutador para reflejar el cambio de estado de autenticación
  };

  // Asigna eventos de clic a los nuevos botones de navegación
  document.getElementById('view-courses-btn').onclick = () => navigateTo('#/dashboard/courses'); //
  if (user.role === 'admin') {
    document.getElementById('create-course-btn').onclick = () => navigateTo('#/dashboard/courses/create'); //
  }
}

/**
 * Muestra la vista de listado de cursos.
 * Permite a los usuarios ver los cursos disponibles y, si son estudiantes, inscribirse.
 * Los administradores pueden editar los cursos.
 */
export async function showCourses() {
  const user = auth.getUser(); // Obtiene el usuario actual
  if (!user) {
    navigateTo('#/login'); //
    return;
  }

  const courses = await api.get('/courses'); // Obtiene la lista de cursos de la API

  appContainer.innerHTML = `
    <div class="container">
      <h2>Cursos Disponibles</h2>
      <button id="back-to-dashboard-btn" style="margin-bottom: 1em;">Volver al Dashboard</button>
      ${courses.length === 0 ? '<p>No hay cursos disponibles en este momento.</p>' : ''}
      <ul class="course-list">
        ${courses.map(c => `
          <li>
            <span>
              <strong>${c.title || 'Sin título'}</strong>
              <br>Instructor: ${c.instructor || 'N/A'}
              <br>Capacidad: ${c.capacity !== undefined ? c.capacity : 'N/A'}
              <br>Inscritos: ${c.enrolled ? c.enrolled.length : 0}
            </span>
            <div>
              ${user.role === 'admin' ? `<button data-course-id="${c.id}" class="edit-course-btn">Editar</button>` : ''}
              ${user.role === 'student' ? `<button class="enroll-btn" data-id="${c.id}">Inscribirse</button>` : ''}
            </div>
          </li>
        `).join('')}
      </ul>
      <div id="message-box" class="alert" style="display:none;"></div>
    </div>
  `;

  document.getElementById('back-to-dashboard-btn').onclick = () => navigateTo('#/dashboard'); //

  // Lógica para la edición de cursos (para administradores)
  if (user.role === 'admin') {
    document.querySelectorAll('.edit-course-btn').forEach(btn => {
      btn.onclick = () => {
        const courseId = btn.dataset.courseId;
        navigateTo(`#/dashboard/courses/edit/${courseId}`); //
      };
    });
  }

  const messageBox = document.getElementById('message-box');

  // Lógica para la inscripción de estudiantes
  if (user.role === 'student') {
    document.querySelectorAll('.enroll-btn').forEach(btn => {
      btn.onclick = async () => {
        const courseId = btn.dataset.id; // Obtiene el ID del curso del atributo data-id

        try {
          const course = await api.get('/courses/' + courseId); // Obtener el curso actual

          // Inicializa la lista de inscritos si no existe
          if (!course.enrolled) {
            course.enrolled = [];
          }

          // Evitar doble inscripción
          if (course.enrolled.includes(user.email)) {
            messageBox.textContent = 'Ya estás inscrito en este curso.';
            messageBox.style.display = 'block';
            messageBox.className = 'alert'; // Asegura que sea un mensaje de alerta
            setTimeout(() => { messageBox.style.display = 'none'; }, 3000);
            return;
          }

          // Verificar capacidad
          if (course.enrolled.length >= course.capacity) {
            messageBox.textContent = 'Este curso ya está lleno.';
            messageBox.style.display = 'block';
            messageBox.className = 'alert';
            setTimeout(() => { messageBox.style.display = 'none'; }, 3000);
            return;
          }

          // Añade el email del usuario a la lista de inscritos
          course.enrolled.push(user.email);
          // Opcional: decrementar la capacidad disponible si se maneja así
          // course.capacity--;

          await api.put('/courses/' + courseId, course); // Actualiza el curso en la API
          messageBox.textContent = 'Inscripción exitosa!';
          messageBox.style.display = 'block';
          messageBox.className = 'success'; // Mensaje de éxito
          setTimeout(() => { messageBox.style.display = 'none'; }, 3000);
          showCourses(); // Recarga la lista de cursos para reflejar los cambios
        } catch (error) {
          console.error('Error al inscribirse en el curso:', error);
          messageBox.textContent = 'Hubo un error al inscribirte en el curso.';
          messageBox.style.display = 'block';
          messageBox.className = 'alert';
          setTimeout(() => { messageBox.style.display = 'none'; }, 3000);
        }
      };
    });
  }
}

/**
 * Muestra la vista para crear un nuevo curso (solo accesible para administradores).
 */
export function showCreateCourse() {
  const user = auth.getUser();
  if (!user || user.role !== 'admin') {
    renderNotFound(); // Si no es admin, muestra página no encontrada
    return;
  }

  appContainer.innerHTML = `
    <div class="container card">
      <h2>Crear Nuevo Curso</h2>
      <form id="create-course-form">
        <label for="title">Título:</label>
        <input type="text" id="title" placeholder="Título del curso" required>

        <label for="instructor">Instructor:</label>
        <input type="text" id="instructor" placeholder="Nombre del instructor" required>

        <label for="capacity">Capacidad:</label>
        <input type="number" id="capacity" placeholder="Número máximo de estudiantes" min="1" required>

        <button type="submit">Guardar Curso</button>
        <button type="button" id="back-to-courses-btn" style="background-color: #555; margin-top: 1em;">Cancelar</button>
      </form>
      <div id="message-box" class="alert" style="display:none;"></div>
    </div>
  `;

  const createCourseForm = document.getElementById('create-course-form');
  const messageBox = document.getElementById('message-box');
  const backToCoursesBtn = document.getElementById('back-to-courses-btn'); //

  createCourseForm.onsubmit = async e => {
    e.preventDefault();
    const data = {
      title: document.getElementById('title').value,
      instructor: document.getElementById('instructor').value,
      capacity: parseInt(document.getElementById('capacity').value),
      enrolled: [] // Inicializa la lista de inscritos vacía
    };

    try {
      await api.post('/courses', data); // Envía los datos del nuevo curso a la API
      messageBox.textContent = 'Curso creado exitosamente!';
      messageBox.style.display = 'block';
      messageBox.className = 'success';
      setTimeout(() => {
        messageBox.style.display = 'none';
        navigateTo('#/dashboard/courses'); // Redirige a la lista de cursos //
      }, 1500); // Espera un poco para que el usuario vea el mensaje
    } catch (err) {
      console.error('Error al crear el curso:', err);
      messageBox.textContent = 'Hubo un error al crear el curso.';
      messageBox.style.display = 'block';
      messageBox.className = 'alert';
      setTimeout(() => { messageBox.style.display = 'none'; }, 3000);
    }
  };

  backToCoursesBtn.onclick = () => navigateTo('#/dashboard/courses'); //
}

/**
 * Muestra la vista para editar un curso existente (solo accesible para administradores).
 * El ID del curso se obtiene del hash de la URL.
 */
export async function showEditCourse() {
  const user = auth.getUser();
  if (!user || user.role !== 'admin') {
    renderNotFound(); // Si no es admin, muestra página no encontrada
    return;
  }

  // Extrae el ID del curso del hash de la URL (ej: '#/dashboard/courses/edit/123' -> '123')
  const courseId = location.hash.split('/').pop();
  const course = await api.get('/courses/' + courseId); // Obtiene los datos del curso de la API

  if (!course) {
    renderNotFound(); // Si el curso no existe, muestra página no encontrada
    return;
  }

  appContainer.innerHTML = `
    <div class="container card">
      <h2>Editar Curso: ${course.title}</h2>
      <form id="edit-course-form">
        <label for="title">Título:</label>
        <input type="text" id="title" value="${course.title || ''}" required>

        <label for="instructor">Instructor:</label>
        <input type="text" id="instructor" value="${course.instructor || ''}" required>

        <label for="capacity">Capacidad:</label>
        <input type="number" id="capacity" value="${course.capacity !== undefined ? course.capacity : ''}" min="1" required>

        <button type="submit">Actualizar Curso</button>
        <button type="button" id="delete-course-btn" class="alert-button" style="background-color: #e74c3c; margin-top: 1em;">Eliminar Curso</button>
        <button type="button" id="cancel-edit-btn" style="background-color: #555; margin-top: 1em;">Cancelar</button>
      </form>
      <div id="message-box" class="alert" style="display:none;"></div>
    </div>
  `;

  const editCourseForm = document.getElementById('edit-course-form');
  const deleteCourseBtn = document.getElementById('delete-course-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn'); //
  const messageBox = document.getElementById('message-box');

  editCourseForm.onsubmit = async e => {
    e.preventDefault();
    const updatedData = {
      title: document.getElementById('title').value,
      instructor: document.getElementById('instructor').value,
      capacity: parseInt(document.getElementById('capacity').value),
      enrolled: course.enrolled || [] // Mantiene la lista de inscritos existente
    };

    try {
      await api.put('/courses/' + courseId, updatedData); // Actualiza el curso en la API
      messageBox.textContent = 'Curso actualizado exitosamente!';
      messageBox.style.display = 'block';
      messageBox.className = 'success';
      setTimeout(() => {
        messageBox.style.display = 'none';
        navigateTo('#/dashboard/courses'); // Redirige a la lista de cursos //
      }, 1500);
    } catch (err) {
      console.error('Error al actualizar el curso:', err);
      messageBox.textContent = 'Hubo un error al actualizar el curso.';
      messageBox.style.display = 'block';
      messageBox.className = 'alert';
      setTimeout(() => { messageBox.style.display = 'none'; }, 3000);
    }
  };

  deleteCourseBtn.onclick = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      try {
        await api.del('/courses/' + courseId); // Elimina el curso de la API
        messageBox.textContent = 'Curso eliminado exitosamente!';
        messageBox.style.display = 'block';
        messageBox.className = 'success';
        setTimeout(() => {
          messageBox.style.display = 'none';
          navigateTo('#/dashboard/courses'); // Redirige a la lista de cursos //
        }, 1500);
      } catch (err) {
        console.error('Error al eliminar el curso:', err);
        messageBox.textContent = 'Hubo un error al eliminar el curso.';
        messageBox.style.display = 'block';
        messageBox.className = 'alert';
        setTimeout(() => { messageBox.style.display = 'none'; }, 3000);
      }
    }
  };

  cancelEditBtn.onclick = () => navigateTo('#/dashboard/courses'); //
}