
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
      const { name, category, quantity, sellingPrice } = request.body;
      await query(
        'UPDATE products SET name = $1, category = $2, quantity = $3, "sellingPrice" = $4 WHERE id = $5',
        [name, category, quantity, sellingPrice, id]
      );
      return response.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else if (request.method === 'DELETE') {
    try {
      await query('DELETE FROM products WHERE id = $1', [id]);
      return response.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else {
    response.setHeader('Allow', ['PUT', 'DELETE']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
