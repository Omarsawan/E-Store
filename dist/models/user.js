"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;
class UserStore {
    async index() {
        const conn = await database_1.default.connect();
        const sql = 'SELECT * FROM users;';
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
    }
    async show(id) {
        const conn = await database_1.default.connect();
        const sql = 'SELECT * FROM users WHERE id=($1);';
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
    }
    async create(b) {
        const hash = bcrypt_1.default.hashSync(b.password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS));
        const sql = 'INSERT INTO users (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *';
        const conn = await database_1.default.connect();
        const result = await conn.query(sql, [b.first_name, b.last_name, hash]);
        const user = result.rows[0];
        conn.release();
        return user;
    }
    async authenticate(first_name, last_name, password) {
        const sql = 'SELECT * FROM users WHERE first_name=($1) AND last_name=($2)';
        const conn = await database_1.default.connect();
        const result = await conn.query(sql, [first_name, last_name]);
        conn.release();
        if (result.rows.length) {
            const user = result.rows[0];
            if (bcrypt_1.default.compareSync(password + BCRYPT_PASSWORD, user.password)) {
                return user;
            }
            throw new Error('password is not valid');
        }
        throw new Error('name is not valid');
    }
}
exports.UserStore = UserStore;
