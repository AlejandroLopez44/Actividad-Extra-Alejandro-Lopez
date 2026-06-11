import { getCurrentSession } from './storage/database.js';

export function checkAccessControl() {
    const session = getCurrentSession();
    const currentPath = window.location.pathname;

    // Identificamos en qué página se encuentra el navegador actualmente
    const isLoginPage = currentPath.includes('login.html');
    const isAdminPage = currentPath.includes('admin.html');
    const isClientPage = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/');

    // CASO 1: El usuario NO ha iniciado sesión
    if (!session) {
        // Si no está en el login, lo obligamos a ir allí
        if (!isLoginPage) {
            alert('Acceso denegado. Por favor, inicia sesión primero.');
            window.location.href = 'login.html';
        }
        return; // Detiene la ejecución
    }

    // CASO 2: El usuario SÍ tiene sesión activa
    if (session) {
        // Si intenta entrar al login estando ya autenticado, lo redirigimos según su rol
        if (isLoginPage) {
            redirectByUserRole(session.role);
            return;
        }

        // REGLA ESTRICTA: Un Cliente NO puede entrar a las páginas de Administración
        if (isAdminPage && session.role !== 'Administrador') {
            alert('🚫 Error: No tienes permisos de Administrador para acceder a este módulo.');
            window.location.href = 'index.html';
            return;
        }

        // REGLA ESTRICTA: Un Administrador NO debe navegar en el catálogo de clientes
        if (isClientPage && session.role !== 'Cliente') {
            alert('🔄 Redirigiendo al Panel de Control de Administrador.');
            window.location.href = 'admin.html';
            return;
        }
    }
}

// Función auxiliar para mover al usuario a su entorno correspondiente
function redirectByUserRole(role) {
    if (role === 'Administrador') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
}