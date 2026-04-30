import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import HeroSection from '../components/HeroSection';
import Products from './Products';

const Home: React.FC = () => {
  return (
    <MainLayout>
      <div className="grain-overlay" aria-hidden="true" />
      <HeroSection />
      <Products />
    </MainLayout>
  );
};

export default Home;