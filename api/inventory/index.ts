import { query } from '../db.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  try {
    const { rows } = await query(`
      SELECT
        p.id AS "productId",
        p.name AS "productName",
        p.category,
        p.quantity AS "initialQuantity",
        COALESCE(purchases_sum.total_purchased, 0) AS "quantityPurchase",
        COALESCE(sales_sum.total_sold, 0) AS "quantitySale",
        (p.quantity + COALESCE(purchases_sum.total_purchased, 0) - COALESCE(sales_sum.total_sold, 0)) AS stocks
      FROM products p
      LEFT JOIN (
        SELECT "productId", SUM(quantity) AS total_purchased
        FROM purchases
        GROUP BY "productId"
      ) purchases_sum
      ON p.id = purchases_sum."productId"
      LEFT JOIN (
        SELECT "productId", SUM(quantity) AS total_sold
        FROM sales
        GROUP BY "productId"
      ) sales_sum
      ON p.id = sales_sum."productId"
      ORDER BY p.id ASC;
    `);

    const inventoryWithStatus = rows.map(item => ({
      ...item,
      reorderLevel: 20,
      reorderStatus: item.stocks <= 20 ? 'Low Stock' : 'In Stock'
    }));

    return response.status(200).json(inventoryWithStatus);
  } catch (error) {
    return response.status(500).json({ error: (error as Error).message });
  }
}
