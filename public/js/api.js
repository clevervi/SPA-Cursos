// === PLANTILLA SPA CURSOS ===
// Instrucciones: Implementa aquí las funciones para comunicarte con la API REST.
// Puedes usar fetch para hacer peticiones HTTP (GET, POST, PUT, DELETE).
// Cambia la URL base si tu API está en otro puerto o ruta.

export const api = {
  base: 'http://localhost:3000', // URL base de tu API REST. Asegúrate de que JSON Server esté corriendo en este puerto.

  /**
   * Realiza una petición GET a la API.
   * @param {string} param - La ruta o endpoint de la API (ej: '/users', '/courses/1').
   * @returns {Promise<any>} Los datos obtenidos de la API.
   * @throws {Error} Si la respuesta de la red no es exitosa.
   */
  get: async param => {
    try {
      const response = await fetch(`${api.base}${param}`);
      // Verifica si la respuesta de la red fue exitosa (código de estado 200-299)
      if (!response.ok) {
        // Lanza un error si la respuesta no es exitosa
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      // Parsea la respuesta como JSON y la devuelve
      return await response.json();
    } catch (error) {
      // Captura y registra cualquier error durante la petición GET
      console.error('Error en la petición GET:', error);
      // Relanza el error para que pueda ser manejado por el código que llama
      throw error;
    }
  },

  /**
   * Realiza una petición POST a la API para crear un nuevo recurso.
   * @param {string} param - La ruta o endpoint de la API (ej: '/users', '/courses').
   * @param {object} data - Los datos a enviar en el cuerpo de la petición.
   * @returns {Promise<any>} Los datos del recurso creado.
   * @throws {Error} Si la respuesta de la red no es exitosa.
   */
  post: async (param, data) => {
    try {
      const response = await fetch(`${api.base}${param}`, {
        method: 'POST', // Método HTTP POST
        headers: {
          'Content-Type': 'application/json' // Indica que el cuerpo de la petición es JSON
        },
        body: JSON.stringify(data) // Convierte el objeto de datos a una cadena JSON
      });
      // Verifica si la respuesta de la red fue exitosa
      if (!response.ok) {
        throw new Error(`Error al crear los datos: ${response.statusText}`);
      }
      // Parsea la respuesta como JSON y la devuelve
      return await response.json();
    } catch (error) {
      // Captura y registra cualquier error durante la petición POST
      console.error('Error en la petición POST:', error);
      throw error;
    }
  },

  /**
   * Realiza una petición PUT a la API para actualizar un recurso existente.
   * @param {string} param - La ruta o endpoint de la API con el ID del recurso (ej: '/courses/1').
   * @param {object} data - Los datos actualizados a enviar en el cuerpo de la petición.
   * @returns {Promise<any>} Los datos del recurso actualizado.
   * @throws {Error} Si la respuesta de la red no es exitosa.
   */
  put: async (param, data) => {
    try {
      const response = await fetch(`${api.base}${param}`, {
        method: 'PUT', // Método HTTP PUT
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      // Verifica si la respuesta de la red fue exitosa
      if (!response.ok) {
        throw new Error(`Error al actualizar los datos: ${response.statusText}`);
      }
      // Parsea la respuesta como JSON y la devuelve
      return await response.json();
    } catch (error) {
      // Captura y registra cualquier error durante la petición PUT
      console.error('Error en la petición PUT:', error);
      throw error;
    }
  },

  /**
   * Realiza una petición DELETE a la API para eliminar un recurso.
   * @param {string} param - La ruta o endpoint de la API con el ID del recurso (ej: '/courses/1').
   * @returns {Promise<any>} La respuesta de la API (generalmente un objeto vacío o un mensaje de éxito).
   * @throws {Error} Si la respuesta de la red no es exitosa.
   */
  del: async param => {
    try {
      const response = await fetch(`${api.base}${param}`, {
        method: 'DELETE' // Método HTTP DELETE
      });
      // Verifica si la respuesta de la red fue exitosa
      if (!response.ok) {
        throw new Error(`Error al eliminar los datos: ${response.statusText}`);
      }
      // Parsea la respuesta como JSON y la devuelve
      return await response.json();
    } catch (error) {
      // Captura y registra cualquier error durante la petición DELETE
      console.error('Error en la petición DELETE:', error);
      throw error;
    }
  }
};
