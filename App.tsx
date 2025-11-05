
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './hooks/useData';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CrudPage from './pages/CrudPage';
import { getProductColumns, getSaleColumns, getPurchaseColumns, getInventoryColumns } from './types.ts';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<CrudPage title="Products" dataKey="products" columns={getProductColumns()} />} />
        <Route path="sales" element={<CrudPage title="Sales Management" dataKey="sales" columns={getSaleColumns()} />} />
        <Route path="purchases" element={<CrudPage title="Purchase Orders" dataKey="purchases" columns={getPurchaseColumns()} />} />
        <Route path="inventory" element={<CrudPage title="Inventory" dataKey="inventory" columns={getInventoryColumns()} readOnly />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <DataProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </DataProvider>
  );
}

export default App;