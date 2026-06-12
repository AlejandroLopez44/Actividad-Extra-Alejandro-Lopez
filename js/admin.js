import { checkAccessControl } from './router.js';
import { initDashboard } from './admin/dashboard.js';
import { initCRUD } from './admin/crud.js';
import { initInteractions } from './shop/interactions.js'; // <-- Reutilizamos el módulo

document.addEventListener('DOMContentLoaded', () => {
    // Proteger la ruta
    checkAccessControl();
    
    // Iniciar los módulos del panel
    initDashboard();
    initCRUD();
    initInteractions(); // <-- Enciende el Modo Noche y el Modal de Perfil
});