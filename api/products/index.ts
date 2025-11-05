
import { query } from '../db.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    try {
      const { rows } = await query('SELECT * FROM products ORDER BY id ASC;');
      return response.status(200).json(rows);
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
 } else if (request.method === 'POST') {
  try {
    const { name, category, quantity, sellingPrice } = request.body;

    if (!name || !category || quantity == null || sellingPrice == null) {
      return response.status(400).json({ error: 'Missing required fields' });
    }

    // Yaha se ID generate hogi
    const lastIdResult = await query(`
      SELECT id FROM products
      ORDER BY CAST(SUBSTRING(id FROM 2) AS INTEGER) DESC
      LIMIT 1;
    `);

    let nextId = 'P001';
    if (lastIdResult.rows.length > 0) {
      const lastId = lastIdResult.rows[0].id; // Example: P003
      const lastNum = parseInt(lastId.substring(1), 10); // 3
      nextId = `P${String(lastNum + 1).padStart(3, '0')}`; // P004
    }

    // Insert product
    await query(
      `INSERT INTO products (id, name, category, quantity, "sellingPrice")
      VALUES ($1, $2, $3, $4, $5)`,
      [nextId, name, category, quantity, sellingPrice]
    );

    return response.status(201).json({ message: 'Product added successfully', id: nextId });

  } catch (error) {
    console.error("POST /products error:", error);
    return response.status(500).json({ error: (error as Error).message });
  }
}
