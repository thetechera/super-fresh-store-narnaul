
import { query } from '../db.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { id } = request.query;

  if (typeof id !== 'string') {
    return response.status(400).json({ error: 'Invalid ID' });
  }

  if (request.method === 'PUT') {
    try {
      const { date, productId, productName, quantity, sellingPrice, totalPrice } = request.body;
      await query(
        'UPDATE sales SET date = $1, "productId" = $2, "productName" = $3, quantity = $4, "sellingPrice" = $5, "totalPrice" = $6 WHERE id = $7',
        [date, productId, productName, quantity, sellingPrice, totalPrice, id]
      );
      return response.status(200).json({ message: 'Sale updated successfully' });
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else if (request.method === 'DELETE') {
    try {
      await query('DELETE FROM sales WHERE id = $1', [id]);
      return response.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error)
      {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else {
    response.setHeader('Allow', ['PUT', 'DELETE']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
