// === PLANTILLA SPA CURSOS ===
// Instrucciones: Este es el punto de entrada de la SPA.
// Aquí debes inicializar el enrutador y cualquier lógica global.

// Importa el módulo del enrutador
import { router } from './router.js';

// Inicializa el enrutador cuando el DOM ha sido completamente cargado.
// Esto asegura que todos los elementos HTML estén disponibles antes de que el enrutador intente interactuar con ellos.
window.addEventListener('DOMContentLoaded', router);

// Escucha los cambios en el hash de la URL.
// Cada vez que el hash cambia (ej. de #/login a #/dashboard), el enrutador se ejecuta de nuevo
// para mostrar la vista correspondiente a la nueva URL.
window.addEventListener('hashchange', router);

// Puedes agregar aquí lógica global si lo necesitas, por ejemplo,
// la inicialización de servicios de terceros, o manejo de eventos a nivel global.
