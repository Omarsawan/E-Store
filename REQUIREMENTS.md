# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
    - GET /products
- Show (args: product id)
    - GET /products/:id
- Create (args: Product)[token required]
    - POST /products
- Products by category (args: product category)
    - GET /products/category/:category_name

#### Users
- Index [token required]
    - GET /users
- Show (args: id)[token required]
    - GET /users/:id
- Create (args: User)
    - POST /users
- Sign in (args: User)
    - POST /users/signin

#### Orders
- Current Order by user (args: user id)[token required]
    - GET /orders/users
- Add products to Order (args: order id, body: product id)[token required]
    - POST /orders/:id/products
- Create order[token required]
    - POST /orders

## Data Shapes
#### Product
-  id
- name
- price
- category
##### Database table:
- Products (id: integer, name: varchar, price: integer, category: varchar)

#### User
- id
- firstName
- lastName
- password
##### Database table:
- Users (id: integer, first_name: varchar, last_name: varchar, password: varchar)

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)
##### Database tables:
- Orders (id: integer, user_id: integer[foreign key to users table], status: varchar)
- OrdersProducts (id: integer, order_id: integer[foreign key to orders table], product_id: integer[foreign key to products table], quantity: integer)

