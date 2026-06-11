import { getProducts } from './storage/database.js';
import { fetchInitialProducts } from './api/apiService.js';

// Escuchamos el evento de carga del documento HTML
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Inicializando E-commerce UCAB...');
    
    // 1. Verificamos si ya existen productos en la base de datos local
    let products = getProducts();
    
    // 2. Si no hay productos (es la primera vez que entramos), los descargamos
    if (!products) {
        console.log('No hay productos locales. Consultando FakeStoreAPI...');
        products = await fetchInitialProducts();
    } else {
        console.log('Productos cargados directamente desde el localStorage.');
    }
});