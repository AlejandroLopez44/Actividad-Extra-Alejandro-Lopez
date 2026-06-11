import { getProducts, getUsers, saveUsers } from './storage/database.js';
import { fetchInitialProducts } from './api/apiService.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Inicializando E-commerce UCAB...');
    
    // 1. Inicialización de Productos
    let products = getProducts();
    if (!products) {
        console.log('No hay productos locales. Consultando FakeStoreAPI...');
        products = await fetchInitialProducts();
    } else {
        console.log('Productos cargados desde el localStorage.');
    }

    // 2. Inicialización de Usuarios de Prueba (Seeders)
    let users = getUsers();
    if (users.length === 0) {
        console.log('Creando usuarios de prueba por defecto...');
        const defaultUsers = [
            {
                name: "Hermes UCAB",
                email: "hermes@ucab.ve",
                password: "admin123",
                role: "Administrador",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
                address: "Sede Montalbán - Módulo 4"
            },
            {
                name: "Alejandro López",
                email: "ale@ucab.ve",
                password: "cliente123",
                role: "Cliente",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Admin",
                address: "Caracas, Venezuela"
            }
        ];
        saveUsers(defaultUsers);
        console.log('Cuentas de prueba listas: hermes@ucab.ve (admin123) y ale@ucab.ve (cliente123)');
    }
});