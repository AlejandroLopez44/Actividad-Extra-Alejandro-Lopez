import { getCurrentSession, getProducts } from '../storage/database.js';

export function initDashboard() {
    loadAdminProfile();
    renderProductsTable();
}

function loadAdminProfile() {
    const session = getCurrentSession();
    if (session) {
        document.getElementById('admin-name-display').textContent = session.name;
        document.getElementById('admin-avatar').src = session.avatar;
    }
}
export function renderProductsTable() {
    // PROTECCIÓN: Si getProducts() devuelve null o undefined, usa un arreglo vacío
    const products = getProducts() || [];
    const tbody = document.getElementById('admin-table-body');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No hay productos en el inventario.</td></tr>';
        return;
    }

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="align-middle fw-bold text-muted">#${product.id}</td>
            <td class="align-middle">
                <img src="${product.image}" alt="${product.title}" class="rounded" style="width: 50px; height: 50px; object-fit: contain;">
            </td>
            <td class="align-middle text-start text-truncate" style="max-width: 250px;" title="${product.title}">
                ${product.title}
            </td>
            <td class="align-middle text-capitalize">${product.category}</td>
            <td class="align-middle fw-bold text-success">$${parseFloat(product.price).toFixed(2)}</td>
            <td class="align-middle">
                <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${product.id}" title="Editar">✏️</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}" title="Eliminar">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}