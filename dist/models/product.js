'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require('../database'));
class ProductStore {
  async index() {
    const conn = await database_1.default.connect();
    const sql = 'SELECT * FROM products;';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }
  async show(id) {
    const conn = await database_1.default.connect();
    const sql = 'SELECT * FROM products WHERE id=($1);';
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }
  async create(b) {
    const sql =
      'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
    const conn = await database_1.default.connect();
    const result = await conn.query(sql, [b.name, b.price, b.category]);
    const product = result.rows[0];
    conn.release();
    return product;
  }
  async indexByCategory(category_name) {
    const conn = await database_1.default.connect();
    const sql = 'SELECT * FROM products where category=($1);';
    const result = await conn.query(sql, [category_name]);
    conn.release();
    return result.rows;
  }
}
exports.ProductStore = ProductStore;
