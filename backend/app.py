from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import IntegrityError
from dotenv import load_dotenv


# --------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------------------------

load_dotenv()

SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")


# --------------------------------------------------
# FLASK APP
# --------------------------------------------------

app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# DATABASE CONNECTION
# --------------------------------------------------

def get_db_connection():
    connection = psycopg2.connect(
        SUPABASE_DB_URL
    )

    connection.cursor_factory = RealDictCursor

    return connection


# --------------------------------------------------
# TEST SUPABASE CONNECTION
# --------------------------------------------------

try:
    connection = get_db_connection()
    print("Supabase connection successful!")
    connection.close()

except Exception as error:
    print("Supabase connection failed:", error)


# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.route("/")
def home():
    return "ShopEase Backend is running!"


# --------------------------------------------------
# ADD PRODUCT
# --------------------------------------------------

@app.route("/api/products", methods=["POST"])
def add_product():

    data = request.get_json()

    name = data.get("name")
    price = data.get("price")
    image = data.get("image")
    description = data.get("description")

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO products
            (name, price, image, description)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, (
            name,
            price,
            image,
            description
        ))

        product_id = cursor.fetchone()["id"]

        connection.commit()

        cursor.close()

        return jsonify({
            "message": "Product added successfully",
            "id": product_id
        }), 201

    except Exception as error:

        connection.rollback()

        print("Add product error:", error)

        return jsonify({
            "message": "Failed to add product"
        }), 500

    finally:

        connection.close()


# --------------------------------------------------
# USER REGISTRATION
# --------------------------------------------------

@app.route("/api/register", methods=["POST"])
def register_user():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    hashed_password = generate_password_hash(password)

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO users
            (name, email, password)
            VALUES (%s, %s, %s)
        """, (
            name,
            email,
            hashed_password
        ))

        connection.commit()

        cursor.close()

        return jsonify({
            "message": "Registration successful"
        }), 201

    except IntegrityError:

        connection.rollback()

        return jsonify({
            "message": "Email already registered"
        }), 409

    except Exception as error:

        connection.rollback()

        print("Registration error:", error)

        return jsonify({
            "message": "Registration failed"
        }), 500

    finally:

        connection.close()


# --------------------------------------------------
# USER LOGIN
# --------------------------------------------------

@app.route("/api/login", methods=["POST"])
def login_user():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                name,
                email,
                password
            FROM users
            WHERE email = %s
        """, (email,))

        user = cursor.fetchone()

        cursor.close()

        connection.close()

        if user and check_password_hash(
            user["password"],
            password
        ):

            return jsonify({
                "message": "Login successful",
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"]
                }
            }), 200

        return jsonify({
            "message": "Invalid email or password"
        }), 401

    except Exception as error:

        connection.close()

        print("Login error:", error)

        return jsonify({
            "message": "Login failed"
        }), 500


# --------------------------------------------------
# GET ALL PRODUCTS
# --------------------------------------------------

@app.route("/api/products")
def get_products():

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                name,
                price,
                image,
                description
            FROM products
            ORDER BY id
        """)

        products = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(products)

    except Exception as error:

        connection.close()

        print("Get products error:", error)

        return jsonify({
            "message": "Failed to load products"
        }), 500


# --------------------------------------------------
# ADD PRODUCT TO CART
# --------------------------------------------------

@app.route("/api/cart", methods=["POST"])
def add_to_cart():

    data = request.get_json()

    user_id = data.get("user_id")
    product_id = data.get("product_id")

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO cart
            (user_id, product_id, quantity)
            VALUES (%s, %s, %s)
        """, (
            user_id,
            product_id,
            1
        ))

        connection.commit()

        cursor.close()

        return jsonify({
            "message": "Product added to cart successfully"
        }), 201

    except Exception as error:

        connection.rollback()

        print("Add to cart error:", error)

        return jsonify({
            "message": "Failed to add product to cart"
        }), 500

    finally:

        connection.close()


# --------------------------------------------------
# GET USER CART
# --------------------------------------------------

