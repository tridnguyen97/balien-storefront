# File Structure - Next.js Ecommerce Storefront

## Overview
Complete Next.js 15 ecommerce storefront with Medusa backend integration following Next.js App Router conventions.

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Header and Footer
│   ├── not-found.tsx           # Custom 404 page
│   ├── page.tsx                # Home page (landing)
│   ├── cart/
│   │   └── page.tsx            # Shopping cart with sticky order summary
│   ├── collection/
│   │   └── page.tsx            # Product collection with filtering
│   └── products/
│       ├── page.tsx            # Products listing with sorting/pagination
│       └── [handle]/
│           └── page.tsx        # Individual product details
└── components/
    ├── Header.tsx              # Navigation with mega menu
    ├── Footer.tsx              # Footer with links
    └── ui/
        ├── AppImage.tsx        # Smart image component
        ├── AppIcon.tsx         # Icon component (Heroicons)
        └── AppLogo.tsx         # Logo component
```

## Key Features Implemented

### Pages
- **Home Page**: Hero section, collection showcase, featured products
- **Products Listing**: Category filtering, price sorting, pagination
- **Product Detail**: Variants, images, quantity selector, add to cart
- **Cart Page**: Sticky order summary, price breakdown, checkout button
- **Collection Page**: Category-based browsing with filters

### Components
- **Header**: Mega menu with category dropdowns, mobile responsive
- **Footer**: Links, copyright, social sections
- **AppImage**: Lazy loading, blur placeholders, error handling
- **AppIcon**: Heroicons integration
- **AppLogo**: Flexible logo with image or text

### Design System
- Custom CSS variables for colors, typography, spacing
- Responsive breakpoints (mobile, tablet, desktop)
- Tailwind CSS utility classes
- Modern UI patterns (glassmorphism, smooth animations)

### Medusa Integration Ready
- Product API integration patterns
- Cart management with localStorage
- Price display (Medusa stores prices as-is)
- Region and currency handling
- SDK setup configuration

## Next.js Best Practices Followed
- App Router conventions
- Server components where appropriate
- Client components for interactivity
- Static and dynamic routing
- Image optimization with Next/Image
- TypeScript for type safety
- Responsive design patterns
- SEO optimization with meta tags
- Custom error and 404 pages