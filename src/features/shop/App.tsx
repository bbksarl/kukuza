import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/Dashboard';
import SalesPage from './pages/Sales';
import ProductsPage from './pages/Products';
import AddProductPage from './pages/AddProduct';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/ventes" element={<SalesPage />} />
      <Route path="/produits" element={<ProductsPage />} />
      <Route path="/produits/ajouter" element={<AddProductPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
