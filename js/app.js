import { getProducts, getUsers, saveUsers, getCurrentSession } from './storage/database.js';
import { fetchInitialProducts } from './api/apiService.js';
import { checkAccessControl } from './router.js'; 
import { initCatalog } from './shop/catalog.js';
import { initCart } from './shop/cart.js';
import { initInteractions } from './shop/interactions.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 0. EJECUTAR EL GUARDIÁN DE SEGURIDAD ANTES QUE NADA
    checkAccessControl();
    
    console.log('Inicializando E-commerce UCAB (Módulo Cliente)...');
    
    // 1. Inicialización de Productos
    let products = getProducts();
    if (!products) {
        console.log('No hay productos locales. Consultando FakeStoreAPI...');
        products = await fetchInitialProducts();
    } else {
        console.log('Productos cargados desde el localStorage.');
    }

    // 2. Inicialización de Usuarios de Prueba
    let users = getUsers();
    if (users.length === 0) {
        console.log('Creando usuarios de prueba por defecto...');
        const defaultUsers = [
            {
                name: "Hermes UCAB",
                email: "hermes@ucab.ve",
                password: "admin123",
                role: "Administrador",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Hermes",
                address: "UCAB Sede Montalbán - Módulo 5"
            },
            {
                name: "Alejandro López",
                email: "ale@ucab.ve",
                password: "cliente123",
                role: "Cliente",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
                address: "Caracas, Venezuela"
            }
        ];
        saveUsers(defaultUsers);
        console.log('Cuentas de prueba listas.');
    }

    // 3. ACTUALIZAR EL AVATAR Y NOMBRE EN LA NAVBAR
    const session = getCurrentSession();
    const userNameDisplay = document.getElementById('user-name-display');
    const userAvatar = document.getElementById('user-avatar');

    if (session && userNameDisplay && userAvatar) {
        // Mostramos solo el primer nombre
        userNameDisplay.textContent = session.name.split(' ')[0];
        userAvatar.src = session.avatar;
    }

    // 4. INICIAR MÓDULOS SOLO DE CLIENTE
    initCatalog();
    initCart();
    initInteractions();
});