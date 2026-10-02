// ======================================
// Product Data
// ======================================

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1499,
        image: "images/headphones.jpg",
        description: "High-quality wireless headphones with clear sound."
    },

    {
        id: 2,
        name: "Smart Watch",
        price: 2499,
        image: "images/smartwatch.jpg",
        description: "Smart watch with fitness and notification features."
    },

    {
        id: 3,
        name: "Running Shoes",
        price: 1999,
        image: "images/shoes.jpg",
        description: "Comfortable running shoes for everyday use."
    },

    {
        id: 4,
        name: "Backpack",
        price: 999,
        image: "images/backpack.jpg",
        description: "Durable backpack suitable for college and travel."
    }
];


// ======================================
// Display Products
// ======================================

const productContainer =
    document.getElementById("productContainer");


function displayProducts() {

    const productContainer =
        document.getElementById("productContainer");

    if (!productContainer) {
        return;
    }


    // Get products added by admin

    const adminProducts =
        JSON.parse(
            localStorage.getItem("shopEaseProducts")
        ) || [];


    // Combine original products and admin products

    const allProducts = [
        ...products,
        ...adminProducts
    ];


    productContainer.innerHTML =
        allProducts.map(function (product) {

            return `

                <div class="product-card">

                    <img
                        src="${window.location.pathname.includes('/pages/') ? '../' : ''}${product.image}"
                        alt="${product.name}"
                    >

                    <h3>
                        <a href="product.html?id=${product.id}">
                            ${product.name}
                        </a>
                    </h3>

                    <p>
                        ${product.description}
                    </p>

                    <div class="product-price">
                        ₹${product.price}
                    </div>

                    <button
                        onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                </div>

            `;

        }).join("");
}


// ======================================
// Add to Cart
// ======================================

function addToCart(productId) {

    // Get products added by admin

    const adminProducts =
        JSON.parse(
            localStorage.getItem("shopEaseProducts")
        ) || [];


    // Combine original and admin products

    const allProducts = [
        ...products,
        ...adminProducts
    ];


    // Find selected product

    const product =
        allProducts.find(function (item) {

            return item.id === productId;

        });


    if (!product) {

        alert(
            "Product not found."
        );

        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("shopEaseCart")
        ) || [];


    cart.push(product);


    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );


    alert(
        product.name + " added to cart!"
    );
}


// ======================================
// Load Products
// ======================================

displayProducts();
// ======================================
// User Registration
// ======================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;


            const user = {
                name: name,
                email: email,
                password: password
            };


            localStorage.setItem(
                "shopEaseUser",
                JSON.stringify(user)
            );


            alert(
                "Registration successful!"
            );


            registerForm.reset();

        }
    );

}
// ======================================
// User Login
// ======================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail").value;

            const password =
                document.getElementById("loginPassword").value;


            const savedUser =
                JSON.parse(
                    localStorage.getItem("shopEaseUser")
                );


            if (!savedUser) {

                alert(
                    "No registered user found. Please register first."
                );

                return;
            }


            if (
                email === savedUser.email &&
                password === savedUser.password
            ) {

                localStorage.setItem(
                    "shopEaseLoggedIn",
                    "true"
                );

                alert(
                    "Login successful!"
                );

                window.location.href =
                    "../index.html";

            } else {

                alert(
                    "Invalid email or password."
                );

            }

        }
    );

}
// ======================================
// Display Cart
// ======================================

const cartContainer =
    document.getElementById("cartContainer");


