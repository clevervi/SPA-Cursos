// === PLANTILLA SPA CURSOS ===
// Instrucciones: Implementa aquí la lógica de autenticación.
// Puedes usar localStorage para guardar el usuario logueado.
// Usa la API (api.js) para consultar y registrar usuarios.

import { api } from './api.js'; // Importa el módulo de la API para interactuar con el backend

// Función para hashear la contraseña usando SHA-256
async function hashPassword(password) {
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashedPassword;
}

export const auth = {
  /**
   * Intenta iniciar sesión con las credenciales proporcionadas.
   * @param {string} email - El email del usuario.
   * @param {string} pass - La contraseña del usuario.
   * @throws {Error} Si las credenciales son inválidas o hay un error en la API.
   */
  login: async (email, pass) => {
    try {
      // Consulta la API para buscar un usuario por su email
      const users = await api.get(`/users?email=${email}`);
      // Verifica si se encontró un usuario
      if (users.length === 0) {
        throw new Error('Credenciales inválidas');
      }
      const user = users[0]; // Obtiene el primer usuario encontrado (debería ser único por email)

      // Hashea la contraseña ingresada para compararla con la almacenada
      const hashedPasswordInput = await hashPassword(pass); //

      // Verifica si la contraseña hasheada coincide
      if (user.password !== hashedPasswordInput) { //
        // Si la contraseña es incorrecta, lanza un error
        throw new Error('Credenciales inválidas');
      }

      // Guarda el objeto del usuario en localStorage como una cadena JSON
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      // Registra el error y lo relanza para que sea manejado por la vista
      console.error('Error en el login:', error);
      throw error;
    }
  },

  /**
   * Intenta registrar un nuevo usuario.
   * @param {string} name - El nombre del nuevo usuario.
   * @param {string} email - El email del nuevo usuario.
   * @param {string} pass - La contraseña del nuevo usuario.
   * @throws {Error} Si el email ya está registrado o hay un error en la API.
   */
  register: async (name, email, pass) => {
    try {
      // Consulta la API para verificar si el email ya existe
      const existingUser = await api.get(`/users?email=${email}`);
      if (existingUser.length > 0) {
        // Si el email ya está en uso, lanza un error
        throw new Error('El email ya está registrado');
      }

      // Hashea la contraseña antes de guardarla
      const hashedPassword = await hashPassword(pass); //

      // Crea un nuevo objeto de usuario con un rol por defecto de 'student'
      const newUser = { name, email, password: hashedPassword, role: 'student' }; //
      // Envía los datos del nuevo usuario a la API para registrarlo
      await api.post('/users', newUser);
      // Después de registrar, inicia sesión automáticamente al nuevo usuario
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      // Registra el error y lo relanza para que sea manejado por la vista
      console.error('Error en el registro:', error);
      throw error;
    }
  },

  /**
   * Cierra la sesión del usuario actual.
   * Elimina el usuario de localStorage y redirige a la página de login.
   */
  logout: () => {
    // Elimina el elemento 'user' de localStorage
    localStorage.removeItem('user');
    // Redirige al usuario a la página de login
    location.hash = '#/login';
    // Recarga el enrutador para asegurar que la vista de login se muestre correctamente
    // Importante: router debe ser importado si se usa aquí directamente, o se llama desde app.js
    // En este caso, el router se encarga de la redirección al detectar el cambio de hash.
  },

  /**
   * Verifica si hay un usuario autenticado.
   * @returns {boolean} True si hay un usuario guardado en localStorage, false en caso contrario.
   */
  isAuthenticated: () => {
    // Devuelve true si el elemento 'user' existe en localStorage (lo que indica que hay un usuario logueado)
    return !!localStorage.getItem('user');
  },

  /**
   * Devuelve el objeto del usuario autenticado.
   * @returns {object|null} El objeto del usuario parseado de localStorage, o null si no hay usuario.
   */
  getUser: () => {
    // Obtiene la cadena JSON del usuario de localStorage
    const user = localStorage.getItem('user');
    // Si existe, lo parsea de JSON a un objeto JavaScript, de lo contrario, devuelve null
    return user ? JSON.parse(user) : null;
  }
};