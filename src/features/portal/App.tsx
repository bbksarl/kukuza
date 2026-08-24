import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductsList from './pages/ProductsList';
import ProductDetail from './pages/ProductDetail';
import OutfitDetail from './pages/OutfitDetail';
import BestSellerDetail from './pages/BestSellerDetail';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/outfits/:outfitId" element={<OutfitDetail />} />
        <Route path="/best-sellers/:slug" element={<BestSellerDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
