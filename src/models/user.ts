import Client from '../database';
import bcrypt from 'bcrypt';

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users;';
    const result = await conn.query(sql);
    conn.release();
    return result.rows;
  }

  async show(id: string): Promise<User> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users WHERE id=($1);';
    const result = await conn.query(sql, [id]);
    conn.release();
    return result.rows[0];
  }

  async create(b: User): Promise<User> {
    const hash = bcrypt.hashSync(
      b.password + BCRYPT_PASSWORD,
      parseInt(SALT_ROUNDS as string)
    );
    const sql =
      'INSERT INTO users (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *';
    const conn = await Client.connect();
    const result = await conn.query(sql, [b.first_name, b.last_name, hash]);
    const user = result.rows[0];

    conn.release();

    return user;
  }

  async authenticate(
    first_name: string,
    last_name: string,
    password: string
  ): Promise<User> {
    const sql = 'SELECT * FROM users WHERE first_name=($1) AND last_name=($2)';
    const conn = await Client.connect();
    const result = await conn.query(sql, [first_name, last_name]);
    conn.release();
    if (result.rows.length) {
      const user = result.rows[0];
      if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
        return user;
      }
      throw new Error('password is not valid');
    }

    throw new Error('name is not valid');
  }
}
