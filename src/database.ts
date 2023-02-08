import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  ENV
} = process.env;

let client: Pool;
console.log(ENV);

if (ENV === 'test') {
  client = new Pool({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT as unknown as number,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  });
} else {
  client = new Pool({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT as unknown as number,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD
  });
}

export default client;
