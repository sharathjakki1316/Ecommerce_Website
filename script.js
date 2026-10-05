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

async function displayProducts() {

    const productContainer =
        document.getElementById("productContainer");

    if (!productContainer) {
        return;
    }

    try {

        const response =
            await fetch("http://127.0.0.1:5000/api/products");

        const backendProducts =
            await response.json();

        productContainer.innerHTML =
            backendProducts.map(function (product) {

                return `

                    <div class="product-card">

                        <img
                            src="${window.location.pathname.includes('/pages/') ? '../images/' : 'images/'}${product.image}"
                            alt="${product.name}"
                        >

                        <h3>
                            <a href="${window.location.pathname.includes('/pages/') ? 'product.html' : 'pages/product.html'}?id=${product.id}">
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

    } catch (error) {

        console.error(
            "Failed to load products from backend:",
            error
        );

    }
}


// ======================================
// Add to Cart
// ======================================

async function addToCart(productId) {

    const loggedIn =
        localStorage.getItem("shopEaseLoggedIn");

    if (loggedIn !== "true") {

        alert("Please login before adding products to cart.");

        window.location.href =
            "login.html";

        return;
    }

    const user =
        JSON.parse(
            localStorage.getItem("shopEaseUser")
        );

    if (!user) {

        alert("User information not found. Please login again.");

        return;
    }

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/cart",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        user_id: user.id,
                        product_id: productId
                    })
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to add product to cart"
            );

        }

        alert(
            "Product added to cart!"
        );

    } catch (error) {

        console.error(
            "Add to cart error:",
            error
        );

        alert(
            "Failed to add product to cart. Please check the backend."
        );

    }

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
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            try {

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/api/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                password: password
                            })
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        result.message
                    );

                }

                alert(
                    "Registration successful!"
                );

                registerForm.reset();

            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                alert(
                    error.message ||
                    "Registration failed. Please check the backend."
                );

            }
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
        async function (event) {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail").value;

            const password =
                document.getElementById("loginPassword").value;

            try {

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Invalid email or password."
                    );

                }

                localStorage.setItem(
                    "shopEaseLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "shopEaseUser",
                    JSON.stringify(result.user)
                );

                alert(
                    "Login successful!"
                );

                window.location.href =
                    "../index.html";

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                alert(
                    error.message ||
                    "Login failed. Please check the backend."
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


async function displayCart() {
    console.log("displayCart function is running");

    const cartContainer =
        document.getElementById("cartContainer");

    if (!cartContainer) {
        return;
    }

    const loggedIn =
        localStorage.getItem("shopEaseLoggedIn");

    if (loggedIn !== "true") {

        cartContainer.innerHTML = `
            <p>
                Please login to view your cart.
            </p>
        `;

        return;
    }

    const user =
        JSON.parse(
            localStorage.getItem("shopEaseUser")
        );

    if (!user) {

        cartContainer.innerHTML = `
            <p>
                User information not found.
            </p>
        `;

        return;
    }

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/cart/" +
                user.id
            );

        const cartItems =
            await response.json();

        if (!response.ok) {

            throw new Error(
                "Failed to load cart"
            );

        }

        if (cartItems.length === 0) {

            cartContainer.innerHTML = `
                <p>
                    Your cart is empty.
                </p>
            `;

            return;
        }

        cartContainer.innerHTML =
            cartItems.map(function (item) {

                return `

                    <div class="product-card">

                        <img
                            src="../images/${item.image}"
                            alt="${item.name}"
                        >

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ${item.description}
                        </p>

                        <div class="product-price">
                            ₹${item.price}
                        </div>

                        <p>
                            Quantity: ${item.quantity}
                        </p>

                        <button
                            onclick="removeFromCart(${item.id})">
                            Remove
                        </button>

                    </div>

                `;

            }).join("");
        const total =
            cartItems.reduce(function (sum, item) {

                return sum +
                    (Number(item.price) *
                     Number(item.quantity));

            }, 0);


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

    } catch (error) {

        console.error(
            "Failed to load cart:",
            error
        );

        cartContainer.innerHTML = `
            <p>
                Failed to load cart.
            </p>
        `;

    }

}

console.log("Calling displayCart...");
displayCart();

// ======================================
// Remove Product From Cart
// ======================================
async function removeFromCart(cartId) {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/cart/" + cartId,
                {
                    method: "DELETE"
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to remove product"
            );

        }

        alert(
            "Product removed from cart!"
        );

        displayCart();

    } catch (error) {

        console.error(
            "Remove from cart error:",
            error
        );

        alert(
            "Failed to remove product from cart."
        );

    }

}

// ======================================
// Go To Checkout
// ======================================

// ======================================
// Go To Checkout
// ======================================

function goToCheckout() {

    const loggedIn =
        localStorage.getItem("shopEaseLoggedIn");

    if (loggedIn !== "true") {

        alert(
            "Please login before proceeding to checkout."
        );

        return;
    }

    const user =
        JSON.parse(
            localStorage.getItem("shopEaseUser")
        );

    if (!user) {

        alert(
            "User information not found. Please login again."
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
        async function (event) {

            event.preventDefault();

            const loggedIn =
                localStorage.getItem("shopEaseLoggedIn");

            if (loggedIn !== "true") {

                alert(
                    "Please login before placing an order."
                );

                return;
            }


            const user =
                JSON.parse(
                    localStorage.getItem("shopEaseUser")
                );


            if (!user) {

                alert(
                    "User information not found. Please login again."
                );

                return;
            }


            const cartResponse =
                await fetch(
                    "http://127.0.0.1:5000/api/cart/" + user.id
                );


            const cartItems =
                await cartResponse.json();


            if (
                !cartResponse.ok ||
                cartItems.length === 0
            ) {

                alert(
                    "Your cart is empty."
                );

                return;
            }


            const name =
                document.getElementById(
                    "orderName"
                ).value;


            const address =
                document.getElementById(
                    "orderAddress"
                ).value;


            const phone =
                document.getElementById(
                    "orderPhone"
                ).value;


            try {

                for (const item of cartItems) {

                    const totalPrice =
                        Number(item.price) *
                        Number(item.quantity);


                    const response =
                        await fetch(
                            "http://127.0.0.1:5000/api/orders",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    user_id:
                                        user.id,

                                    product_id:
                                        item.product_id,

                                    quantity:
                                        item.quantity,

                                    total_price:
                                        totalPrice,

                                    customer_name:
                                        name,

                                    address:
                                        address,

                                    phone:
                                        phone,

                                })
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Failed to place order"
                        );

                    }

                }


            const clearCartResponse =
                await fetch(
                    "http://127.0.0.1:5000/api/cart/user/" +
                    user.id,
                    {
                        method: "DELETE"
                    }
                );

            if (!clearCartResponse.ok) {

                throw new Error(
                    "Order placed, but failed to clear cart"
                );
            }

            alert(
                "Order placed successfully!"
            );

            window.location.href =
                "orders.html";


            } catch (error) {

                console.error(
                    "Place order error:",
                    error
                );


                alert(
                    "Failed to place order. Please check the backend."
                );

            }

        }
    );

}
// ======================================
// Display Orders
// ======================================

const ordersContainer =
    document.getElementById("ordersContainer");

async function displayOrders() {

    if (!ordersContainer) {
        return;
    }

    const loggedIn =
        localStorage.getItem("shopEaseLoggedIn");

    if (loggedIn !== "true") {

        ordersContainer.innerHTML = `
            <p>
                Please login to view your orders.
            </p>
        `;

        return;
    }

    const user =
        JSON.parse(
            localStorage.getItem("shopEaseUser")
        );

    if (!user) {

        ordersContainer.innerHTML = `
            <p>
                User information not found.
            </p>
        `;

        return;
    }

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/orders/" +
                user.id
            );

        const orders =
            await response.json();

        if (!response.ok) {

            throw new Error(
                "Failed to load orders"
            );

        }

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

            orderCard.classList.add(
                "product-card"
            );

            orderCard.innerHTML = `

                <h3>
                    Order ID: ${order.id}
                </h3>

                <p>
                    <strong>Product:</strong>
                    ${order.name}
                </p>

                <p>
                    <strong>Quantity:</strong>
                    ${order.quantity}
                </p>

                <p>
                    <strong>Price:</strong>
                    ₹${order.total_price}
                </p>

                <p>
                    <strong>Payment:</strong>
                    Cash on Delivery
                </p>

                <p>
                    <strong>Status:</strong>
                    ${order.status}
                </p>

                <p>
                    <strong>Order Date:</strong>
                    ${order.order_date}
                </p>

            `;

            ordersContainer.appendChild(
                orderCard
            );

        });

    } catch (error) {

        console.error(
            "Failed to load orders:",
            error
        );

        ordersContainer.innerHTML = `
            <p>
                Failed to load orders.
            </p>
        `;
    }
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


async function displayProductDetails() {

    if (!productDetails) {
        return;
    }


    const productId =
        new URLSearchParams(
            window.location.search
        ).get("id");


    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/products"
            );


        const allProducts =
            await response.json();


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
                    src="../images/${product.image}"
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


        } catch (error) {

            console.error(
                "Failed to load product details:",
                error
            );


            productDetails.innerHTML = `
                <p>
                    Failed to load product details.
                </p>
            `;

        }
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
        async function (event) {

            event.preventDefault();

            const email =
                document.getElementById(
                    "adminEmail"
                ).value;

            const password =
                document.getElementById(
                    "adminPassword"
                ).value;

            try {

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/api/admin/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Invalid admin email or password"
                    );

                }

                localStorage.setItem(
                    "shopEaseAdminLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "shopEaseAdmin",
                    JSON.stringify(
                        result.admin
                    )
                );

                alert(
                    "Admin login successful!"
                );

                window.location.href =
                    "admin-dashboard.html";

            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );

                alert(
                    error.message ||
                    "Admin login failed."
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
        async function (event) {

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


            try {

                const response =
                    await fetch(
                        "http://127.0.0.1:5000/api/products",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                price: price,
                                image: image,
                                description: description
                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message || "Failed to add product"
                    );

                }


                alert(
                    "Product added successfully!"
                );


                addProductForm.reset();


            } catch (error) {

                console.error(
                    "Error adding product:",
                    error
                );

                alert(
                    "Failed to add product. Please check the backend."
                );

            }

        }
    );

}
// ======================================
// Admin - View Orders
// ======================================

const adminOrdersContainer =
    document.getElementById("adminOrdersContainer");
    
async function displayAdminOrders() {

    if (!adminOrdersContainer) {
        return;
    }

    try {

        const response =
            await fetch(
                "http://127.0.0.1:5000/api/admin/orders"
            );

        const orders =
            await response.json();

        if (!response.ok) {

            throw new Error(
                "Failed to load orders"
            );

        }

        adminOrdersContainer.innerHTML = "";

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

        orders.forEach(function (order, index) {

            const orderCard =
                document.createElement("div");

            orderCard.classList.add(
                "product-card"
            );

            orderCard.innerHTML = `

                <h2>
                    Order #${index + 1}
                </h2>

                <p>
                    <strong>Order ID:</strong>
                    ${order.id}
                </p>

                <p>
                    <strong>Customer Name:</strong>
                    ${order.customer_name}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${order.customer_email}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${order.address || "Not provided"}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${order.phone || "Not provided"}
                </p>

                <p>
                    <strong>Product:</strong>
                    ${order.product_name}
                </p>

                <p>
                    <strong>Quantity:</strong>
                    ${order.quantity}
                </p>

                <p>
                    <strong>Total:</strong>
                    ₹${order.total_price}
                </p>

                <p>
                    <strong>Payment:</strong>
                    ${order.payment_method || "Cash on Delivery"}
                </p>

                <p>
                    <strong>Status:</strong>

                    <select
                        onchange="updateOrderStatus(${order.id}, this.value)"
                    >

                        <option value="Placed"
                            ${order.status === "Placed" ? "selected" : ""}>
                            Placed
                        </option>

                        <option value="Processing"
                            ${order.status === "Processing" ? "selected" : ""}>
                            Processing
                        </option>

                        <option value="Shipped"
                            ${order.status === "Shipped" ? "selected" : ""}>
                            Shipped
                        </option>

                        <option value="Delivered"
                            ${order.status === "Delivered" ? "selected" : ""}>
                            Delivered
                        </option>

                    </select>
                </p>

                <p>
                    <strong>Order Date:</strong>
                    ${order.order_date}
                </p>

            `;

            adminOrdersContainer.appendChild(
                orderCard
            );

        });

    } catch (error) {

        console.error(
            "Failed to load admin orders:",
            error
        );

        adminOrdersContainer.innerHTML = `
            <div class="product-card">

                <h2>
                    Failed to Load Orders
                </h2>

                <p>
                    Please check whether the backend server is running.
                </p>

            </div>
        `;
    }
}


displayAdminOrders();

async function updateOrderStatus(orderId, status) {

    try {

        const response =
            await fetch(
                "https://ecommerce-website-gzq1.onrender.com" +
                orderId +
                "/status",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to update order status"
            );

        }

        alert(
            "Order status updated successfully!"
        );

        displayAdminOrders();

    } catch (error) {

        console.error(
            "Update order status error:",
            error
        );

        alert(
            "Failed to update order status."
        );
    }
}

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
async function testBackendConnection() {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/products");

        const productsFromBackend = await response.json();

        console.log("Products received from backend:");
        console.log(productsFromBackend);

    } catch (error) {
        console.error("Backend connection failed:", error);
    }
}
testBackendConnection();