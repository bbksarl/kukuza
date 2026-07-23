import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductsList from './pages/ProductsList';
import ProductDetail from './pages/ProductDetail';
import OutfitDetail from './pages/OutfitDetail';
import BestSellerDetail from './pages/BestSellerDetail';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/outfits/:outfitId" element={<OutfitDetail />} />
        <Route path="/best-sellers/:slug" element={<BestSellerDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
