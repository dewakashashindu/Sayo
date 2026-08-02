'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import sayoLogo from '../../public/sayologo.png';

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const tokens = {
  color: {
    gold:        '#B8860B',
    goldAlpha:   'rgba(184,134,11,0.69)',
    bgDark:      '#282828',
    bgFooter:    '#1a1a1a',
    navBg:       'rgba(68,68,68,0.40)',
    white:       '#ffffff',
    whiteMuted:  'rgba(255,255,255,0.75)',
    whiteDim:    'rgba(255,255,255,0.70)',
    whiteFaint:  'rgba(255,255,255,0.35)',
    whiteBorder: 'rgba(255,255,255,0.10)',
    cardBg:      'rgba(68,68,68,0.40)',
  },
  font: {
    family:         'Inter, sans-serif',
    nav:            'clamp(0.875rem, 1.2vw, 1rem)',
    logoText:       'clamp(1.125rem, 1.5vw, 1.375rem)',
    sectionEyebrow: 'clamp(1.5rem, 2.5vw, 2.5rem)',
    sectionTitle:   'clamp(2rem, 4vw, 4rem)',
    heroTitle:      'clamp(2rem, 4vw, 4rem)',
    heroSub:        'clamp(1rem, 2vw, 2rem)',
    cardName:       'clamp(1.25rem, 2vw, 2rem)',
    body:           'clamp(0.875rem, 1.2vw, 0.9375rem)',
    label:          '0.75rem',
    quickLink:      '0.875rem',
    brand:          'clamp(1.5rem, 3vw, 2.5rem)',
    tagline:        'clamp(0.875rem, 1.2vw, 1rem)',
  },
  radius: {
    nav:     '0.75rem',
    contact: '0.75rem',
    card:    '1.25rem',
    gallery: '1.25rem',
    dot:     '9999px',
    tile:    '0.75rem',
  },
} as const;

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const globalCss = `
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0);    }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0);    }
    50%       { transform: translateY(-8px); }
  }
  @keyframes tileIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1);    }
  }
  @keyframes kenBurns {
    0%   { transform: scale(1);    }
    100% { transform: scale(1.08); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes smokeFlow1 {
    0%   { transform: translateX(-100%) translateY(20%) rotate(-15deg); opacity: 0; }
    20%  { opacity: 0.6; }
    80%  { opacity: 0.4; }
    100% { transform: translateX(100%) translateY(-10%) rotate(-10deg); opacity: 0; }
  }
  @keyframes smokeFlow2 {
    0%   { transform: translateX(100%) translateY(-20%) rotate(10deg); opacity: 0; }
    20%  { opacity: 0.5; }
    80%  { opacity: 0.3; }
    100% { transform: translateX(-100%) translateY(15%) rotate(15deg); opacity: 0; }
  }
  @keyframes particleFloat {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
    10%       { opacity: 1; }
    90%       { opacity: 0.8; }
    50%       { transform: translateY(-30px) translateX(15px); }
  }
  @keyframes glowPulse {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50%       { opacity: 0.25; transform: scale(1.1); }
  }

  .nav-animate   { animation: fadeInDown 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
  .logo-float    { animation: floatY 4s ease-in-out 1.5s infinite; }
  .flower-float  { animation: floatY 5s ease-in-out 0.5s infinite; }
  .reveal-left   { animation: fadeInLeft  0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .reveal-right  { animation: fadeInRight 0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .reveal-up     { animation: fadeInUp    0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .tile-reveal   { animation: tileIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }

  .nav-link-wrap { position: relative; display: inline-block; }
  .nav-link-wrap::after {
    content: ''; position: absolute; bottom: -3px; left: 0;
    width: 0; height: 2px; background: #B8860B;
    transition: width 0.3s ease;
  }
  .nav-link-wrap:hover::after { width: 100%; }

  .contact-btn-wrap { position: relative; overflow: hidden; }
  .contact-btn-wrap::before {
    content: ''; position: absolute; inset: 0;
    background: white; transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: -1;
  }
  .contact-btn-wrap:hover::before { transform: scaleX(1); }
  .contact-btn-wrap:hover { color: #000 !important; }

  .gallery-tile {
    position: relative;
    overflow: hidden;
    border-radius: 1.25rem;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease;
  }
  .gallery-tile:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 2px rgba(184,134,11,0.4);
    z-index: 2;
  }
  .gallery-tile img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
  .gallery-tile:hover img { transform: scale(1.08); }
  .gallery-tile .overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
    opacity: 0; transition: opacity 0.4s ease;
  }
  .gallery-tile:hover .overlay { opacity: 1; }

  .gallery-tile .tag {
    position: absolute; top: 0.75rem; left: 0.75rem;
    background: rgba(184,134,11,0.85);
    color: white; font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.25rem 0.625rem; border-radius: 9999px;
    opacity: 0; transform: translateY(-5px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  .gallery-tile:hover .tag { opacity: 1; transform: translateY(0); }

  .gallery-tile .caption {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 1rem; color: white;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  .gallery-tile:hover .caption { opacity: 1; transform: translateY(0); }

  .section-title-shine {
    background: linear-gradient(90deg, #B8860B, #FFD700, #B8860B);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .hero-text-glow { text-shadow: 0 0 40px rgba(184,134,11,0.3); }

  .filter-btn {
    cursor: pointer; padding: 0.4rem 1.25rem;
    border-radius: 9999px; font-size: 0.8rem;
    font-weight: 500; letter-spacing: 0.06em;
    transition: all 0.25s ease; border: 1.5px solid transparent;
  }
  .filter-btn.active {
    background: #B8860B; color: white; border-color: #B8860B;
  }
  .filter-btn:not(.active) {
    background: transparent; color: rgba(255,255,255,0.6);
    border-color: rgba(255,255,255,0.2);
  }
  .filter-btn:not(.active):hover { border-color: #B8860B; color: #B8860B; }

  .lightbox-bg {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.92);
    display: flex; align-items: center; justify-content: center;
    animation: fadeInUp 0.2s ease both;
  }
  .lightbox-close {
    position: absolute; top: 1.5rem; right: 1.5rem;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50%; width: 48px; height: 48px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: white; font-size: 1.25rem;
    transition: background 0.2s, transform 0.2s;
  }
  .lightbox-close:hover { background: #B8860B; transform: rotate(90deg); }

  .quick-link { position: relative; transition: padding-left 0.25s, color 0.25s; }
  .quick-link:hover { padding-left: 8px; color: #B8860B !important; }
  .quick-link::before {
    content: '›'; position: absolute; left: -4px; opacity: 0;
    transition: opacity 0.25s, left 0.25s; color: #B8860B;
  }
  .quick-link:hover::before { opacity: 1; left: 0; }

  .social-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.15);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s, border-color 0.3s;
  }
  .social-icon:hover {
    transform: scale(1.12) translateY(-3px);
    background: #B8860B; border-color: #B8860B;
  }

  .footer-grid {
    display: flex; flex-direction: column; flex-wrap: wrap; gap: 2.5rem;
  }
  @media (min-width: 1024px) {
    .footer-grid {
      flex-direction: row; flex-wrap: nowrap;
      justify-content: space-between; align-items: flex-start;
    }
  }
  @media (min-width: 640px) and (max-width: 1023px) {
    .footer-grid { flex-direction: row; flex-wrap: wrap; justify-content: space-between; }
  }

  .footer-reveal {
    transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .footer-reveal-fast {
    transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  .footer-reveal-bounce {
    transition: opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }
  .footer-reveal-simple { transition: opacity 1s ease; }

  @media (max-width: 768px) {
    .gallery-grid-desktop { display: none !important; }
    .gallery-grid-mobile  { display: flex !important; }
  }
  @media (min-width: 769px) {
    .gallery-grid-desktop { display: grid !important; }
    .gallery-grid-mobile  { display: none !important; }
  }
`;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const NAV_ITEMS = ['HOME', 'OUR STORY', 'SERVICES', 'PRODUCTS', 'REVIEWS'] as const;

