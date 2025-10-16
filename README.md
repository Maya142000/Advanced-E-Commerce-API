# Advanced-E-Commerce-API
The Advanced E-Commerce API is a Node.js and MongoDB backend for handling complex e-commerce workflows, including cart management, checkout with stock reservation, and payment processing. It supports asynchronous operations, multi-stage order management, and role-based access control for users and admins.


## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access (User/Admin).
- **Product Management**: Admin can add, update, delete, and list products with filtering, sorting, and pagination.
- **Cart Management**: Users can add, update, and remove products in their cart.
- **Order Workflow**: Checkout reserves stock, payment finalizes orders, and orders automatically cancel if unpaid for 15 minutes.
- **Stock Management**: Atomic stock reservation prevents overselling.
- **Order Status Management**: Users track orders; Admin can update status to SHIPPED or DELIVERED.
- **Background Jobs**: Asynchronous job queue simulates sending email notifications.
- **Pagination & Filtering**: Supported on all listing endpoints (products, orders).

## Data Models

- **User**: `{ name, email, password (hashed), role ('USER' | 'ADMIN') }`
- **Product**: `{ name, price, description, availableStock, reservedStock }`
- **Cart**: `{ userId, items: [ { productId, quantity } ] }`
- **Order**: `{ userId, items: [ { productId, quantity, priceAtPurchase } ], totalAmount, status, createdAt, updatedAt }`
- **Payment**: `{ orderId, transactionId, amount, status ('SUCCESS' | 'FAILED') }`

## API Endpoints

### **Authentication (`/auth`)**
- `POST http://localhost:5000/api/v1/users/register` → Register a new user.
- `POST http://localhost:5000/api/v1/users/login` → Login and get JWT token.

### **Products (`/products`)**
- `POST http://localhost:5000/api/v1/products/addProduct` → Add a product (Admin only).
- `PUT http://localhost:5000/api/v1/products/updatedProduct/:id` → Update a product (Admin only).
- `DELETE http://localhost:5000/api/v1/products/deleteProduct/:id` → Delete a product (Admin only).
- `GET http://localhost:5000/api/v1/products/listProducts` → List products with pagination, sorting, filtering.

### **Cart (`/cart`)**
- `GET http://localhost:5000/api/v1/carts/getCart` → View user's cart.
- `POST http://localhost:5000/api/v1/carts/addItem` → Add/update item in cart.
- `DELETE http://localhost:5000/api/v1/carts/removeItem/:id` → Remove item from cart.

### **Orders (`/orders`)**
- `POST http://localhost:5000/api/v1/orders/checkout` → Checkout user's cart and reserve stock.
- `POST http://localhost:5000/api/v1/orders/payOrder/pay/:id` → Simulate payment and finalize order.
- `GET http://localhost:5000/api/v1/orders/getOrders` → List user's orders with pagination.
- `GET http://localhost:5000/api/v1/orders/getOrderById/:id` → View single order details.

### **Admin (`/admin`)**
- `GET http://localhost:5000/api/v1/admin/listAllOrders` → List all orders with pagination/filtering.
- `PATCH http://localhost:5000/api/v1/admin/updateStatus/:id` → Update order status (e.g., SHIPPED/DELIVERED).

## Technical Details

- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi for request body validation
- **Error Handling**: Centralized error-handling middleware for consistent responses
- **Background Jobs**: Simple in-memory job queue (replaceable with Redis/Bull in production)


## Installation

```bash
git clone <repo-url>
cd advanced-ecommerce-api
npm install
cp .env.example .env
npm start