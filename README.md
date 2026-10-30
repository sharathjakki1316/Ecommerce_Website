# ShopEase – E-Commerce Website

**A Full-Stack E-Commerce Website Developed as Part of the Corizo Internship Program (2026)**

ShopEase is a web-based e-commerce application that provides customers with an online shopping experience and administrators with tools to manage products, customers, and orders.

The project is developed using HTML, CSS, JavaScript, Python, and Flask, with database connectivity through PostgreSQL. It demonstrates the integration of frontend development, backend API development, database operations, and website deployment.

---

## 🌐 Live Demo

| Component | Link |
|---|---|
| **Live Website** | [https://sharathjakki1316.github.io/Ecommerce_Website/](https://sharathjakki1316.github.io/Ecommerce_Website/) |
| **Admin Login** | [https://sharathjakki1316.github.io/Ecommerce_Website/admin/admin-login.html](https://sharathjakki1316.github.io/Ecommerce_Website/admin/admin-login.html) |
| **Backend API** | [https://ecommerce-website-gzq1.onrender.com](https://ecommerce-website-gzq1.onrender.com) |
| **GitHub Repository** | [https://github.com/sharathjakki1316/Ecommerce_Website](https://github.com/sharathjakki1316/Ecommerce_Website) |
| **Project Report** | [ShopEase E-Commerce Website Report](Project_Report/ShopEase%20E-Commerce%20Website.pdf) |

---

## 📌 Project Overview

ShopEase is designed to simplify online shopping by providing a platform where customers can browse products, register for an account, log in, manage their shopping cart, and place orders.

The application also includes an administrative module that allows administrators to access a dashboard, add products, view customer information, and manage orders.

The project follows a frontend-backend architecture in which the frontend communicates with backend API endpoints to perform application operations.

---

## ✨ Features

### 👤 Customer Features

- User registration.
- User login.
- Product browsing.
- Product listing with images.
- Shopping cart management.
- Adding and removing cart items.
- Order placement.
- Order-related information.

### 🔐 Admin Features

- Administrator login.
- Admin dashboard.
- Product management.
- Adding new products.
- Customer information viewing.
- Order viewing and management.

### ⚙️ Application Features

- Responsive web interface where implemented.
- Frontend and backend integration.
- REST-style API endpoints.
- Database connectivity.
- Separate customer and administrator interfaces.
- Hosted frontend and backend components.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure of web pages |
| CSS3 | Styling and layout |
| JavaScript | Frontend interactivity |
| Python | Backend programming |
| Flask | Backend framework and API development |
| PostgreSQL | Relational database |
| psycopg2-binary | PostgreSQL connectivity |
| Flask-CORS | Cross-origin request configuration |
| python-dotenv | Environment-based configuration |
| Gunicorn | WSGI server |
| Git | Version control |
| GitHub | Source code hosting |
| GitHub Pages | Frontend hosting |
| Render | Backend hosting |
| Supabase | Hosted PostgreSQL database |

---

## 🏗️ System Architecture

ShopEase follows a three-layer web application architecture.

1. **Frontend Layer:** HTML, CSS, and JavaScript provide the customer and administrator interfaces.
2. **Backend Layer:** Python and Flask handle API requests, application logic, authentication-related operations, and data processing.
3. **Database Layer:** PostgreSQL stores and retrieves application information through the backend database connection.

### Application Workflow

```text
        Customer / Administrator
                  |
                  v
          Frontend Interface
          HTML, CSS, JavaScript
                  |
                  v
            Flask Backend
             Python API
                  |
                  v
             PostgreSQL
              Database
```

---

## 📂 Project Structure

The main project directories and files are organized as follows:

```text
Ecommerce_Website/
│
├── index.html
├── style.css
├── script.js
│
├── admin/
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── add-product.html
│   ├── view-customers.html
│   └── view-orders.html
│
├── pages/
│   ├── registration and login pages
│   ├── product pages
│   ├── cart pages
│   └── order pages
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── other backend files
│
├── images/
│   └── product images
│
├── Project_Report/
│   └── ShopEase E-Commerce Website.pdf
│
└── README.md
```

*Note: The structure above highlights the main project components. Individual filenames and additional files may vary in the repository.*

---

## 🚀 Installation and Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/sharathjakki1316/Ecommerce_Website.git
```

### 2. Navigate to the Project Directory

```bash
cd Ecommerce_Website
```

### 3. Install Python Dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Configure Environment Variables

Configure the required database connection and other environment variables using a local `.env` file in the backend directory.

Use the exact variable names expected by `backend/app.py`.

**Important:** Never upload `.env` files, database passwords, API keys, or other sensitive credentials to a public GitHub repository.

### 5. Start the Backend

```bash
python backend/app.py
```

The backend should start on the host and port configured in the Flask application.

### 6. Open the Frontend

Open `index.html` in a web browser or use a local development server.

Ensure that the frontend API configuration points to the backend address being used.

---

## 🔗 Backend API Endpoints

The project includes the following API routes:

| API Endpoint | Purpose |
|---|---|
| `/api/products` | Product-related operations |
| `/api/register` | User registration |
| `/api/login` | User login |
| `/api/cart` | Shopping cart operations |
| `/api/orders` | Order-related operations |
| `/api/customers` | Customer-related operations |
| `/api/admin/login` | Administrator login |

The supported HTTP methods, request formats, and response structures depend on the actual backend route implementations.

---

## 🧪 Testing

The project report documents testing of the following application areas:

- Homepage and user interface.
- Registration and login.
- Product browsing.
- Shopping cart operations.
- Order operations.
- Admin authentication.
- Product management.
- Customer and order viewing.
- Deployment and API connectivity.

The reported test status for these categories is **Passed**.

---

## ☁️ Deployment

The application uses separate hosting services for its frontend and backend.

| Component | Hosting Service |
|---|---|
| Frontend | GitHub Pages |
| Backend | Render |
| Database | Supabase PostgreSQL |

This deployment structure allows the frontend to communicate with the hosted Flask backend, which connects to the configured database.

---

## 🔮 Future Enhancements

Possible improvements for future versions include:

- Online payment gateway integration.
- Product search and filtering.
- Improved authentication and security.
- Order tracking.
- Product reviews and ratings.
- Improved mobile responsiveness.
- Inventory management.
- Email notifications.
- Performance optimization.
- Reporting and analytics dashboard.

---

## 👥 Project Team

**Organization:** Corizo Edutech Private Limited

**Project:** ShopEase – E-Commerce Website Development

**Year:** 2026

### Team Members

1. Venkata Sharath Kumar Jakki
2. Shrati Tirumaleshwar Hedge
3. SVVVS. Bhaskar
4. Praadeep S
5. Dhanvi S

---

## 📄 Project Documentation

The complete internship project report contains the project introduction, objectives, system requirements, architecture, technologies, implementation, testing, team contributions, conclusion, and future enhancements.

[View ShopEase Project Report](Project_Report/ShopEase%20E-Commerce%20Website.pdf)

---

## 🎯 Learning Outcomes

Through this internship project, we gained practical experience in:

- Frontend web development.
- Backend development using Python and Flask.
- Database connectivity and operations.
- Frontend-backend integration.
- API development.
- Git and GitHub version control.
- Website deployment.
- Team collaboration and project documentation.

---

## 📜 Acknowledgement

This project was developed as part of the internship program at **Corizo Edutech Private Limited**.

We sincerely thank Corizo and our mentors for their guidance, support, and opportunity to gain practical experience in full-stack web development.

---

**Developed with dedication by the ShopEase Project Team – 2026.**
