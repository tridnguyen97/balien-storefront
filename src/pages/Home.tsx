import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Products from './Products';

const Home: React.FC = () => {
  return (
    <main style={{ background: 'var(--cotton)' }}>
      <div className="grain-overlay" aria-hidden="true" />

      {/* Navigation */}
      <Header />

      {/* Hero — macro close-up, cinematic text reveal */}
      <HeroSection />

      {/* Products Grid */}
      <Products />
    </main>
  );
};

export default Home;