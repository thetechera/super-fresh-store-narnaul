
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
      const { date, vendorName, productId, productName, quantity, costPrice, totalPurchasePrice } = request.body;
      await query(
        'UPDATE purchases SET date = $1, "vendorName" = $2, "productId" = $3, "productName" = $4, quantity = $5, "costPrice" = $6, "totalPurchasePrice" = $7 WHERE id = $8',
        [date, vendorName, productId, productName, quantity, costPrice, totalPurchasePrice, id]
      );
      return response.status(200).json({ message: 'Purchase updated successfully' });
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else if (request.method === 'DELETE') {
    try {
      await query('DELETE FROM purchases WHERE id = $1', [id]);
      return response.status(200).json({ message: 'Purchase deleted successfully' });
    } catch (error) {
      return response.status(500).json({ error: (error as Error).message });
    }
  } else {
    response.setHeader('Allow', ['PUT', 'DELETE']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
