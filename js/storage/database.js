// Clave principal para guardar los productos en el navegador
const DB_KEY = 'ucab_products';

// Claves adicionales para el almacenamiento
const USERS_KEY = 'ucab_users';
const SESSION_KEY = 'ucab_current_session';

// Función para obtener los productos del localStorage
export function getProducts() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : null;
}

// Función para guardar o sobreescribir los productos
export function saveProducts(products) {
    localStorage.setItem(DB_KEY, JSON.stringify(products));
}

// --- GESTIÓN DE USUARIOS REGISTRADOS ---
export function getUsers() {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// --- GESTIÓN DE LA SESIÓN ACTIVA (Simulada con sessionStorage) ---
export function getCurrentSession() {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
}

export function setCurrentSession(user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}