function displayCart() {

    if (!cartContainer) {
        return;
    }

    let cart =
        JSON.parse(
            localStorage.getItem("shopEaseCart")
        ) || [];


    // Remove invalid old cart products

    cart = cart.filter(function (product) {

        return product &&
               product.id &&
               product.name &&
               product.price !== undefined;

    });


    // Save cleaned cart

    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );


    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <p>
                Your cart is empty.
            </p>
        `;

        return;
    }


    let total = 0;


    cart.forEach(function (product) {

        total += Number(product.price);


        const cartItem =
            document.createElement("div");


        cartItem.classList.add(
            "product-card"
        );


        cartItem.innerHTML = `

            <img
                src="../${product.image}"
                alt="${product.name}"
            >

            <h3>
                ${product.name}
            </h3>

            <p>
                ${product.description}
            </p>

            <div class="product-price">
                ₹${product.price}
            </div>

            <button
                onclick="removeFromCart(${product.id})">
                Remove
            </button>

        `;


        cartContainer.appendChild(
            cartItem
        );

    });


    const totalElement =
        document.createElement("div");


    totalElement.classList.add(
        "cart-total"
    );


    totalElement.innerHTML = `

        <h3>
            Total: ₹${total}
        </h3>

        <button
            onclick="goToCheckout()">
            Proceed to Checkout
        </button>

    `;


    cartContainer.appendChild(
        totalElement
    );

}

displayCart();

// ======================================
// Remove Product From Cart
// ======================================
function removeFromCart(productId) {

    let cart =
        JSON.parse(
            localStorage.getItem("shopEaseCart")
        ) || [];


    cart = cart.filter(function (product) {

        return String(product.id) !== String(productId);

    });


    localStorage.setItem(
        "shopEaseCart",
        JSON.stringify(cart)
    );


    displayCart();

}
// ======================================
// Go To Checkout
// ======================================

function goToCheckout() {

    const cart =
        JSON.parse(
            localStorage.getItem("shopEaseCart")
        ) || [];


    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    window.location.href =
        "order.html";

}
// ======================================
// Place Order
// ======================================

const orderForm =
    document.getElementById("orderForm");


if (orderForm) {

    orderForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const cart =
                JSON.parse(
                    localStorage.getItem("shopEaseCart")
                ) || [];


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            const name =
                document.getElementById("orderName").value;

            const address =
                document.getElementById("orderAddress").value;

            const phone =
                document.getElementById("orderPhone").value;


            let orders =
                JSON.parse(
                    localStorage.getItem("shopEaseOrders")
                ) || [];


            const total =
                cart.reduce(function (sum, product) {

                    return sum + product.price;

                }, 0);


            const order = {

                id: Date.now(),

                name: name,

                address: address,

                phone: phone,

                products: cart,

                total: total,

                payment: "Cash on Delivery",

                status: "Order Placed"

            };


            orders.push(order);


            localStorage.setItem(
                "shopEaseOrders",
                JSON.stringify(orders)
            );


            localStorage.removeItem(
                "shopEaseCart"
            );


            alert(
                "Order placed successfully!"
            );


            window.location.href =
                "orders.html";

        }
    );

}
// ======================================
// Display Orders
// ======================================

const ordersContainer =
    document.getElementById("ordersContainer");


function displayOrders() {

    if (!ordersContainer) {
        return;
    }


    const orders =
        JSON.parse(
            localStorage.getItem("shopEaseOrders")
        ) || [];


    ordersContainer.innerHTML = "";


    if (orders.length === 0) {

        ordersContainer.innerHTML = `
            <p>
                No orders placed yet.
            </p>
        `;

        return;
    }


    orders.forEach(function (order) {

        const orderCard =
            document.createElement("div");

        orderCard.classList.add("product-card");


        orderCard.innerHTML = `

            <h3>
                Order ID: ${order.id}
            </h3>

            <p>
                <strong>Name:</strong>
                ${order.name}
            </p>

            <p>
                <strong>Address:</strong>
                ${order.address}
            </p>

            <p>
                <strong>Phone:</strong>
                ${order.phone}
            </p>

            <p>
                <strong>Payment:</strong>
                ${order.payment}
            </p>

            <p>
                <strong>Status:</strong>
                ${order.status}
            </p>

            <h4>
                Products
            </h4>

            ${order.products.map(function (product) {

                return `
                    <p>
                        ${product.name} - ₹${product.price}
                    </p>
                `;

            }).join("")}

            <h3>
                Total: ₹${order.total}
            </h3>

        `;


        ordersContainer.appendChild(orderCard);

    });

}


// ======================================
// Load Orders
// ======================================

displayOrders();
// ======================================
// Display Specific Product
// ======================================

const productDetails =
    document.getElementById("productDetails");


function displayProductDetails() {

    if (!productDetails) {
        return;
    }


    const productId =
        new URLSearchParams(
            window.location.search
        ).get("id");


    // Get products added by admin

    const adminProducts =
        JSON.parse(
            localStorage.getItem("shopEaseProducts")
        ) || [];


    // Combine all products

    const allProducts = [
        ...products,
        ...adminProducts
    ];


    // Find the selected product

    const product =
        allProducts.find(function (item) {

            return item.id === Number(productId);

        });


    if (!product) {

        productDetails.innerHTML = `
            <p>
                Product not found.
            </p>
        `;

        return;
    }


    productDetails.innerHTML = `

        <div class="product-card">

            <img
                src="../${product.image}"
                alt="${product.name}"
            >

            <h3>
                ${product.name}
            </h3>

            <p>
                ${product.description}
            </p>

            <div class="product-price">
                ₹${product.price}
            </div>

            <button
                onclick="addToCart(${product.id})">
                Add to Cart
            </button>

        </div>

    `;
}


displayProductDetails();

// ======================================
// User Logout
// ======================================

function logoutUser() {

    localStorage.removeItem(
        "shopEaseLoggedIn"
    );

    alert(
        "You have been logged out successfully."
    );

    window.location.href =
        "login.html";
}
// ======================================
// Admin Login
// ======================================

const adminLoginForm =
    document.getElementById("adminLoginForm");


if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById("adminEmail").value;

            const password =
                document.getElementById("adminPassword").value;


            // Demo admin credentials

            const adminEmail =
                "admin@shopease.com";

            const adminPassword =
                "admin123";


            if (
                email === adminEmail &&
                password === adminPassword
            ) {

                localStorage.setItem(
                    "shopEaseAdminLoggedIn",
                    "true"
                );

                alert(
                    "Admin login successful!"
                );

                window.location.href =
                    "admin-dashboard.html";

            } else {

                alert(
                    "Invalid admin email or password."
                );

            }

        }
    );

}
// ======================================
// Admin - Add Product
// ======================================

const addProductForm =
    document.getElementById("addProductForm");

if (addProductForm) {

    addProductForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById("productName").value;

            const price =
                Number(
                    document.getElementById("productPrice").value
                );

            const image =
                document.getElementById("productImage").value;

            const description =
                document.getElementById("productDescription").value;


            const adminProducts =
                JSON.parse(
                    localStorage.getItem("shopEaseProducts")
                ) || [];


            const newProduct = {

                id: Date.now(),

                name: name,

                price: price,

                image: image,

                description: description

            };


            adminProducts.push(newProduct);


            localStorage.setItem(
                "shopEaseProducts",
                JSON.stringify(adminProducts)
            );


            alert(
                "Product added successfully!"
            );


            addProductForm.reset();

        }
    );

}
// ======================================
// Admin - View Orders
// ======================================

const adminOrdersContainer =
    document.getElementById("adminOrdersContainer");

function displayAdminOrders() {

    if (!adminOrdersContainer) {
        return;
    }

    const orders =
        JSON.parse(
            localStorage.getItem("shopEaseOrders")
        ) || [];


    if (orders.length === 0) {

        adminOrdersContainer.innerHTML = `
            <div class="product-card">

                <h2>
                    No Orders Found
                </h2>

                <p>
                    No customer orders have been placed yet.
                </p>

            </div>
        `;

        return;
    }


    adminOrdersContainer.innerHTML =
        orders.map(function (order, index) {

            return `

                <div class="product-card">

                    <h2>
                        Order #${index + 1}
                    </h2>

                    <p>
                        <strong>Name:</strong>
                        ${order.name}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${order.address}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${order.phone}
                    </p>

                    <p>
                        <strong>Payment:</strong>
                        Cash on Delivery
                    </p>

                    <h3>
                        Ordered Products
                    </h3>

                    ${
                        order.products.map(function (product) {

                            return `
                                <p>
                                    ${product.name}
                                    — ₹${product.price}
                                </p>
                            `;

                        }).join("")
                    }

                </div>

            `;

        }).join("");
}


displayAdminOrders();
// ======================================
// Admin - View Customers
// ======================================

const customersContainer =
    document.getElementById("customersContainer");

function displayCustomers() {

    if (!customersContainer) {
        return;
    }

    const user =
        JSON.parse(
            localStorage.getItem("shopEaseUser")
        );


    if (!user) {

        customersContainer.innerHTML = `
            <div class="product-card">

                <h2>
                    No Customers Found
                </h2>

                <p>
                    No customer has registered yet.
                </p>

            </div>
        `;

        return;
    }


    customersContainer.innerHTML = `

        <div class="product-card">

            <h2>
                Customer #1
            </h2>

            <p>
                <strong>Name:</strong>
                ${user.name}
            </p>

            <p>
                <strong>Email:</strong>
                ${user.email}
            </p>

        </div>

    `;
}


displayCustomers();
// ======================================
// Admin Logout
// ======================================

function logoutAdmin() {

    localStorage.removeItem(
        "shopEaseAdminLoggedIn"
    );

    alert(
        "Admin has been logged out successfully."
    );

    window.location.href =
        "admin-login.html";
}