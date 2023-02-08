"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const database_1 = __importDefault(require("../database"));
const store = new user_1.UserStore();
describe('User Model', () => {
    beforeAll(async function () {
        const connection = await database_1.default.connect();
        const sql = 'DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART;';
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
    it('should have a signin method', () => {
        expect(store.authenticate).toBeDefined();
    });
    it('create method should add a user', async () => {
        // @ts-ignore
        const result = await store.create({
            first_name: 'test',
            last_name: 'user',
            password: 'secretpass'
        });
        expect(result.id).toEqual(1);
        expect(result.first_name).toEqual('test');
        expect(result.last_name).toEqual('user');
    });
    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result.length).toEqual(1);
        expect(result[0].id).toEqual(1);
        expect(result[0].first_name).toEqual('test');
        expect(result[0].last_name).toEqual('user');
    });
    it('show method should return the correct user', async () => {
        const result = await store.show('1');
        expect(result.id).toEqual(1);
        expect(result.first_name).toEqual('test');
        expect(result.last_name).toEqual('user');
    });
    it('signin method should return the correct user', async () => {
        const result = await store.authenticate('test', 'user', 'secretpass');
        expect(result.id).toEqual(1);
        expect(result.first_name).toEqual('test');
        expect(result.last_name).toEqual('user');
    });
    it('signin method should expects first_name and last_name to be in the database', async () => {
        await expectAsync(store.authenticate('does not exist', 'user', 'secretpass')).toBeRejectedWithError('name is not valid');
    });
    it('signin method should expects password to be valid', async () => {
        await expectAsync(store.authenticate('test', 'user', 'notsecretpass')).toBeRejectedWithError('password is not valid');
    });
});
const server_1 = __importDefault(require("../server"));
const supertest_1 = __importDefault(require("supertest"));
const request = (0, supertest_1.default)(server_1.default);
describe('User endpoints', () => {
    let TOKEN;
    beforeAll(async function () {
        const connection = await database_1.default.connect();
        const sql = 'DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART; DELETE FROM users;';
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
    it('create api should add a user', async () => {
        const response = await request.post('/users').send({
            first_name: 'user2',
            last_name: 'test',
            password: 'password'
        });
        expect(response.status).toBe(200);
    });
    it('index api should return a list of users', async () => {
        const response = await request
            .get('/users')
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(200);
    });
    it('show api should return the correct user', async () => {
        const response = await request
            .get('/users/1')
            .set('Authorization', `Bearer ${TOKEN}`);
        expect(response.status).toBe(200);
    });
    it('signin api should return a token', async () => {
        const response = await request.post('/users/signin').send({
            first_name: 'user2',
            last_name: 'test',
            password: 'password'
        });
        expect(response.status).toBe(200);
    });
});
