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

    // 1. Dibujar todos los productos inicialmente
    renderProducts(products, catalogContainer);

    // 2. Llenar el selector de categorías automáticamente
    populateCategories(products);

    // 3. Activar los escuchadores de eventos para los filtros
    setupFilters(products, catalogContainer);
}

// --- FUNCIONES DE RENDERIZADO ---
function renderProducts(productsToRender, container) {
    container.innerHTML = ''; // Limpiamos el contenedor

    if (productsToRender.length === 0) {
        container.innerHTML = '<p class="col-12 text-center text-muted mt-4">No se encontraron productos con esos filtros.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col';
        
        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 text-center p-3">
                <img src="${product.image}" class="card-img-top mx-auto" alt="${product.title}" style="height: 180px; object-fit: contain; max-width: 80%;">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-truncate" title="${product.title}">${product.title}</h6>
                    <p class="card-text small text-muted text-capitalize mb-1">${product.category}</p>
                    <h5 class="text-primary fw-bold mt-auto mb-3">$${product.price.toFixed(2)}</h5>
                    <button class="btn btn-dark w-100 add-to-cart-btn" data-id="${product.id}">
                        🛒 Agregar
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function populateCategories(products) {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;

    // Extraer categorías únicas usando un Set
    const uniqueCategories = [...new Set(products.map(p => p.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalizar
        categoryFilter.appendChild(option);
    });
}

// --- LÓGICA DE FILTRADO EN TIEMPO REAL ---
function setupFilters(allProducts, container) {
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');

    // Función maestra que evalúa los 3 filtros a la vez
    const applyFilters = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;

        const filteredProducts = allProducts.filter(product => {
            // 1. Coincidencia de texto (nombre)
            const matchesSearch = product.title.toLowerCase().includes(searchTerm);
            
            // 2. Coincidencia de categoría
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            
            // 3. Coincidencia de precio
            let matchesPrice = true;
            if (selectedPrice === 'low') matchesPrice = product.price < 50;
            else if (selectedPrice === 'mid') matchesPrice = product.price >= 50 && product.price <= 100;
            else if (selectedPrice === 'high') matchesPrice = product.price > 100;

            // Retorna true solo si el producto pasa TODAS las pruebas
            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Redibujar la grilla con los resultados
        renderProducts(filteredProducts, container);
    };

    // Escuchar cambios en los inputs (input para escribir, change para selects)
    if(searchInput) searchInput.addEventListener('input', applyFilters);
    if(categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if(priceFilter) priceFilter.addEventListener('change', applyFilters);
}