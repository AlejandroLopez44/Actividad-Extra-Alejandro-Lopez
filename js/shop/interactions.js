import { getCurrentSession, getUsers, saveUsers, setCurrentSession } from '../storage/database.js';
export function initInteractions() {
    setupDarkMode();
    setupProfileManagement();
}

// 1. LÓGICA DEL MODO DÍA / NOCHE (NATIVO DE BOOTSTRAP 5)
function setupDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const htmlElement = document.documentElement;
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        
        if (currentTheme === 'light') {
            htmlElement.setAttribute('data-bs-theme', 'dark');
            themeToggle.textContent = '☀️ Modo Día';
            themeToggle.className = 'btn btn-secondary btn-sm';
        } else {
            htmlElement.setAttribute('data-bs-theme', 'light');
            themeToggle.textContent = '🌙 Modo Noche';
            themeToggle.className = 'btn btn-secondary btn-sm';
        }
    });
}

// 2. LÓGICA DE GESTIÓN DE PERFIL (ACTUALIZAR DIRECCIÓN)
function setupProfileManagement() {
    const profileModalEl = document.getElementById('profileModal');
    const profileForm = document.getElementById('profile-form');

    if (!profileModalEl || !profileForm) return;

    // Cuando el modal se vaya a abrir, cargamos los datos frescos de la sesión
    profileModalEl.addEventListener('show.bs.modal', () => {
        const session = getCurrentSession();
        if (session) {
            document.getElementById('profile-mdl-avatar').src = session.avatar;
            document.getElementById('profile-mdl-name').textContent = session.name;
            document.getElementById('profile-mdl-email').textContent = session.email;
            document.getElementById('profile-mdl-address').value = session.address;
        }
    });

    // Cuando el usuario guarde los cambios del formulario
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newAddress = document.getElementById('profile-mdl-address').value.trim();
        const session = getCurrentSession();
        const users = getUsers();

        if (!session) return;

        // 1. Actualizar en la lista global de usuarios (localStorage)
        const updatedUsers = users.map(user => {
            if (user.email === session.email) {
                user.address = newAddress; // Cambiamos la dirección
            }
            return user;
        });
        saveUsers(updatedUsers);

        // 2. Actualizar la sesión activa (sessionStorage) con la función correcta
        session.address = newAddress;
        setCurrentSession(session);

        alert('✅ Perfil actualizado con éxito.');

        // 3. Cerrar el modal automáticamente con la API de Bootstrap
        const modalInstance = bootstrap.Modal.getInstance(profileModalEl);
        if (modalInstance) modalInstance.hide();
    });
}