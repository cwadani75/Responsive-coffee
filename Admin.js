document.addEventListener("DOMContentLoaded", function() {
    // API endpoints
    const API = {
        PRODUCTS: `${window.API_CONFIG.ADMIN_URL}/products`,
        CLIENTS: `${window.API_CONFIG.ADMIN_URL}/clients`
    };

    // DOM elements
    const productsTable = document.getElementById('productsTable');
    const productForm = document.getElementById('productForm');

    // Load products
    async function loadProducts() {
        try {
            const response = await fetch(API.PRODUCTS);
            if (!response.ok) throw new Error('API Error');
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error("Failed to load products:", error);
            showAlert('Failed to load products', 'danger');
        }
    }

    // Render products table
    function renderProducts(products) {
        productsTable.innerHTML = products.map(product => `
            <tr>
                <td><img src="${product.poster}" class="product-img"></td>
                <td>${product.Title}</td>
                <td>${product.Plot.substring(0, 50)}...</td>
                <td>${product.price}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('Delete this product?')) {
                    await deleteProduct(btn.dataset.id);
                }
            });
        });
    }

    // Delete product
    async function deleteProduct(id) {
        try {
            const response = await fetch(`${API.PRODUCTS}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Delete failed');
            loadProducts();
            showAlert('Product deleted', 'success');
        } catch (error) {
            console.error("Delete error:", error);
            showAlert('Delete failed', 'danger');
        }
    }

    // Form submission
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const product = {
            id: document.getElementById('productId').value || Date.now().toString(),
            Title: document.getElementById('productName').value,
            poster: document.getElementById('productImage').value,
            Plot: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value
        };

        try {
            const method = product.id ? 'PUT' : 'POST';
            const url = product.id ? `${API.PRODUCTS}/${product.id}` : API.PRODUCTS;
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

            if (!response.ok) throw new Error('Save failed');
            
            loadProducts();
            productForm.reset();
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            showAlert('Product saved', 'success');
        } catch (error) {
            console.error("Save error:", error);
            showAlert('Save failed', 'danger');
        }
    });

    // Helper function
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.getElementById('alertContainer').appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    // Initialize
    loadProducts();
});