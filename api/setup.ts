
import { query } from './db.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        quantity INT NOT NULL,
        "sellingPrice" DECIMAL(10, 2) NOT NULL
      );
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS sales (
        id VARCHAR(255) PRIMARY KEY,
        date DATE NOT NULL,
        "productId" VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
        "productName" VARCHAR(255),
        quantity INT NOT NULL,
        "sellingPrice" DECIMAL(10, 2) NOT NULL,
        "totalPrice" DECIMAL(10, 2) NOT NULL
      );
    `);
    await query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id VARCHAR(255) PRIMARY KEY,
        date DATE NOT NULL,
        "vendorName" VARCHAR(255),
        "productId" VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
        "productName" VARCHAR(255),
        quantity INT NOT NULL,
        "costPrice" DECIMAL(10, 2) NOT NULL,
        "totalPurchasePrice" DECIMAL(10, 2) NOT NULL
      );
    `);
    return response.status(200).json({ message: 'Database tables created successfully' });
  } catch (error) {
    return response.status(500).json({ error: (error as Error).message });
  }
}
