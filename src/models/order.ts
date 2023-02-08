import Client from '../database';

export type Order = {
  id: number;
  user_id: number;
  status: string;
};
export type OrderProduct = {
  quantity: number;
  order_id: number;
  product_id: number;
};

export class OrderStore {
  async activeOrder(user_id: string): Promise<OrderProduct[]> {
    const conn = await Client.connect();
    const sql = `SELECT order_id, product_id, SUM(quantity) as quantity FROM order_products INNER JOIN orders ON order_products.order_id=orders.id WHERE user_id=($1) AND status='active' GROUP BY order_id, product_id;`;
    const result = await conn.query(sql, [user_id]);
    conn.release();
    return result.rows;
  }

  async create(user_id: string): Promise<Order> {
    const conn = await Client.connect();
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

  async addProduct(
    quantity: number,
    order_id: string,
    product_id: string,
    user_id: string
  ): Promise<OrderProduct> {
    const ordersql = 'SELECT * FROM orders WHERE id=($1)';
    //@ts-ignore
    const conn = await Client.connect();

    const order_result = await conn.query(ordersql, [order_id]);

    const active_order = order_result.rows[0] as Order;

    if (active_order.status !== 'active') {
      conn.release();
      throw new Error(
        `Could not add product ${product_id} to order ${order_id} because order status is ${active_order.status}`
      );
    }
    if (user_id != (active_order.user_id as unknown as string)) {
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
