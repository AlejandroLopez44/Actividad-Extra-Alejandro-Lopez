import { getProducts, getCart, saveCart, clearCart, getCurrentSession } from '../storage/database.js';

export function initCart() {
    updateCartBadge();
    renderCart();

    // 1. Escuchar clics en los botones "Agregar" del catálogo
    const catalogContainer = document.getElementById('catalog-container');
    if (catalogContainer) {
        catalogContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(e.target.getAttribute('data-id'));
                addToCart(productId);
            }
        });
    }

    // 2. Escuchar clics dentro del modal del carrito (+, -, 🗑️)
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            
            if (e.target.classList.contains('increase-qty')) {
                updateQuantity(id, 1);
            } else if (e.target.classList.contains('decrease-qty')) {
                updateQuantity(id, -1);
            } else if (e.target.classList.contains('remove-item')) {
                removeFromCart(id);
            }
        });
    }

    // 3. Iniciar la lógica del Checkout
    setupCheckout();
}

// --- FUNCIONES CORE DEL CARRITO ---

function addToCart(productId) {
    const products = getProducts();
    const cart = getCart();

    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productToAdd.id,
            title: productToAdd.title,
            price: productToAdd.price,
            image: productToAdd.image,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartBadge();
    renderCart();
    alert(`✅ ¡Agregaste: ${productToAdd.title} al carrito!`);
}

function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        saveCart(cart);
        updateCartBadge();
        renderCart();
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    updateCartBadge();
    renderCart();
}

// --- FUNCIONES CORE DE CHECKOUT ---

function setupCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');

    // Transición del Carrito al Formulario de Pago
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) return;

            // 1. Cerrar modal del carrito mediante la API de Bootstrap
            const cartModalEl = document.getElementById('cartModal');
            const cartModal = bootstrap.Modal.getInstance(cartModalEl);
            if (cartModal) cartModal.hide();

            // 2. Autocompletar datos del usuario activo
            const session = getCurrentSession();
            if (session) {
                document.getElementById('checkout-name').value = session.name;
                document.getElementById('checkout-address').value = session.address;
            }

            // 3. Abrir modal de checkout
            const checkoutModalEl = document.getElementById('checkoutModal');
            let checkoutModal = bootstrap.Modal.getInstance(checkoutModalEl);
            if (!checkoutModal) checkoutModal = new bootstrap.Modal(checkoutModalEl);
            checkoutModal.show();
        });
    }

    // Procesamiento del Pago Simulado
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitar que la página se recargue

            // Simulamos el tiempo de procesamiento con un pequeño retraso
            const btnSubmit = checkoutForm.querySelector('button[type="submit"]');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = '⏳ Procesando...';
            btnSubmit.disabled = true;

            setTimeout(() => {
                alert('✅ ¡Pago exitoso! Tu pedido está en camino.');
                
                // Vaciar el carrito en la base de datos visualmente
                clearCart();
                updateCartBadge();
                renderCart();

                // Cerrar modal de checkout
                const checkoutModalEl = document.getElementById('checkoutModal');
                const checkoutModal = bootstrap.Modal.getInstance(checkoutModalEl);
                if (checkoutModal) checkoutModal.hide();

                // Restaurar formulario
                checkoutForm.reset();
                btnSubmit.textContent = originalText;
                btnSubmit.disabled = false;
            }, 1500);
        });
    }
}

// --- FUNCIONES VISUALES ---

function updateCartBadge() {
    const cart = getCart();
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!container || !totalElement) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-muted my-4">Tu carrito está vacío. ¡Ve a comprar algo!</p>';
        totalElement.textContent = '$0.00';
        if(checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if(checkoutBtn) checkoutBtn.disabled = false;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement('div');
        row.className = 'row align-items-center mb-3 pb-3 border-bottom';
        row.innerHTML = `
            <div class="col-3 col-md-2 text-center">
                <img src="${item.image}" alt="${item.title}" class="img-fluid rounded shadow-sm" style="max-height: 60px;">
            </div>
            <div class="col-5 col-md-5">
                <h6 class="text-truncate mb-0" title="${item.title}">${item.title}</h6>
                <small class="text-muted">$${item.price.toFixed(2)} c/u</small>
            </div>
            <div class="col-4 col-md-3 d-flex justify-content-center align-items-center">
                <button class="btn btn-sm btn-outline-secondary decrease-qty px-2" data-id="${item.id}">-</button>
                <span class="mx-3 fw-bold">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary increase-qty px-2" data-id="${item.id}">+</button>
            </div>
            <div class="col-12 col-md-2 text-end mt-2 mt-md-0 d-flex justify-content-between justify-content-md-end align-items-center">
                <div class="fw-bold d-md-none">Subtotal: $${subtotal.toFixed(2)}</div>
                <div class="fw-bold d-none d-md-block me-3">$${subtotal.toFixed(2)}</div>
                <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}" title="Eliminar">🗑️</button>
            </div>
        `;
        container.appendChild(row);
    });

    totalElement.textContent = `$${total.toFixed(2)}`;
}