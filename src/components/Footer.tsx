import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      className="border-t py-16 px-6 md:px-10"
      style={{
        borderColor: 'var(--ink-10)',
        background: 'var(--cotton)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <span
            className="font-display italic text-2xl font-light tracking-tight"
            style={{ color: 'var(--ink)' }}
          >
            Brim
          </span>
          <span className="text-xs tracking-wider" style={{ color: 'var(--muted)' }}>
            London · Est. 2009
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-8 flex-wrap justify-center">
          {['Collection', 'Process', 'Bespoke', 'Stockists'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium tracking-wide transition-colors duration-300"
              style={{ color: 'var(--muted-dark)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-dark)')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Legal */}
        <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--muted)' }}>
          <span>© 2026 Brim</span>
          <a
            href="#"
            className="hover:underline transition-colors"
            style={{ color: 'var(--gold)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:underline transition-colors"
            style={{ color: 'var(--gold)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;