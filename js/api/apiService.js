import { saveProducts } from '../storage/database.js';

export async function fetchInitialProducts() {
    try {
        // Consumimos la API externa
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Error al conectar con la API');
        
        const products = await response.json();
        
        /* Formateamos los productos para añadirles un 'stock' simulado
        ya que la FakeStore API no trae cantidades de inventario.*/
        const normalizedProducts = products.map(product => ({
            ...product,
            stock: 20, // Inventario inicial para el carrito
            active: true
        }));

        // Los guardamos en nuestra base de datos local
        saveProducts(normalizedProducts);
        console.log('Productos descargados y guardados en localStorage exitosamente.');
        
        return normalizedProducts;
    } catch (error) {
        console.error('Fallo al inicializar los productos:', error);
        return null;
    }
}