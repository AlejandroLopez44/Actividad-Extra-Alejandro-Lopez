import { getUsers, saveUsers, setCurrentSession } from '../storage/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS DE LAS TARJETAS (DOM) ---
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');
    const forgotCard = document.getElementById('forgot-card');

    // --- ENLACES DE NAVEGACIÓN ---
    const goToRegister = document.getElementById('go-to-register');
    const goToForgot = document.getElementById('go-to-forgot');
    const backToLoginFromReg = document.getElementById('back-to-login-from-reg');
    const backToLoginFromForgot = document.getElementById('back-to-login-from-forgot');

    // --- REFERENCIAS DE FORMULARIOS ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotForm = document.getElementById('forgot-form');

    // --- LOGICA DE RECUPERACIÓN DE CONTRASEÑA ---
    const newPasswordGroup = document.getElementById('new-password-group');
    const forgotSubmitBtn = document.getElementById('forgot-submit-btn');
    let emailToRecover = ''; 


    // 1. INTERCAMBIO DE VISTAS (Efecto Visual)
    goToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.classList.add('d-none');
        registerCard.classList.remove('d-none');
    });

    backToLoginFromReg.addEventListener('click', (e) => {
        e.preventDefault();
        registerCard.classList.add('d-none');
        loginCard.classList.remove('d-none');
    });

    goToForgot.addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.classList.add('d-none');
        forgotCard.classList.remove('d-none');
    });

    backToLoginFromForgot.addEventListener('click', (e) => {
        e.preventDefault();
        resetForgotForm();
        forgotCard.classList.add('d-none');
        loginCard.classList.remove('d-none');
    });

    // 2. LÓGICA DE REGISTRO DE USUARIOS
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const password = document.getElementById('reg-password').value;
        const role = document.getElementById('reg-role').value;

        const users = getUsers();

        // Validación: Evitar correos duplicados
        const userExists = users.some(u => u.email === email);
        if (userExists) {
            alert('Este correo electrónico ya está registrado.');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // Crear nuevo usuario con avatar vectorial dinámico por defecto
        const newUser = {
            name,
            email,
            password,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
            address: "" // Se editará luego en el perfil
        };

        users.push(newUser);
        saveUsers(users);

        alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        registerForm.reset();
        
        // Redirigir visualmente al login
        registerCard.classList.add('d-none');
        loginCard.classList.remove('d-none');
    });

    
    // 3. LÓGICA DE INICIO DE SESIÓN (LOGIN)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;

        const users = getUsers();

        // Buscar si existe el usuario con esas credenciales
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            alert('Correo o contraseña incorrectos. Inténtalo de nuevo.');
            return;
        }

        // Guardar sesión activa simulada
        setCurrentSession(user);

        // Redirección inteligente basada en Roles de Usuario
        if (user.role === "Administrador") {
            alert(`¡Bienvenido Administrador: ${user.name}!`);
            window.location.href = 'admin.html'; // Panel de control del Admin
        } else {
            alert(`¡Hola de nuevo, ${user.name}!`);
            window.location.href = 'index.html'; // Tienda / Catálogo del cliente
        }
    });

    // 4. RECUPERACIÓN DE CONTRASEÑA
    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const users = getUsers();

        // Paso A: Verificar si el correo existe
        if (!newPasswordGroup.classList.contains('d-none')) {
            // Paso B: Si el campo de nueva contraseña ya es visible, procesamos el cambio
            const newPassword = document.getElementById('forgot-new-password').value;
            
            if (newPassword.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                return;
            }

            const updatedUsers = users.map(u => {
                if (u.email === emailToRecover) {
                    return { ...u, password: newPassword };
                }
                return u;
            });

            saveUsers(updatedUsers);
            alert('Contraseña restablecida con éxito. Ya puedes iniciar sesión.');
            
            resetForgotForm();
            forgotCard.classList.add('d-none');
            loginCard.classList.remove('d-none');
        } else {
            // Flujo Inicial: Buscar el correo electrónico
            const emailInput = document.getElementById('forgot-email').value.trim().toLowerCase();
            const user = users.find(u => u.email === emailInput);

            if (!user) {
                alert('No se encontró ninguna cuenta asociada a este correo electrónico.');
                return;
            }

            // Si existe, activamos la segunda fase en la tarjeta
            emailToRecover = emailInput;
            document.getElementById('forgot-email').setAttribute('disabled', 'true');
            newPasswordGroup.classList.remove('d-none');
            document.getElementById('forgot-new-password').setAttribute('required', 'true');
            forgotSubmitBtn.textContent = "Actualizar Contraseña";
            forgotSubmitBtn.className = "btn btn-success w-100 py-2 mb-3";
        }
    });

    function resetForgotForm() {
        forgotForm.reset();
        document.getElementById('forgot-email').removeAttribute('disabled');
        newPasswordGroup.classList.add('d-none');
        document.getElementById('forgot-new-password').removeAttribute('required');
        forgotSubmitBtn.textContent = "Verificar Correo";
        forgotSubmitBtn.className = "btn btn-warning w-100 py-2 mb-3 text-white";
        emailToRecover = '';
    }

    // 5. MODO NOCHE (Opcional en la pantalla de Login)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const htmlElement = document.documentElement;
            if (htmlElement.getAttribute('data-bs-theme') === 'light') {
                htmlElement.setAttribute('data-bs-theme', 'dark');
                themeToggle.textContent = '☀️ Modo Día';
            } else {
                htmlElement.setAttribute('data-bs-theme', 'light');
                themeToggle.textContent = '🌙 Modo Noche';
            }
        });
    }
});