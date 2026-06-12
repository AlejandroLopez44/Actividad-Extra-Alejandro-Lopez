import { getProducts } from '../storage/database.js';

export function initCatalog() {
    const catalogContainer = document.getElementById('catalog-container');
    
    // Si no estamos en la página del catálogo, no hacemos nada
    if (!catalogContainer) return;

    const products = getProducts();
    
    if (!products || products.length === 0) {
        catalogContainer.innerHTML = '<p class="col-12 text-center text-muted">No hay productos disponibles en el inventario.</p>';
        return;
    }

    renderProducts(products, catalogContainer);
}

// Función para dibujar las tarjetas
function renderProducts(productsToRender, container) {
    container.innerHTML = ''; // Limpiamos el contenedor

    productsToRender.forEach(product => {
        // Creamos la columna para la grilla de Bootstrap
        const col = document.createElement('div');
        col.className = 'col';
        
        // Estructura de la tarjeta
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 text-center p-3">
                <img src="${product.image}" class="card-img-top mx-auto" alt="${product.title}" style="height: 180px; object-fit: contain; max-width: 80%;">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-truncate" title="${product.title}">${product.title}</h6>
                    <p class="card-text small text-muted text-capitalize mb-1">${product.category}</p>
                    <h5 class="text-primary fw-bold mt-auto mb-3">$${product.price}</h5>
                    <button class="btn btn-dark w-100 add-to-cart-btn" data-id="${product.id}">
                        🛒 Agregar
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}