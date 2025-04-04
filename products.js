document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const productsContainer = document.getElementById("products-container");
    let isEditing = false;
    let currentEditId = null;

    // Form submit handler for both Add and Update
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const productObj = {
            id: document.getElementById("productId").value,
            Title: document.getElementById("productTitle").value,
            Poster: document.getElementById("productPoster").value,
            Plot: document.getElementById("productPlot").value,
            Price: document.getElementById("productPrice").value
        };

        if (isEditing) {
            updateProduct(currentEditId, productObj);
        } else {
            addProduct(productObj);
        }
    });

    // Add a new product
    function addProduct(product) {
        fetch("http://localhost:3000/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            loadProduct(data);
            form.reset();
        })
        .catch(error => console.error("Error adding product:", error));
    }

    // Load all products
    function getProducts() {
        fetch("http://localhost:3000/products")
            .then(res => res.json())
            .then(products => {
                productsContainer.innerHTML = "";
                products.forEach(product => loadProduct(product));
            })
            .catch(error => console.error("Error fetching products:", error));
    }

    // Display a single product - Added Buy Now button
    function loadProduct(product) {
        let card = document.createElement("div");
        card.classList.add("card", "col-3", "m-3");
        card.setAttribute("data-id", product.id);

        // Create image separately to ensure proper loading
        const img = document.createElement("img");
        img.src = product.Poster;
        img.alt = product.Title;
        img.className = "card-img-top";
        img.style.height = "200px";
        img.style.objectFit = "cover";
        img.onerror = function() {
            this.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
        };

        card.innerHTML = `
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.Title}</h5>
                    <p class="card-text">${product.Plot}</p>
                    <p class="mt-auto"><strong>Price: $${product.Price}</strong></p>
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-warning btn-sm edit-btn">Edit</button>
                                  <a href="order.html" class="btn btn-success btn-sm buy-btn">Buy Now</a>
                        <button class="btn btn-danger btn-sm delete-btn">Delete</button>
                    </div>
                </div>
            </div>
        `;

        // Insert the image at the top
        card.querySelector(".card").insertBefore(img, card.querySelector(".card-body"));
        
        productsContainer.appendChild(card);

        // Add event listeners to the new buttons
        card.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(product.id));
        card.querySelector(".edit-btn").addEventListener("click", () => editProduct(product));
        card.querySelector(".buy-btn").addEventListener("click", () => buyProduct(product));
    }

    // Buy Now function
    // function buyProduct(product) {
    //     // alert(`You have purchased ${product.Title} for $${product.Price}`);
    //     // You can add more purchase logic here
    // }

    // Delete a product
    function deleteProduct(id) {
        if (confirm("Are you sure you want to delete this product?")) {
            fetch(`http://localhost:3000/products/${id}`, {
                method: "DELETE"
            })
            .then(() => {
                document.querySelector(`.card[data-id="${id}"]`).remove();
            })
            .catch(error => console.error("Error deleting product:", error));
        }
    }

    // Edit a product (fill form with product data)
    function editProduct(product) {
        isEditing = true;
        currentEditId = product.id;
        
        document.getElementById("productTitle").value = product.Title;
        document.getElementById("productId").value = product.id;
        document.getElementById("productPoster").value = product.Poster;
        document.getElementById("productPlot").value = product.Plot;
        document.getElementById("productPrice").value = product.Price;
        
        form.querySelector("button[type='submit']").textContent = "Update Product";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update a product
    function updateProduct(id, updatedProduct) {
        fetch(`http://localhost:3000/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProduct)
        })
        .then(response => response.json())
        .then(data => {
            // Refresh the product list
            getProducts();
            // Reset the form
            form.reset();
            form.querySelector("button[type='submit']").textContent = "Add Product";
            isEditing = false;
            currentEditId = null;
        })
        .catch(error => console.error("Error updating product:", error));
    }

    // Initial load of products
    getProducts();
});