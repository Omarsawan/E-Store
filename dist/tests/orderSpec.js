"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const product_1 = require("../models/product");
const user_1 = require("../models/user");
const database_1 = __importDefault(require("../database"));
const store = new order_1.OrderStore();
const product_store = new product_1.ProductStore();
const user_store = new user_1.UserStore();
describe('Order Model', () => {
    beforeAll(async function () {
        const connection = await database_1.default.connect();
        const sql = 'DELETE FROM order_products; ALTER SEQUENCE order_products_id_seq RESTART; DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART; DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART; DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART;';
        await connection.query(sql);
        connection.release();
        // @ts-ignore
        await product_store.create({
            name: 'water',
            price: 5,
            category: 'beverages'
        });
        // @ts-ignore
        await user_store.create({
            first_name: 'test',
            last_name: 'user',
            password: 'secretpass'
        });
    });
    it('should have an active order method', () => {
        expect(store.activeOrder).toBeDefined();
    });
    it('should have an add product method', () => {
        expect(store.addProduct).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('create method should add an order', async () => {
        // @ts-ignore
        const result = await store.create(1);
        expect(result).toEqual({
            id: 1,
            // @ts-ignore
            user_id: '1',
            status: 'active'
        });
    });
    it('add product method', async () => {
        const result = await store.addProduct(5, '1', '1', '1');
        expect(result).toEqual({
            // @ts-ignore
            id: 1,
            quantity: 5,
            // @ts-ignore
            order_id: '1',
            // @ts-ignore
            product_id: '1'
        });
    });
    it('active order method should return the active order', async () => {
        const result = await store.activeOrder('1');
        expect(result).toEqual([
            {
                // @ts-ignore
                quantity: '5',
                // @ts-ignore
                order_id: '1',
                // @ts-ignore
                product_id: '1'
            }
        ]);
    });
});
const server_1 = __importDefault(require("../server"));
const supertest_1 = __importDefault(require("supertest"));
const request = (0, supertest_1.default)(server_1.default);
describe('Order endpoints', () => {
    let TOKEN;
    beforeAll(async function () {
        const connection = await database_1.default.connect();
        const sql = 'DELETE FROM order_products; ALTER SEQUENCE order_products_id_seq RESTART; DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART; DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART;';
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
    it('create api should add an order', async () => {
        const response = await request
            .post('/orders')
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(200);
    });
    it('create api needs a token', async () => {
        const response = await request.post('/orders');
        expect(response.status).toBe(403);
    });
    it('create api needs a valid token', async () => {
        const response = await request
            .post('/orders')
            .set('Authorization', `Bearer 124.1244.2141`);
        expect(response.status).toBe(401);
    });
    it('add product api', async () => {
        const response = await request
            .post('/orders/1/products')
            .send({ productId: 1, quantity: 1 })
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(200);
    });
    it('current active order api should return the correct active order', async () => {
        const response = await request
            .get('/orders/users')
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(200);
    });
});
