
import { query } from '../db.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    try {
      const { rows } = await query('SELECT * FROM purchases ORDER BY date DESC;');
      return response.status(200).json(rows);
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else if (request.method === 'POST') {
    try {
      const { date, vendorName, productId, productName, quantity, costPrice, totalPurchasePrice } = request.body;
       if (!date || !vendorName || !productId || !productName || !quantity || !costPrice || !totalPurchasePrice) {
        return response.status(400).json({ error: 'Missing required fields' });
      }
      
      // Generate next purchase ID
      const lastIdResult = await query(`
        SELECT id FROM purchases 
        ORDER BY CAST(SUBSTRING(id FROM 3) AS INTEGER) DESC 
        LIMIT 1;
      `);
      let nextId = 'PO001';
      if (lastIdResult.rows.length > 0) {
          const lastId = lastIdResult.rows[0].id;
          const lastNum = parseInt(lastId.substring(2), 10);
          nextId = `PO${String(lastNum + 1).padStart(3, '0')}`;
      }
      
      await query(
        'INSERT INTO purchases (id, date, "vendorName", "productId", "productName", quantity, "costPrice", "totalPurchasePrice") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [nextId, date, vendorName, productId, productName, quantity, costPrice, totalPurchasePrice]
      );
      return response.status(201).json({ message: 'Purchase added successfully' });
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else {
    response.setHeader('Allow', ['GET', 'POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
