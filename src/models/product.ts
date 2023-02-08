import Client from '../database';

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM products;';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }

  async show(id: string): Promise<Product> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM products WHERE id=($1);';
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }

  async create(b: Product): Promise<Product> {
    const sql =
      'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
    const conn = await Client.connect();

    const result = await conn.query(sql, [b.name, b.price, b.category]);

    const product = result.rows[0];

    conn.release();

    return product;
  }
  async indexByCategory(category_name: string): Promise<Product[]> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM products where category=($1);';
    const result = await conn.query(sql, [category_name]);
    conn.release();
    return result.rows;
  }
}