const NAV_HREFS: Record<string, string> = {
  'HOME':      '/',
  'OUR STORY': '/about',
  'SERVICES':  '/services',
  'PRODUCTS':  '/products',
  'REVIEWS':   '/reviews',
};

type GalleryItem = {
  id:     number;
  src:    string;
  alt:    string;
  label:  string;
  tag:    string;
  filter: string;
  aspect: string;
};

const GALLERY_DEFAULT_ITEMS: GalleryItem[] = [
  { id: 1,  src: '/gallery/bridal-1.jpg',  alt: 'Bridal Makeup',        label: 'Bridal Makeup',        tag: 'Bridal', filter: 'bridal', aspect: 'portrait'  },
  { id: 2,  src: '/gallery/hair-1.jpg',    alt: 'Hair Coloring',         label: 'Balayage & Highlights', tag: 'Hair',   filter: 'hair',   aspect: 'landscape' },
  { id: 3,  src: '/gallery/makeup-1.jpg',  alt: 'Glam Makeup',           label: 'Evening Glam',          tag: 'Makeup', filter: 'makeup', aspect: 'portrait'  },
  { id: 4,  src: '/gallery/hair-2.jpg',    alt: 'Hair Styling',          label: 'Precision Cuts',        tag: 'Hair',   filter: 'hair',   aspect: 'square'    },
  { id: 5,  src: '/gallery/bridal-2.jpg',  alt: 'Kandyan Bridal',        label: 'Kandyan Bridal Look',   tag: 'Bridal', filter: 'bridal', aspect: 'landscape' },
  { id: 6,  src: '/gallery/spa-1.jpg',     alt: 'Spa Treatment',         label: 'Rejuvenating Spa',      tag: 'Spa',    filter: 'spa',    aspect: 'portrait'  },
  { id: 7,  src: '/gallery/nail-1.jpg',    alt: 'Nail Art',              label: 'Nail Artistry',         tag: 'Nails',  filter: 'nails',  aspect: 'square'    },
  { id: 8,  src: '/gallery/makeup-2.jpg',  alt: 'Bridal Makeup Detail',  label: 'Bridal Eyes',           tag: 'Bridal', filter: 'bridal', aspect: 'landscape' },
  { id: 9,  src: '/gallery/hair-3.jpg',    alt: 'Hair Treatment',        label: 'Keratin Treatment',     tag: 'Hair',   filter: 'hair',   aspect: 'portrait'  },
  { id: 10, src: '/gallery/salon-1.jpg',   alt: 'Salon Interior',        label: 'Our Studio',            tag: 'Studio', filter: 'studio', aspect: 'landscape' },
  { id: 11, src: '/gallery/bridal-3.jpg',  alt: 'Modern Bridal',         label: 'Modern Bridal Glow',    tag: 'Bridal', filter: 'bridal', aspect: 'square'    },
  { id: 12, src: '/gallery/spa-2.jpg',     alt: 'Facial Treatment',      label: 'Luxury Facial',         tag: 'Spa',    filter: 'spa',    aspect: 'portrait'  },
];

