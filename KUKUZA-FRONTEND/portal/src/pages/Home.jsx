import React from 'react';
import Header from '../components/portal/Header';
import Banner from '../components/portal/Banner';
import Boutiques from '../components/portal/Boutiques';
import Products from '../components/portal/Products';
import OutfitOfTheWeek from '../components/portal/OutfitOfTheWeek';
import SkincareSection from '../components/portal/SkincareSection';
import BestSellers from '../components/portal/BestSellers';
import Offre from '../components/portal/Offre';
import InspirationSection from '../components/portal/InspirationSection';
import Footer from '../components/portal/Footer';

export default function Home(){
  return (
    <div className="bg-portal-bg min-h-screen overflow-x-hidden">
      <Header />
      <main className="min-h-[calc(100vh-52px)] flex flex-col bg-gray-50 w-full overflow-x-hidden">
        <Banner showCategories={true} logoSrc="/assets/logo.png" />
        <Boutiques />
        <Products />
        <OutfitOfTheWeek />
        <SkincareSection />
        <BestSellers />
        <Offre />
        <InspirationSection />
      </main>
      <Footer />
    </div>
  );
}
