# Storefront Backend Project
A simple E-Commerce project
## Getting Started

- This repo contains a basic Node and Express app. To get started, clone this repo and run `yarn` in your terminal at the project root.
    - if yarn is not installed, install yarn using ```npm install yarn -g```
- The server is running on port 3000, while the database is running on port 5432
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