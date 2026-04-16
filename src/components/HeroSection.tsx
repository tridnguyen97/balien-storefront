'use client';

import React, { useEffect, useRef } from 'react';


const HeroSection: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Trigger image breathing
    const img = imgRef.current;
    if (img) {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
      }
    }

    // Delay text reveal
    const timer = setTimeout(() => {
      if (textRef.current) {
        textRef.current.classList.add('revealed');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero-section" id="hero">
      {/* Macro close-up image */}
      <img
        ref={imgRef}
        src="https://img.rocket.new/generatedImages/rocket_gen_img_16ac99d14-1772155772845.png"
        alt="Macro close-up of sinamay weave and iridescent feather barbs on a handcrafted fascinator"
        className="hero-image" />
      

      {/* Gradient overlay */}
      <div className="hero-gradient" />

      {/* Subtle vignette top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(26,26,26,0.3) 0%, transparent 60%)'
        }} />
      

      {/* Text reveal from bottom */}
      <div ref={textRef} className="hero-text-wrap">
        <div className="max-w-7xl mx-auto">
          {/* Eyebrow */}
          <p
            className="text-xs font-medium tracking-widest uppercase mb-6"
            style={{ color: 'rgba(245,240,235,0.5)' }}>
            
            Brim · London Millinery Atelier
          </p>

          {/* Main line */}
          <h1
            className="font-display italic font-light leading-none mb-8"
            style={{
              color: 'var(--cotton)',
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              letterSpacing: '-0.01em'
            }}>
            
            Worn once.
            <br />
            <span style={{ color: 'var(--gold-light)' }}>Remembered always.</span>
          </h1>

          {/* Divider */}
          <div className="gold-divider mb-6" />

          {/* Sub */}
          <p
            className="text-sm md:text-base font-light leading-relaxed max-w-md"
            style={{ color: 'rgba(245,240,235,0.65)' }}>
            
            Sinamay sculpted by hand. Feathers curled one barb at a time.
            Blocked on century-old wooden forms.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <a href="#collection" className="btn-gold">
              View the Collection
            </a>
            <a
              href="#fitting"
              className="text-xs font-medium tracking-wider uppercase py-3.5 px-8 border transition-colors duration-300 text-center"
              style={{
                color: 'rgba(245,240,235,0.7)',
                borderColor: 'rgba(245,240,235,0.2)'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
                (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,240,235,0.2)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(245,240,235,0.7)';
              }}>
              
              Book a Fitting
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 right-10 flex flex-col items-center gap-2 opacity-40"
        style={{ color: 'var(--cotton)' }}>
        
        <span className="text-xs tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <div className="w-px h-12" style={{ background: 'var(--cotton)' }} />
      </div>
    </section>);

};

export default HeroSection;