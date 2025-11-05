
import { query } from '../db.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    try {
      const { rows } = await query('SELECT * FROM sales ORDER BY date DESC;');
      return response.status(200).json(rows);
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else if (request.method === 'POST') {
    try {
      const { date, productId, productName, quantity, sellingPrice, totalPrice } = request.body;
      if (!date || !productId || !productName || !quantity || !sellingPrice || !totalPrice) {
        return response.status(400).json({ error: 'Missing required fields' });
      }

      // Generate next sales ID
      const lastIdResult = await query(`
        SELECT id FROM sales 
        ORDER BY CAST(SUBSTRING(id FROM 2) AS INTEGER) DESC 
        LIMIT 1;
      `);
      let nextId = 'S001';
      if (lastIdResult.rows.length > 0) {
          const lastId = lastIdResult.rows[0].id;
          const lastNum = parseInt(lastId.substring(1), 10);
          nextId = `S${String(lastNum + 1).padStart(3, '0')}`;
      }

      await query(
        'INSERT INTO sales (id, date, "productId", "productName", quantity, "sellingPrice", "totalPrice") VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [nextId, date, productId, productName, quantity, sellingPrice, totalPrice]
      );
      return response.status(201).json({ message: 'Sale added successfully' });
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else {
    response.setHeader('Allow', ['GET', 'POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
