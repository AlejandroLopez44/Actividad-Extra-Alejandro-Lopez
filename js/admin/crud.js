import { getProducts, saveProducts } from '../storage/database.js';
import { renderProductsTable } from './dashboard.js';

export function initCRUD() {
    const productForm = document.getElementById('product-form');
    const btnAddProduct = document.getElementById('btn-add-product');
    const tableBody = document.getElementById('admin-table-body');

    if (!productForm || !btnAddProduct || !tableBody) return;

    // 1. Preparar modal para AÑADIR (limpiar campos)
    btnAddProduct.addEventListener('click', () => {
        productForm.reset();
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

    // LEER SIEMPRE LOS PRODUCTOS ACTUALIZADOS (Garantiza un arreglo si viene null)
    let products = getProducts() || [];

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

    // 1. Guardar de inmediato en el LocalStorage
    saveProducts(products);
    
    // 2. RE-REDIBUJAR LA TABLA ACTUALIZADA EN TIEMPO REAL
    renderProductsTable();

    // 3. CERRAR EL MODAL DE FORMA SEGURA (Evitando bloqueos de JS)
    const modalEl = document.getElementById('productModal');
    if (modalEl && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        if (modalInstance) modalInstance.hide();
    }

    // 4. LIMPIEZA MANUAL DE RESPALDO (Por si Bootstrap deja residuos oscuros en pantalla)
    setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }, 150);
}

function prepareEdit(id) {
    const products = getProducts() || [];
    const productToEdit = products.find(p => p.id === id);

    if (!productToEdit) return;

    // Llenar el formulario con la información guardada
    document.getElementById('prod-id').value = productToEdit.id;
    document.getElementById('prod-title').value = productToEdit.title;
    document.getElementById('prod-price').value = productToEdit.price;
    document.getElementById('prod-category').value = productToEdit.category;
    document.getElementById('prod-image').value = productToEdit.image;

    document.getElementById('productModalLabel').textContent = 'Editar Producto';

    // Mostrar el modal recuperando o creando la instancia única limpia
    const modalEl = document.getElementById('productModal');
    if (window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        if (modalInstance) modalInstance.show();
    }
}

function deleteProduct(id) {
    if (!confirm('⚠️ ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) return;

    let products = getProducts() || [];
    products = products.filter(p => p.id !== id);

    saveProducts(products);
    
    // REDIBUJAR
    renderProductsTable();
    alert('🗑️ Producto eliminado del inventario.');
}