const QUICK_LINKS = ['Home', 'Our Story', 'Services', 'Products', 'Reviews'] as const;
const LOCATIONS   = ['Colombo', 'Negombo', 'Kiribathgoda'] as const;

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useIsMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [bp]);
  return m;
}

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.4.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.35 1.05.4 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.4 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.35-2.22.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.22-.4a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.35-1.05-.4-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.8.4-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.35 2.22-.4 1.27-.06 1.65-.07 4.85-.07zm0-2.16C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39A5.87 5.87 0 0 0 .62 4.15C.32 4.9.12 5.78.06 7.05.01 8.33 0 8.74 0 12s.01 3.67.06 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.3 1.64.5 2.91.56C8.33 24 8.74 24 12 24s3.67-.01 4.95-.06c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.39.67-.67 1.08-1.34 1.39-2.13.3-.76.5-1.64.56-2.91.06-1.28.06-1.69.06-4.95s0-3.67-.06-4.95c-.06-1.27-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.39-2.13A5.87 5.87 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.86c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z"/>
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.24-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/>
    </svg>
  );
}

function IconLocation() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 6-10 7L2 6"/>
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   LOGO
───────────────────────────────────────── */
function LogoIcon({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={className} style={{ width: size, height: size, flexShrink: 0 }}>
      <Image
        src={sayoLogo}
        alt="SAYO Logo"
        width={size}
        height={size}
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   GALLERY TILE
───────────────────────────────────────── */
function GalleryTile({
  item, height, visible, delay, onClick,
}: {
  item: GalleryItem;
  height: string;
  visible: boolean;
  delay: string;
  onClick: (item: GalleryItem) => void;
}) {
  return (
    <div
      className="gallery-tile tile-reveal"
      style={{
        height,
        opacity:        visible ? 1 : 0,
        animationDelay: delay,
        background:     tokens.color.cardBg,
      }}
      onClick={() => onClick(item)}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 33vw"
        style={{ objectFit: 'cover' }}
      />
      <div className="overlay" />
      <div className="tag">{item.tag}</div>
      <div className="caption">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '1.25rem', height: '2px',
            background: tokens.color.gold,
            borderRadius: tokens.radius.dot,
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {item.label}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────── */
function Lightbox({
  item, onClose,
}: {
  item: GalleryItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="lightbox-bg" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}><IconClose /></button>
      <div
        style={{
          position:     'relative',
          width:        'min(90vw, 900px)',
          height:       'min(80vh, 700px)',
          borderRadius: tokens.radius.card,
          overflow:     'hidden',
          boxShadow:    '0 40px 100px rgba(0,0,0,0.8)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <Image src={item.src} alt={item.alt} fill unoptimized sizes="90vw" style={{ objectFit: 'cover' }} />
        <div style={{
          position:   'absolute',
          bottom: 0, left: 0, right: 0,
          padding:    '1.5rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        }}>
          <span style={{
            background:    tokens.color.gold,
            color:         tokens.color.white,
            fontSize:      '0.7rem',
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            padding:       '0.2rem 0.75rem',
            borderRadius:  tokens.radius.dot,
            marginBottom:  '0.5rem',
            display:       'inline-block',
          }}>{item.tag}</span>
          <h3 style={{ color: tokens.color.white, fontWeight: 600, fontSize: '1.25rem', margin: '0.5rem 0 0' }}>
            {item.label}
          </h3>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function GalleryPage() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [loaded,       setLoaded]       = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [heroLoaded,   setHeroLoaded]   = useState(false);

  const [galleryItems, setGalleryItems]   = useState<GalleryItem[]>(GALLERY_DEFAULT_ITEMS);
  const [heroEyebrow,  setHeroEyebrow]    = useState('✦ SAYO Beauty Studio ✦');
  const [heroTitle,    setHeroTitle]      = useState('The Beauty Canvas');
  const [heroSubtitle, setHeroSubtitle]   = useState('A curated showcase of artistry, elegance, and unforgettable transformations crafted by our expert stylists.');
  const [portfolioTitle,    setPortfolioTitle]    = useState('Our Portfolio');
  const [portfolioSubtitle, setPortfolioSubtitle] = useState('Browse through our collection of stunning transformations and beauty artistry');

  const isMobile = useIsMobile(1024);

  const { ref: heroRef,    inView: heroVisible    } = useInView(0.1);
  const { ref: filterRef,  inView: filterVisible  } = useInView(0.1);
  const { ref: galleryRef, inView: galleryVisible } = useInView(0.05);
  const { ref: footerRef,  inView: footerVisible  } = useInView(0.1);

  useEffect(() => {
    const t = setTimeout(() => { setLoaded(true); setHeroLoaded(true); }, 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    fetch('/api/site-data?section=gallery')
      .then(r => r.json())
      .then(data => {
        if (!data) return;
        if (data.hero_eyebrow)     setHeroEyebrow(data.hero_eyebrow);
        if (data.hero_title)       setHeroTitle(data.hero_title);
        if (data.hero_subtitle)    setHeroSubtitle(data.hero_subtitle);
        if (data.section_title)    setPortfolioTitle(data.section_title);
        if (data.section_subtitle) setPortfolioSubtitle(data.section_subtitle);
        if (Array.isArray(data.items) && data.items.length) {
          setGalleryItems(data.items.map((it: Record<string, unknown>, i: number) => ({
            id:     typeof it.id === 'number' ? it.id : i + 1,
            src:    String(it.src ?? ''),
            alt:    String(it.alt ?? it.label ?? 'Gallery image'),
            label:  String(it.label ?? it.alt ?? 'Gallery'),
            tag:    String(it.tag ?? 'Beauty'),
            filter: String(it.filter ?? String(it.tag ?? '').toLowerCase()) || 'general',
            aspect: String(it.aspect ?? 'portrait'),
          })));
        }
      })
      .catch(() => { /* keep defaults */ });
  }, []);

  const FILTERS = ['All', ...Array.from(new Set(galleryItems.map(g => g.tag).filter(Boolean)))];

  const filtered = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter(g => g.filter === activeFilter.toLowerCase());

  return (
    <>
      <style>{globalCss}</style>

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />

      <main style={{
        minHeight:  '100vh',
        fontFamily: tokens.font.family,
        color:      tokens.color.white,
        background: tokens.color.bgDark,
        overflowX:  'hidden',
      }}>

        {/* ══════════ HERO ══════════ */}
        <section style={{
          position:      'relative',
          width:         '100%',
          minHeight:     'clamp(420px, 55vw, 833px)',
          overflow:      'hidden',
          display:       'flex',
          flexDirection: 'column',
        }}>
          {/* ── BACKGROUND IMAGE — contact-bg.jpg ── */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <Image
              src="/contact-bg.jpg"
              alt="Gallery hero"
              fill
              priority
              unoptimized
              sizes="100vw"
              style={{
                objectFit:  'cover',
                objectPosition: 'center',
                animation:  heroLoaded ? 'kenBurns 20s ease-in-out alternate infinite' : 'none',
              }}
            />
            <div style={{
              position:   'absolute',
              inset:      0,
              background: 'linear-gradient(270deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.85) 100%)',
            }} />
            {/* Gold accent line */}
            <div style={{
              position:   'absolute',
              bottom: 0, left: 0, right: 0,
              height:     '3px',
              background: `linear-gradient(90deg, transparent, ${tokens.color.gold}, transparent)`,
            }} />
          </div>

          {/* ── NAVBAR ── */}
          <nav
            className={loaded ? 'nav-animate' : ''}
            style={{
              position: 'relative',
              zIndex:   20,
              padding:  'clamp(1rem, 3vw, 3rem) clamp(1rem, 3vw, 3.125rem)',
              opacity:  loaded ? undefined : 0,
            }}
          >
            <div style={{
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              background:     tokens.color.navBg,
              borderRadius:   tokens.radius.nav,
              padding:        'clamp(0.75rem, 2vw, 1.5rem) clamp(1rem, 2vw, 2rem)',
              backdropFilter: 'blur(8px)',
              border:         `1px solid ${tokens.color.whiteBorder}`,
              minHeight:      '3.5rem',
            }}>
              {/* Logo */}
              <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                <LogoIcon size={48} className="logo-float" />
                <span style={{
                  color:         tokens.color.white,
                  fontSize:      tokens.font.logoText,
                  fontWeight:    600,
                  letterSpacing: '0.15em',
                }}>SAYO</span>
              </a>

              {/* Desktop Nav */}
              {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}>
                  {NAV_ITEMS.map(item => (
                    <a
                      key={item}
                      href={NAV_HREFS[item]}
                      className="nav-link-wrap"
                      style={{
                        color:          tokens.color.white,
                        fontSize:       tokens.font.nav,
                        fontWeight:     500,
                        textDecoration: 'none',
                        transition:     'color 0.2s',
                        whiteSpace:     'nowrap',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = tokens.color.gold; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = tokens.color.white; }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}

              {/* Contact Btn */}
              {!isMobile && (
                <a
                  href="/contact"
                  className="contact-btn-wrap"
                  style={{
                    color:          tokens.color.white,
                    fontSize:       tokens.font.nav,
                    fontWeight:     500,
                    textDecoration: 'none',
                    border:         `2.5px solid ${tokens.color.gold}`,
                    borderRadius:   tokens.radius.contact,
                    padding:        '0.5rem 1.5rem',
                    transition:     'all 0.3s',
                    whiteSpace:     'nowrap',
                    position:       'relative',
                    zIndex:         1,
                  }}
                >
                  CONTACT US
                </a>
              )}

              {/* Hamburger */}
              {isMobile && (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                  style={{
                    background: 'none', border: 'none',
                    color:      tokens.color.white, cursor: 'pointer',
                    padding:    '0.5rem',
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {menuOpen
                      ? <path d="M6 18L18 6M6 6l12 12" />
                      : (
                        <>
                          <line x1="3" y1="6"  x2="21" y2="6"  />
                          <line x1="3" y1="12" x2="21" y2="12" />
                          <line x1="3" y1="18" x2="21" y2="18" />
                        </>
                      )
                    }
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile Menu */}
            {isMobile && menuOpen && (
              <div style={{
                marginTop:     '0.5rem',
                background:    'rgba(0,0,0,0.95)',
                borderRadius:  tokens.radius.nav,
                padding:       '1rem 1.5rem',
                display:       'flex',
                flexDirection: 'column',
                gap:           '1rem',
                animation:     'fadeInDown 0.3s ease both',
                border:        `1px solid ${tokens.color.whiteBorder}`,
              }}>
                {NAV_ITEMS.map(item => (
                  <a
                    key={item}
                    href={NAV_HREFS[item]}
                    style={{
                      color: tokens.color.white, fontSize: '1rem',
                      fontWeight: 500, textDecoration: 'none',
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="/contact"
                  style={{
                    color:          tokens.color.white,
                    fontSize:       '1rem',
                    textAlign:      'center',
                    padding:        '0.625rem 0',
                    borderRadius:   tokens.radius.nav,
                    border:         `2px solid ${tokens.color.gold}`,
                    textDecoration: 'none',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  CONTACT US
                </a>
              </div>
            )}
          </nav>

          {/* Hero Content */}
          <div
            ref={heroRef}
            style={{
              position:       'relative',
              zIndex:         10,
              flex:           1,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              textAlign:      'center',
              padding:        'clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 3rem)',
              paddingTop:     'clamp(1rem, 3vw, 2rem)',
            }}
          >
            <p
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                color:          tokens.color.gold,
                fontSize:       'clamp(0.75rem, 1.2vw, 0.875rem)',
                fontWeight:     600,
                letterSpacing:  '0.3em',
                textTransform:  'uppercase',
                margin:         '0 0 1rem',
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.2s',
              }}
            >
              {heroEyebrow}
            </p>

            <h1
              className={`${heroVisible ? 'reveal-up' : ''} hero-text-glow`}
              style={{
                color:          tokens.color.gold,
                fontSize:       tokens.font.heroTitle,
                fontWeight:     500,
                margin:         '0 0 clamp(1rem, 3vh, 1.75rem)',
                lineHeight:     1.15,
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.35s',
              }}
            >
              {heroTitle}
            </h1>

            <div
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '1rem',
                marginBottom:   'clamp(1rem, 2vh, 1.5rem)',
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.45s',
              }}
            >
              <div style={{ width: '3rem', height: '1px', background: tokens.color.gold }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tokens.color.gold }} />
              <div style={{ width: '3rem', height: '1px', background: tokens.color.gold }} />
            </div>

            <p
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                color:          tokens.color.white,
                fontSize:       tokens.font.heroSub,
                fontWeight:     500,
                margin:         0,
                maxWidth:       '700px',
                lineHeight:     1.5,
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.5s',
              }}
            >
              {heroSubtitle}
            </p>

            <div
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                display:        'flex',
                gap:            'clamp(2rem, 5vw, 4rem)',
                marginTop:      'clamp(2rem, 4vh, 3rem)',
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.65s',
              }}
            >
              {[
                { num: '500+', label: 'Transformations'    },
                { num: '12+',  label: 'Years of Excellence' },
                { num: '98%',  label: 'Happy Clients'       },
              ].map(({ num, label }) => (
                <div key={num} style={{ textAlign: 'center' }}>
                  <div style={{
                    color:      tokens.color.gold,
                    fontSize:   'clamp(1.5rem, 3vw, 2.25rem)',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}>{num}</div>
                  <div style={{
                    color:         tokens.color.whiteMuted,
                    fontSize:      'clamp(0.65rem, 1vw, 0.8rem)',
                    fontWeight:    400,
                    letterSpacing: '0.08em',
                    marginTop:     '0.35rem',
                    textTransform: 'uppercase' as const,
                  }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FILTER BAR ══════════ */}
        <div
          ref={filterRef}
          className={filterVisible ? 'reveal-up' : ''}
          style={{
            padding:        'clamp(2rem, 4vw, 3rem) clamp(1rem, 5vw, 3rem) clamp(1rem, 2vw, 1.5rem)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '1.5rem',
            opacity:        filterVisible ? 1 : 0,
            animationDelay: '0.1s',
          }}
        >
          <h2 style={{
            color:      tokens.color.gold,
            fontSize:   tokens.font.sectionTitle,
            fontWeight: 500,
            margin:     0,
            textAlign:  'center',
          }}>
            {portfolioTitle}
          </h2>
          <p style={{
            color:      tokens.color.whiteMuted,
            fontSize:   tokens.font.body,
            textAlign:  'center',
            margin:     0,
            maxWidth:   '560px',
            lineHeight: 1.7,
          }}>
            {portfolioSubtitle}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
                style={{ fontFamily: tokens.font.family }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════ MAIN GALLERY ══════════ */}
        <section
          ref={galleryRef}
          style={{ padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 2.5rem) clamp(3rem, 6vw, 5rem)' }}
        >
          {/* ── MOSAIC ROW 1 ── */}
          <div
            className="gallery-grid-desktop"
            style={{
              display:             'grid',
              gridTemplateColumns: '22% 1fr 1fr',
              gap:                 '1rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered[0] && (
                <GalleryTile item={filtered[0]} height="clamp(260px, 30vw, 370px)"
                  visible={galleryVisible} delay="0.1s" onClick={setLightboxItem} />
              )}
              {filtered[3] && (
                <GalleryTile item={filtered[3]} height="clamp(240px, 28vw, 350px)"
                  visible={galleryVisible} delay="0.25s" onClick={setLightboxItem} />
              )}
            </div>

            {filtered[1] && (
              <GalleryTile item={filtered[1]} height="clamp(520px, 60vw, 740px)"
                visible={galleryVisible} delay="0.15s" onClick={setLightboxItem} />
            )}

            {filtered[2] && (
              <GalleryTile item={filtered[2]} height="clamp(520px, 60vw, 740px)"
                visible={galleryVisible} delay="0.2s" onClick={setLightboxItem} />
            )}

            {filtered[4] && (
              <div style={{ gridColumn: '2 / 4' }}>
                <GalleryTile item={filtered[4]} height="clamp(220px, 22vw, 320px)"
                  visible={galleryVisible} delay="0.3s" onClick={setLightboxItem} />
              </div>
            )}
          </div>

          {/* ── MOSAIC ROW 2 ── */}
          {filtered.length > 5 && (
            <div
              className="gallery-grid-desktop"
              style={{
                display:             'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap:                 '1rem',
                marginTop:           '1rem',
              }}
            >
              {filtered.slice(5, 9).map((item, i) => (
                <GalleryTile
                  key={item.id}
                  item={item}
                  height="clamp(200px, 22vw, 300px)"
                  visible={galleryVisible}
                  delay={`${0.35 + i * 0.08}s`}
                  onClick={setLightboxItem}
                />
              ))}
            </div>
          )}

          {/* ── MOSAIC ROW 3 ── */}
          {filtered.length > 9 && (
            <div
              className="gallery-grid-desktop"
              style={{
                display:             'grid',
                gridTemplateColumns: '1fr 2fr 1fr',
                gap:                 '1rem',
                marginTop:           '1rem',
              }}
            >
              {filtered[9] && (
                <GalleryTile item={filtered[9]}  height="clamp(260px, 28vw, 380px)"
                  visible={galleryVisible} delay="0.55s" onClick={setLightboxItem} />
              )}
              {filtered[10] && (
                <GalleryTile item={filtered[10]} height="clamp(260px, 28vw, 380px)"
                  visible={galleryVisible} delay="0.62s" onClick={setLightboxItem} />
              )}
              {filtered[11] && (
                <GalleryTile item={filtered[11]} height="clamp(260px, 28vw, 380px)"
                  visible={galleryVisible} delay="0.69s" onClick={setLightboxItem} />
              )}
            </div>
          )}

          {/* Extra row for admin-added photos */}
          {filtered.length > 12 && (
            <div
              className="gallery-grid-desktop"
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap:                 '1rem',
                marginTop:           '1rem',
              }}
            >
              {filtered.slice(12).map((item, i) => (
                <GalleryTile
                  key={item.id}
                  item={item}
                  height="clamp(200px, 22vw, 300px)"
                  visible={galleryVisible}
                  delay={`${0.75 + i * 0.06}s`}
                  onClick={setLightboxItem}
                />
              ))}
            </div>
          )}

          {/* ── MOBILE GALLERY ── */}
          <div className="gallery-grid-mobile" style={{ flexDirection: 'column', gap: '0.875rem', display: 'none' }}>
            {filtered[0] && (
              <GalleryTile item={filtered[0]} height="360px"
                visible={galleryVisible} delay="0.1s" onClick={setLightboxItem} />
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {filtered[1] && (
                <GalleryTile item={filtered[1]} height="220px"
                  visible={galleryVisible} delay="0.18s" onClick={setLightboxItem} />
              )}
              {filtered[2] && (
                <GalleryTile item={filtered[2]} height="220px"
                  visible={galleryVisible} delay="0.24s" onClick={setLightboxItem} />
              )}
            </div>
            {filtered[3] && (
              <GalleryTile item={filtered[3]} height="280px"
                visible={galleryVisible} delay="0.3s" onClick={setLightboxItem} />
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {filtered[4] && (
                <GalleryTile item={filtered[4]} height="200px"
                  visible={galleryVisible} delay="0.36s" onClick={setLightboxItem} />
              )}
              {filtered[5] && (
                <GalleryTile item={filtered[5]} height="200px"
                  visible={galleryVisible} delay="0.42s" onClick={setLightboxItem} />
              )}
            </div>
            {filtered.slice(6).map((item, i) => (
              <GalleryTile
                key={item.id}
                item={item}
                height="250px"
                visible={galleryVisible}
                delay={`${0.48 + i * 0.06}s`}
                onClick={setLightboxItem}
              />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: tokens.color.whiteMuted }}>
              <p style={{ fontSize: '1.125rem' }}>No items found in this category.</p>
            </div>
          )}

          {/* CTA */}
          <div style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '1rem',
            marginTop:      'clamp(2.5rem, 5vw, 4rem)',
          }}>
            <p style={{
              color:         tokens.color.whiteMuted,
              fontSize:      tokens.font.body,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              margin:        0,
            }}>
              Want to see more of our work?
            </p>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '0.625rem',
                background:     `linear-gradient(135deg, ${tokens.color.gold}, #d4a017)`,
                color:          tokens.color.white,
                fontSize:       tokens.font.body,
                fontWeight:     600,
                letterSpacing:  '0.08em',
                textDecoration: 'none',
                padding:        '0.875rem 2.5rem',
                borderRadius:   tokens.radius.dot,
                boxShadow:      '0 8px 30px rgba(184,134,11,0.35)',
                transition:     'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'scale(1.06) translateY(-2px)';
                el.style.boxShadow = '0 14px 40px rgba(184,134,11,0.55)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'scale(1) translateY(0)';
                el.style.boxShadow = '0 8px 30px rgba(184,134,11,0.35)';
              }}
            >
              <IconInstagram />
              FOLLOW US ON INSTAGRAM
            </a>
          </div>
        </section>

        {/* ══════════ FOOTER ══════════ */}
        <footer
          ref={footerRef}
          style={{
            position:   'relative',
            overflow:   'hidden',
            background: tokens.color.bgFooter,
            padding:    'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 5.188rem)',
          }}
        >
          <div className="footer-grid" style={{ position: 'relative', zIndex: 10 }}>

            {/* Brand */}
            <div
              className="footer-reveal"
              style={{
                flex:            '1 1 260px',
                maxWidth:        '320px',
                display:         'flex',
                flexDirection:   'column',
                gap:             '1rem',
                opacity:         footerVisible ? 1 : 0,
                transform:       footerVisible ? 'translateX(0)' : 'translateX(-40px)',
                transitionDelay: '0s',
              }}
            >
              <LogoIcon size={56} />
              <h2 style={{
                color:         tokens.color.white,
                fontSize:      tokens.font.brand,
                fontWeight:    600,
                letterSpacing: '0.15em',
                margin:        0,
              }}>
                SAYO
              </h2>
              <p style={{
                color:      tokens.color.whiteMuted,
                fontSize:   tokens.font.tagline,
                lineHeight: 1.6,
                margin:     0,
                maxWidth:   '260px',
              }}>
                We are experienced in making you more beautiful.
                Your transformation is our masterpiece.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {[
                  { label: 'WhatsApp',  Icon: IconWhatsApp  },
                  { label: 'Facebook',  Icon: IconFacebook  },
                  { label: 'Instagram', Icon: IconInstagram },
                ].map(({ label, Icon }, i) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="social-icon footer-reveal-bounce"
                    style={{
                      color:           tokens.color.white,
                      opacity:         footerVisible ? 1 : 0,
                      transform:       footerVisible ? 'scale(1)' : 'scale(0.5)',
                      transitionDelay: `${0.4 + i * 0.1}s`,
                    }}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div
              className="footer-reveal"
              style={{
                flex:            '1 1 160px',
                display:         'flex',
                flexDirection:   'column',
                gap:             '0.85rem',
                opacity:         footerVisible ? 1 : 0,
                transform:       footerVisible ? 'translateX(0)' : 'translateX(20px)',
                transitionDelay: '0.15s',
              }}
            >
              <p style={{
                color:         tokens.color.gold,
                fontSize:      tokens.font.label,
                fontWeight:    600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                margin:        0,
              }}>Quick Links</p>
              {QUICK_LINKS.map((link, i) => (
                <a
                  key={link}
                  href="#"
                  className="quick-link footer-reveal-fast"
                  style={{
                    color:           tokens.color.whiteDim,
                    fontSize:        tokens.font.quickLink,
                    fontWeight:      500,
                    textDecoration:  'none',
                    opacity:         footerVisible ? 1 : 0,
                    transform:       footerVisible ? 'translateX(0)' : 'translateX(20px)',
                    transitionDelay: `${0.25 + i * 0.08}s`,
                  }}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Locations */}
            <div
              className="footer-reveal"
              style={{
                flex:            '1 1 160px',
                display:         'flex',
                flexDirection:   'column',
                gap:             '0.85rem',
                opacity:         footerVisible ? 1 : 0,
                transform:       footerVisible ? 'translateX(0)' : 'translateX(20px)',
                transitionDelay: '0.25s',
              }}
            >
              <p style={{
                color:         tokens.color.gold,
                fontSize:      tokens.font.label,
                fontWeight:    600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                margin:        0,
              }}>Our Locations</p>
              {LOCATIONS.map((loc, i) => (
                <div
                  key={loc}
                  className="footer-reveal-fast"
                  style={{
                    display:         'flex',
                    alignItems:      'flex-start',
                    gap:             '8px',
                    opacity:         footerVisible ? 1 : 0,
                    transform:       footerVisible ? 'translateX(0)' : 'translateX(20px)',
                    transitionDelay: `${0.35 + i * 0.08}s`,
                  }}
                >
                  <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}>
                    <IconLocation />
                  </span>
                  <p style={{
                    color:      tokens.color.whiteDim,
                    fontSize:   tokens.font.quickLink,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    margin:     0,
                  }}>{loc}</p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div
              className="footer-reveal"
              style={{
                flex:            '1 1 160px',
                display:         'flex',
                flexDirection:   'column',
                gap:             '0.85rem',
                opacity:         footerVisible ? 1 : 0,
                transform:       footerVisible ? 'translateX(0)' : 'translateX(40px)',
                transitionDelay: '0.35s',
              }}
            >
              <p style={{
                color:         tokens.color.gold,
                fontSize:      tokens.font.label,
                fontWeight:    600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                margin:        0,
              }}>Contact Us</p>
              {[
                { Icon: IconPhone,    text: '+94 77 233 6233'                },
                { Icon: IconMail,     text: 'hello@sayobeauty.com'           },
                { Icon: IconLocation, text: '123 Galle Road, Colombo, Sri Lanka' },
              ].map(({ Icon, text }, i) => (
                <div
                  key={text}
                  className="footer-reveal-fast"
                  style={{
                    display:         'flex',
                    alignItems:      'flex-start',
                    gap:             '8px',
                    opacity:         footerVisible ? 1 : 0,
                    transform:       footerVisible ? 'translateX(0)' : 'translateX(20px)',
                    transitionDelay: `${0.45 + i * 0.08}s`,
                  }}
                >
                  <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}>
                    <Icon />
                  </span>
                  <p style={{
                    color:      tokens.color.whiteDim,
                    fontSize:   tokens.font.quickLink,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    margin:     0,
                  }}>{text}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Copyright */}
          <div
            className="footer-reveal-simple"
            style={{
              position:        'relative',
              zIndex:          10,
              marginTop:       'clamp(2rem, 4vw, 2.5rem)',
              paddingTop:      'clamp(1rem, 2vw, 1.5rem)',
              borderTop:       `1px solid ${tokens.color.whiteBorder}`,
              opacity:         footerVisible ? 1 : 0,
              transitionDelay: '0.7s',
            }}
          >
            <p style={{ color: tokens.color.whiteFaint, fontSize: '0.813rem', textAlign: 'center', margin: 0 }}>
              © {new Date().getFullYear()} SAYO Beauty. All rights reserved.
            </p>
          </div>
        </footer>

      </main>
    </>
  );
}