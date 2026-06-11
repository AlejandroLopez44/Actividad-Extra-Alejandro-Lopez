// Clave principal para guardar los productos en el navegador
const DB_KEY = 'ucab_products';

// Función para obtener los productos del localStorage
export function getProducts() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : null;
}

// Función para guardar o sobreescribir los productos
export function saveProducts(products) {
    localStorage.setItem(DB_KEY, JSON.stringify(products));
}