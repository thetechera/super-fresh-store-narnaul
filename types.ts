import React, { type ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  sellingPrice: number;
}

export interface Sale {
  date: string;
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  totalPrice: number;
}

export interface Purchase {
  date: string;
  id: string;
  vendorName: string;
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
  totalPurchasePrice: number;
}

export interface Inventory {
  productId: string;
  productName: string;
  category: string;
  initialQuantity: number;
  quantityPurchase: number;
  quantitySale: number;
  stocks: number;
  reorderLevel: number;
  reorderStatus: string;
}

export type DataModel = Product | Sale | Purchase | Inventory;

export type DataKey = 'products' | 'sales' | 'purchases' | 'inventory';

export interface AppData {
  products: Product[];
  sales: Sale[];
  purchases: Purchase[];
  inventory: Inventory[];
}

export interface Column<T> {
  accessor: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  isFormField?: boolean;
}

export const getProductColumns = (): Column<Product>[] => [
  { accessor: 'id', header: 'Product ID', sortable: true },
  { accessor: 'name', header: 'Product Name', sortable: true },
  { accessor: 'category', header: 'Category', sortable: true },
  { accessor: 'quantity', header: 'Initial Stock', sortable: true },
  {
    accessor: 'sellingPrice',
    header: 'Unit Price',
    sortable: true,
    render: (item: Product) => `₹${item.sellingPrice.toFixed(2)}`,
  },
];

export const getSaleColumns = (): Column<Sale>[] => [
  {
    accessor: 'date',
    header: 'Date',
    sortable: true,
    render: (item: Sale) => new Date(item.date).toLocaleDateString(),
  },
  { accessor: 'id', header: 'Sale ID', sortable: true },
  { accessor: 'productId', header: 'Product ID', sortable: true },
  { accessor: 'productName', header: 'Product Name', sortable: true },
  { accessor: 'quantity', header: 'Quantity Sold', sortable: true },
  {
    accessor: 'sellingPrice',
    header: 'Price Per Unit',
    sortable: true,
    render: (item: Sale) => `₹${item.sellingPrice.toFixed(2)}`,
  },
  {
    accessor: 'totalPrice',
    header: 'Total Price',
    sortable: true,
    render: (item: Sale) => `₹${item.totalPrice.toFixed(2)}`,
  },
];

export const getPurchaseColumns = (): Column<Purchase>[] => [
  {
    accessor: 'date',
    header: 'Date',
    sortable: true,
    render: (item: Purchase) => new Date(item.date).toLocaleDateString(),
  },
  { accessor: 'id', header: 'Purchase ID', sortable: true },
  { accessor: 'vendorName', header: 'Vendor', sortable: true },
  { accessor: 'productId', header: 'Product ID', sortable: true },
  { accessor: 'productName', header: 'Product Name', sortable: true },
  { accessor: 'quantity', header: 'Quantity', sortable: true },
  {
    accessor: 'costPrice',
    header: 'Cost Per Unit',
    sortable: true,
    render: (item: Purchase) => `₹${item.costPrice.toFixed(2)}`,
  },
  {
    accessor: 'totalPurchasePrice',
    header: 'Total Cost',
    sortable: true,
    render: (item: Purchase) => `₹${item.totalPurchasePrice.toFixed(2)}`,
  },
];

export const getInventoryColumns = (): Column<Inventory>[] => [
  { accessor: 'productId', header: 'Product ID', sortable: true },
  { accessor: 'productName', header: 'Product Name', sortable: true },
  { accessor: 'category', header: 'Category', sortable: true },
  { accessor: 'initialQuantity', header: 'Initial Qty', sortable: true },
  { accessor: 'quantityPurchase', header: 'Purchased Qty', sortable: true },
  { accessor: 'quantitySale', header: 'Sold Qty', sortable: true },
  { accessor: 'stocks', header: 'Available Stocks', sortable: true },
  { accessor: 'reorderLevel', header: 'Reorder Level', sortable: true },
  {
    accessor: 'reorderStatus',
    header: 'Status',
    sortable: true,
    // FIX: Replaced JSX with React.createElement as JSX is not supported in .ts files.
    render: (item: Inventory) => (
      React.createElement(
        'span',
        {
          className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            item.reorderStatus === 'Low Stock'
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`,
        },
        item.reorderStatus,
      )
    ),
  },
];
