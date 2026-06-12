import { getProducts, saveProducts } from '../storage/database.js';
import { renderProductsTable } from './dashboard.js';

export function initCRUD() {
    const productForm = document.getElementById('product-form');
    const btnAddProduct = document.getElementById('btn-add-product');
    const tableBody = document.getElementById('admin-table-body');

    if (!productForm || !btnAddProduct || !tableBody) return;

    // 1. Preparar modal para AÑADIR (limpiar campos)
    btnAddProduct.addEventListener('click', () => {
        document.getElementById('product-form').reset();
        document.getElementById('prod-id').value = '';
        document.getElementById('productModalLabel').textContent = 'Añadir Nuevo Producto';
    });

    // 2. Escuchar el guardado del formulario (Crear o Editar)
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit();
    });

    // 3. Escuchar clics en los botones de Editar y Eliminar de la tabla
    tableBody.addEventListener('click', (e) => {
        // Encontrar el botón que fue clickeado
        const target = e.target.closest('button');
        if (!target) return;

        const id = parseInt(target.getAttribute('data-id'));

        if (target.classList.contains('edit-btn')) {
            prepareEdit(id);
        } else if (target.classList.contains('delete-btn')) {
            deleteProduct(id);
        }
    });
}

function handleFormSubmit() {
    const idInput = document.getElementById('prod-id').value;
    const title = document.getElementById('prod-title').value.trim();
    const price = parseFloat(document.getElementById('prod-price').value);
    const category = document.getElementById('prod-category').value.trim();
    const image = document.getElementById('prod-image').value.trim();

    let products = getProducts();

    if (idInput) {
        // MODO EDICIÓN
        const id = parseInt(idInput);
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], title, price, category, image };
            alert('✅ Producto actualizado correctamente.');
        }
    } else {
        // MODO CREACIÓN
        // Calculamos el ID más alto y le sumamos 1
        const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
        const newProduct = {
            id: maxId + 1,
            title,
            price,
            category,
            image
        };
        products.push(newProduct);
        alert('✅ Nuevo producto añadido al inventario.');
    }

    // Guardar en disco duro y redibujar la tabla
    saveProducts(products);
    renderProductsTable();

    // Ocultar modal
    const modalEl = document.getElementById('productModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
}

function prepareEdit(id) {
    const products = getProducts();
    const productToEdit = products.find(p => p.id === id);

    if (!productToEdit) return;

    // Llenar el formulario con los datos actuales
    document.getElementById('prod-id').value = productToEdit.id;
    document.getElementById('prod-title').value = productToEdit.title;
    document.getElementById('prod-price').value = productToEdit.price;
    document.getElementById('prod-category').value = productToEdit.category;
    document.getElementById('prod-image').value = productToEdit.image;

    document.getElementById('productModalLabel').textContent = 'Editar Producto';

    // Mostrar el modal mediante JS
    const modalEl = document.getElementById('productModal');
    let modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (!modalInstance) modalInstance = new bootstrap.Modal(modalEl);
    modalInstance.show();
}

function deleteProduct(id) {
    if (!confirm('⚠️ ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) return;

    let products = getProducts();
    products = products.filter(p => p.id !== id);

    saveProducts(products);
    renderProductsTable();
}