@app.route("/api/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                cart.id,
                cart.product_id,
                cart.quantity,
                products.name,
                products.price,
                products.image,
                products.description
            FROM cart
            JOIN products
            ON cart.product_id = products.id
            WHERE cart.user_id = %s
            ORDER BY cart.id DESC
        """, (user_id,))

        cart_items = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(cart_items)

    except Exception as error:

        connection.close()

        print("Get cart error:", error)

        return jsonify({
            "message": "Failed to load cart"
        }), 500


# --------------------------------------------------
# REMOVE PRODUCT FROM CART
# --------------------------------------------------

@app.route("/api/cart/<int:cart_id>", methods=["DELETE"])
def remove_from_cart(cart_id):

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            DELETE FROM cart
            WHERE id = %s
        """, (cart_id,))

        connection.commit()

        cursor.close()

        return jsonify({
            "message": "Product removed from cart successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        print("Remove cart error:", error)

        return jsonify({
            "message": "Failed to remove product"
        }), 500

    finally:

        connection.close()


# --------------------------------------------------
# PLACE ORDER
# --------------------------------------------------

@app.route("/api/orders", methods=["POST"])
def place_order():

    data = request.get_json()

    user_id = data.get("user_id")
    product_id = data.get("product_id")
    quantity = data.get("quantity", 1)
    total_price = data.get("total_price")

    customer_name = data.get("customer_name")
    address = data.get("address")
    phone = data.get("phone")

    payment_method = data.get(
        "payment_method",
        "Cash on Delivery"
    )

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO orders (
                user_id,
                product_id,
                quantity,
                total_price,
                customer_name,
                address,
                phone,
                payment_method
            )
            VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
        """, (
            user_id,
            product_id,
            quantity,
            total_price,
            customer_name,
            address,
            phone,
            payment_method
        ))

        connection.commit()

        cursor.close()

        return jsonify({
            "message": "Order placed successfully"
        }), 201

    except Exception as error:

        connection.rollback()

        print("Place order error:", error)

        return jsonify({
            "message": "Failed to place order"
        }), 500

    finally:

        connection.close()


# --------------------------------------------------
# GET USER ORDERS
# --------------------------------------------------

@app.route("/api/orders/<int:user_id>", methods=["GET"])
def get_orders(user_id):

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                orders.id,
                orders.product_id,
                orders.quantity,
                orders.total_price,
                orders.order_date,
                orders.status,
                products.name,
                products.image
            FROM orders
            JOIN products
            ON orders.product_id = products.id
            WHERE orders.user_id = %s
            ORDER BY orders.order_date DESC
        """, (user_id,))

        orders = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(orders)

    except Exception as error:

        connection.close()

        print("Get orders error:", error)

        return jsonify({
            "message": "Failed to load orders"
        }), 500


# --------------------------------------------------
# CLEAR USER CART
# --------------------------------------------------

@app.route("/api/cart/user/<int:user_id>", methods=["DELETE"])
def clear_cart(user_id):

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            DELETE FROM cart
            WHERE user_id = %s
        """, (user_id,))

        connection.commit()

        cursor.close()

        return jsonify({
            "message": "Cart cleared successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        print("Clear cart error:", error)

        return jsonify({
            "message": "Failed to clear cart"
        }), 500

    finally:

        connection.close()


# --------------------------------------------------
# GET ALL CUSTOMERS
# --------------------------------------------------

@app.route("/api/customers", methods=["GET"])
def get_customers():

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                name,
                email
            FROM users
            ORDER BY id DESC
        """)

        customers = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(customers)

    except Exception as error:

        connection.close()

        print("Get customers error:", error)

        return jsonify({
            "message": "Failed to load customers"
        }), 500


# --------------------------------------------------
# GET ALL ADMIN ORDERS
# --------------------------------------------------

@app.route("/api/admin/orders", methods=["GET"])
def get_all_orders():

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                orders.id,
                orders.user_id,
                orders.product_id,
                orders.quantity,
                orders.total_price,
                orders.order_date,
                orders.status,
                orders.customer_name,
                orders.address,
                orders.phone,
                orders.payment_method,

                users.name AS customer_name_from_users,
                users.email AS customer_email,

                products.name AS product_name,
                products.image AS product_image

            FROM orders

            JOIN users
            ON orders.user_id = users.id

            JOIN products
            ON orders.product_id = products.id

            ORDER BY orders.order_date DESC
        """)

        orders = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify(orders)

    except Exception as error:

        connection.close()

        print("Get admin orders error:", error)

        return jsonify({
            "message": "Failed to load admin orders"
        }), 500


# --------------------------------------------------
# UPDATE ORDER STATUS
# --------------------------------------------------

@app.route(
    "/api/admin/orders/<int:order_id>/status",
    methods=["PUT"]
)
def update_order_status(order_id):

    data = request.get_json()

    status = data.get("status")

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            UPDATE orders
            SET status = %s
            WHERE id = %s
        """, (
            status,
            order_id
        ))

        connection.commit()

        cursor.close()

        return jsonify({
            "message": "Order status updated successfully"
        }), 200

    except Exception as error:

        connection.rollback()

        print("Update order status error:", error)

        return jsonify({
            "message": "Failed to update order status"
        }), 500

    finally:

        connection.close()


# --------------------------------------------------
# ADMIN LOGIN
# --------------------------------------------------

@app.route("/api/admin/login", methods=["POST"])
def admin_login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    connection = get_db_connection()

    try:

        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                name,
                email,
                password
            FROM admins
            WHERE email = %s
        """, (email,))

        admin = cursor.fetchone()

        cursor.close()
        connection.close()

        if admin and check_password_hash(
            admin["password"],
            password
        ):

            return jsonify({
                "message": "Admin login successful",
                "admin": {
                    "id": admin["id"],
                    "name": admin["name"],
                    "email": admin["email"]
                }
            }), 200

        return jsonify({
            "message": "Invalid admin email or password"
        }), 401

    except Exception as error:

        connection.close()

        print("Admin login error:", error)

        return jsonify({
            "message": "Admin login failed"
        }), 500


# --------------------------------------------------
# RUN FLASK SERVER
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)