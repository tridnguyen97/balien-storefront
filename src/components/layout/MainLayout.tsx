/**
 * Main Layout Component
 *
 * Provides consistent layout structure with header, main content, and footer.
 */

import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-background text-foreground ${className}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;