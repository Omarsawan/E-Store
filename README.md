# Storefront Backend Project
A simple E-Commerce project
## Getting Started

- This repo contains a basic Node and Express app. To get started, clone this repo and run `yarn` in your terminal at the project root.
    - if yarn is not installed, install yarn using ```npm install yarn -g```
- The server is running on port 3000, while the database is running on port 5432
- The APIs are written using NodeJS, and database used is PostgreSQL
## Project setup

### 1. PSQL user creation
- Sign in psql ```psql postgres```
- Create a user in psql as follows:
    - username: store_manager
    - password: store_password
    - You can do so by writing this command:
 ```bash
CREATE ROLE store_manager SUPERUSER LOGIN PASSWORD 'store_password';
```
- Then create two database one with name store_manager and other is store_manager_test
    - You can do so by writing these commands:
 ```bash
CREATE DATABASE store_manager;
```
 ```bash
CREATE DATABASE store_manager_test;
```
### 2. Database migration
- Install db-migrate: ```npm install db-migrate -g```
- Run this commands in your terminal at the root directory of the project for the migration of the main database
 ```bash
db-migrate --env dev up;
```
- Run this commands in your terminal at the root directory of the project for the migration of the test database
 ```bash
db-migrate --env test up;
```

### 3. Scripts
 - To build the project and convert typescript into javascript: 
 ```bash
npm run build
```
 - To run test cases: 
 ```bash
npm run test
```
 - To run the server: 
 ```bash
npm run watch
```
 - To run prettier and format javascript files: 
 ```bash
npm run prettierjs
```
 - To run prettier and format typescript files: 
 ```bash
npm run prettierts
```
### 4. Environment variables
- You should create .env file with the following variables:
    - POSTGRES_HOST=127.0.0.1
    - POSTGRES_PORT=5432
    - POSTGRES_DB=store_manager
    - POSTGRES_TEST_DB=store_manager_test
    - POSTGRES_USER=store_manager
    - POSTGRES_PASSWORD=store_password
    - ENV=test
    - BCRYPT_PASSWORD=strongone
    - SALT_ROUNDS=10
    - TOKEN_SECRET=shh_itissecret

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

## Data Models
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
