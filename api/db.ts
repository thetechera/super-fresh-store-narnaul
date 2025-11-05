import pg from 'pg';

let pool: pg.Pool | null = null;

const getPool = () => {
  if (pool) {
    return pool;
  }
  if (!process.env.POSTGRES_URL) {
    throw new Error("Database connection string 'POSTGRES_URL' is not set in environment variables.");
  }
  pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return pool;
};

export const query = (text: string, params?: any[]) => {
  const dbPool = getPool();
  return dbPool.query(text, params);
};