"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const database_1 = __importDefault(require("../database"));
const store = new product_1.ProductStore();
describe('Product Model', () => {
    beforeAll(async function () {
        const connection = await database_1.default.connect();
        const sql = 'DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART;';
        await connection.query(sql);
        connection.release();
    });
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('should have a index By Category method', () => {
        expect(store.indexByCategory).toBeDefined();
    });
    it('create method should add a product', async () => {
        // @ts-ignore
        const result = await store.create({
            name: 'water',
            price: 5,
            category: 'beverages'
        });
        expect(result).toEqual({
            id: 1,
            name: 'water',
            price: 5,
            category: 'beverages'
        });
    });
    it('index method should return a list of products', async () => {
        const result = await store.index();
        expect(result).toEqual([
            {
                id: 1,
                name: 'water',
                price: 5,
                category: 'beverages'
            }
        ]);
    });
    it('show method should return the correct product', async () => {
        const result = await store.show('1');
        expect(result).toEqual({
            id: 1,
            name: 'water',
            price: 5,
            category: 'beverages'
        });
    });
    it('index by category method should return the products in the given category', async () => {
        // @ts-ignore
        await store.create({
            name: 'banana',
            price: 15,
            category: 'fruit'
        });
        const result = await store.indexByCategory('beverages');
        expect(result).toEqual([
            {
                id: 1,
                name: 'water',
                price: 5,
                category: 'beverages'
            }
        ]);
    });
});
const server_1 = __importDefault(require("../server"));
const supertest_1 = __importDefault(require("supertest"));
const request = (0, supertest_1.default)(server_1.default);
describe('Product endpoints', () => {
    let TOKEN;
    beforeAll(async function () {
        const connection = await database_1.default.connect();
        const sql = 'DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART; DELETE FROM users;';
        await connection.query(sql);
        connection.release();
        // @ts-ignore
        const res = await request.post('/users').send({
            first_name: 'user',
            last_name: 'test',
            password: 'password'
        });
        TOKEN = res.body;
    });
    it('create api should add a product', async () => {
        const response = await request
            .post('/products')
            .send({ name: 'apple', price: 20, category: 'fruit' })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(200);
    });
    it('create api needs a token', async () => {
        const response = await request
            .post('/products')
            .send({ name: 'apple', price: 20, category: 'fruit' });
        expect(response.status).toBe(403);
    });
    it('create api needs a valid token', async () => {
        const response = await request
            .post('/products')
            .send({ name: 'apple', price: 20, category: 'fruit' })
            .set('Authorization', `Bearer 124.1244.2141`);
        expect(response.status).toBe(401);
    });
    it('index api should return a list of products', async () => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: 1, name: 'apple', price: 20, category: 'fruit' }
        ]);
    });
    it('show api should return the correct product', async () => {
        const response = await request.get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            name: 'apple',
            price: 20,
            category: 'fruit'
        });
    });
    it('index by category api should return the products in the given category', async () => {
        const response = await request.get('/products/category/fruit');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { id: 1, name: 'apple', price: 20, category: 'fruit' }
        ]);
    });
});
