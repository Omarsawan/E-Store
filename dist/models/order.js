'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require('../database'));
class OrderStore {
  async activeOrder(user_id) {
    const conn = await database_1.default.connect();
    const sql = `SELECT order_id, product_id, SUM(quantity) as quantity FROM order_products INNER JOIN orders ON order_products.order_id=orders.id WHERE user_id=($1) AND status='active' GROUP BY order_id, product_id;`;
    const result = await conn.query(sql, [user_id]);
    conn.release();
    return result.rows;
  }
  async create(user_id) {
    const conn = await database_1.default.connect();
    const active_order_sql = `SELECT * FROM orders WHERE user_id=($1) AND status='active';`;
    const active_order_result = await conn.query(active_order_sql, [user_id]);
    if (active_order_result.rows.length != 0) {
      conn.release();
      throw new Error('User has already an active order');
    }
    const sql = `INSERT INTO orders (user_id, status) VALUES($1, 'active') RETURNING *`;
    const result = await conn.query(sql, [user_id]);
    const order = result.rows[0];
    conn.release();
    return order;
  }
  async addProduct(quantity, order_id, product_id, user_id) {
    const ordersql = 'SELECT * FROM orders WHERE id=($1)';
    //@ts-ignore
    const conn = await database_1.default.connect();
    const order_result = await conn.query(ordersql, [order_id]);
    const active_order = order_result.rows[0];
    if (active_order.status !== 'active') {
      conn.release();
      throw new Error(
        `Could not add product ${product_id} to order ${order_id} because order status is ${active_order.status}`
      );
    }
    if (user_id != active_order.user_id) {
      throw new Error(
        `Logged in user can not add product to this order with id: ${order_id}`
      );
    }
    const sql =
      'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
    const result = await conn.query(sql, [quantity, order_id, product_id]);
    const order = result.rows[0];
    conn.release();
    return order;
  }
}
exports.OrderStore = OrderStore;
