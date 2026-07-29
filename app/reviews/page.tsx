//review page
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import sayoLogo from '../../public/sayologo.png';

/* ─────────────────────────────────────────
   DESIGN TOKENS (identical to services page)
───────────────────────────────────────── */
const tokens = {
  color: {
    gold:        '#B8860B',
    goldAlpha:   'rgba(184,134,11,0.69)',
    goldMuted:   'rgba(184,134,11,0.37)',
    goldTab:     'rgba(184,134,11,0.49)',
    goldLight:   'rgba(184,134,11,0.15)',
    bgDark:      '#040405',
    bgFooter:    '#1a1a1a',
    navBg:       'rgba(68,68,68,0.40)',
    white:       '#ffffff',
    whiteMuted:  'rgba(255,255,255,0.80)',
    whiteDim:    'rgba(255,255,255,0.70)',
    whiteFaint:  'rgba(255,255,255,0.35)',
    whiteBorder: 'rgba(255,255,255,0.10)',
  },
  font: {
    family:    'Inter, sans-serif',
    nav:       'clamp(0.875rem, 1.2vw, 1.05rem)',
    logoText:  'clamp(1.125rem, 1.5vw, 1.375rem)',
    heroTitle: 'clamp(2rem, 4.5vw, 4rem)',
    heroSub:   'clamp(0.9rem, 1.6vw, 1.4rem)',
    section:   'clamp(1.1rem, 2vw, 1.6rem)',
    tabLabel:  'clamp(0.9rem, 1.6vw, 1.4rem)',
    label:     '0.75rem',
    tagline:   'clamp(0.875rem, 1.2vw, 1rem)',
    brand:     'clamp(1.5rem, 3vw, 2.5rem)',
  },
  radius: {
    nav:  '0.75rem',
    card: '1.25rem',
    pill: '1.25rem',
    icon: '9999px',
  },
  layout: {
    maxWidth: '108rem',
    inner:    '86rem',
  },
} as const;

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
const ACTIVE_NAV = 'REVIEWS';

const QUICK_LINKS = ['Home', 'Services', 'Products', 'Reviews'] as const;
const LOCATIONS   = ['Colombo', 'Negombo', 'Kiribathgoda'] as const;

/* ─────────────────────────────────────────
   REVIEW DATA
───────────────────────────────────────── */
type Review = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
  location: string;
};

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Anika Perera',
    avatar: 'AP',
    rating: 5,
    date: '2024-12-15',
    service: 'Bridal Package',
    comment:
      'Absolutely stunning experience! The team made me feel like royalty on my wedding day. Every detail was perfect — from the hair to the makeup. I received so many compliments. SAYO truly delivers luxury.',
    location: 'Colombo',
  },
  {
    id: 2,
    name: 'Dilshan Fernando',
    avatar: 'DF',
    rating: 5,
    date: '2024-12-08',
    service: 'Hair & Grooming',
    comment:
      'Came in for a haircut and beard trim. The stylist really listened to what I wanted and delivered beyond expectations. The atmosphere is incredibly relaxing. Will definitely be returning.',
    location: 'Negombo',
  },
  {
    id: 3,
    name: 'Shalini Jayawardena',
    avatar: 'SJ',
    rating: 5,
    date: '2024-11-29',
    service: 'Gold Facial',
    comment:
      'My skin has never felt this smooth! The gold facial treatment was pure indulgence. The staff were professional and knowledgeable. A truly premium experience worth every rupee.',
    location: 'Colombo',
  },
  {
    id: 4,
    name: 'Rohan Wickramasinghe',
    avatar: 'RW',
    rating: 4,
    date: '2024-11-20',
    service: 'Deep Tissue Massage',
    comment:
      'Great massage therapy session. The therapist was skilled and addressed all my problem areas. The ambiance was calming with beautiful music. Slight wait time but overall excellent service.',
    location: 'Kiribathgoda',
  },
  {
    id: 5,
    name: 'Priya Kumari',
    avatar: 'PK',
    rating: 5,
    date: '2024-11-10',
    service: 'Gel Manicure & Pedicure',
    comment:
      'The nail art they created was exactly what I had in mind! Super talented nail technicians. The salon is spotless and the products they use are top quality. My nails lasted over three weeks.',
    location: 'Colombo',
  },
  {
    id: 6,
    name: 'Kasun Bandara',
    avatar: 'KB',
    rating: 5,
    date: '2024-10-30',
    service: 'Groom Package',
    comment:
      'Booked the full groom package for my wedding. From the moment I walked in I felt taken care of. The team is professional, friendly, and incredibly talented. Highly recommend SAYO to every groom.',
    location: 'Negombo',
  },
  {
    id: 7,
    name: 'Nadeesha Silva',
    avatar: 'NS',
    rating: 4,
    date: '2024-10-18',
    service: 'Aromatherapy Massage',
    comment:
      'The aromatherapy session was deeply relaxing. Beautiful selection of essential oils and a very soothing environment. I walked out feeling completely rejuvenated. Will book again soon.',
    location: 'Colombo',
  },
  {
    id: 8,
    name: 'Tharushi Mendis',
    avatar: 'TM',
    rating: 5,
    date: '2024-10-05',
    service: 'Full Body Wax',
    comment:
      'Professional, hygienic, and efficient. The waxing specialists made the process very comfortable. The results were smooth and long-lasting. Excellent value for the quality delivered.',
    location: 'Kiribathgoda',
  },
  {
    id: 9,
    name: 'Chamara Rathnayake',
    avatar: 'CR',
    rating: 5,
    date: '2024-09-22',
    service: 'Skin Brightening',
    comment:
      'Noticed a visible difference after just one session! The skincare specialists are very knowledgeable and recommended the perfect treatment for my skin type. My confidence has skyrocketed.',
    location: 'Colombo',
  },
];

const FILTER_OPTIONS = ['All', 'Colombo', 'Negombo', 'Kiribathgoda'] as const;
const SORT_OPTIONS   = ['Newest', 'Highest Rated', 'Lowest Rated'] as const;

type FilterOption = typeof FILTER_OPTIONS[number];
type SortOption   = typeof SORT_OPTIONS[number];

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #040405; }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes pulseGold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(184,134,11,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(184,134,11,0); }
  }

  .nav-animate  { animation: fadeInDown 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
  .logo-float   { animation: floatY 4s ease-in-out 1.5s infinite; }
  .reveal-up    { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .reveal-fade  { animation: fadeIn 1s ease both; }

  .nav-link-wrap { position: relative; display: inline-block; }
  .nav-link-wrap::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 0;
    width: 0; height: 2px;
    background: #B8860B;
    transition: width 0.3s ease;
  }
  .nav-link-wrap:hover::after { width: 100%; }

  .contact-btn-wrap { position: relative; overflow: hidden; }
  .contact-btn-wrap::before {
    content: '';
    position: absolute;
    inset: 0;
    background: white;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    z-index: -1;
  }
  .contact-btn-wrap:hover::before { transform: scaleX(1); }
  .contact-btn-wrap:hover { color: #000 !important; }

  /* Review cards */
  .review-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 1.25rem;
    padding: clamp(1.25rem, 2.5vw, 1.875rem);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                border-color 0.3s ease,
                box-shadow 0.35s ease;
    cursor: default;
    animation: cardReveal 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  .review-card:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: rgba(184,134,11,0.45);
    box-shadow: 0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(184,134,11,0.2);
  }

  /* Filter / sort pills */
  .filter-pill {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: Inter, sans-serif;
    font-size: clamp(0.75rem, 1.1vw, 0.875rem);
    font-weight: 500;
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    transition: background 0.25s, color 0.25s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
    white-space: nowrap;
  }
  .filter-pill:hover { transform: translateY(-2px); }
  .filter-pill-active {
    background: #B8860B;
    color: #fff;
    box-shadow: 0 6px 20px rgba(184,134,11,0.4);
  }
  .filter-pill-inactive {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.70);
    border: 1.5px solid rgba(255,255,255,0.15);
  }
  .filter-pill-inactive:hover {
    background: rgba(184,134,11,0.15);
    border-color: rgba(184,134,11,0.45);
    color: #fff;
  }

  /* Sort select */
  .sort-select {
    background: rgba(255,255,255,0.06);
    border: 1.5px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.80);
    border-radius: 9999px;
    padding: 0.5rem 2rem 0.5rem 1.25rem;
    font-family: Inter, sans-serif;
    font-size: clamp(0.75rem, 1.1vw, 0.875rem);
    font-weight: 500;
    cursor: pointer;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B8860B' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    transition: border-color 0.25s, background-color 0.25s;
  }
  .sort-select:hover, .sort-select:focus {
    border-color: rgba(184,134,11,0.5);
    background-color: rgba(184,134,11,0.08);
  }
  .sort-select option {
    background: #1a1a1a;
    color: #fff;
  }

  /* Star */
  .star-filled { color: #B8860B; }
  .star-empty  { color: rgba(255,255,255,0.2); }

  /* Stats bar */
  .stat-bar-bg {
    flex: 1;
    height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 999px;
    overflow: hidden;
  }
  .stat-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #B8860B, #d4a017);
    border-radius: 999px;
    transition: width 1.2s cubic-bezier(0.16,1,0.3,1);
  }

  /* Avatar */
  .avatar {
    width: 44px; height: 44px;
    border-radius: 9999px;
    background: linear-gradient(135deg, rgba(184,134,11,0.6), rgba(184,134,11,0.2));
    border: 1.5px solid rgba(184,134,11,0.5);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 700;
    color: #B8860B;
    flex-shrink: 0;
    letter-spacing: 0.05em;
  }

  /* Service badge */
  .service-badge {
    display: inline-block;
    background: rgba(184,134,11,0.15);
    border: 1px solid rgba(184,134,11,0.35);
    color: #B8860B;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
  }

  /* Location badge */
  .location-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.55);
    font-size: 0.72rem;
    font-weight: 500;
    padding: 0.25rem 0.65rem;
    border-radius: 9999px;
  }

  /* Review grid */
  .reviews-grid {
    display: grid;
    gap: clamp(1rem, 2vw, 1.5rem);
    grid-template-columns: 1fr;
  }
  @media (min-width: 640px) {
    .reviews-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1100px) {
    .reviews-grid { grid-template-columns: repeat(3, 1fr); }
  }

  /* Summary card */
  .summary-card {
    background: rgba(184,134,11,0.08);
    border: 1px solid rgba(184,134,11,0.25);
    border-radius: 1.25rem;
    padding: clamp(1.5rem, 3vw, 2.25rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    animation: pulseGold 3s ease infinite;
  }

  /* Footer styles (mirrored) */
  .social-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.15);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s, border-color 0.3s;
    color: white; text-decoration: none;
  }
  .social-icon:hover {
    transform: scale(1.12) translateY(-3px);
    background: #B8860B; border-color: #B8860B;
  }

  .footer-grid { display: flex; flex-direction: column; flex-wrap: wrap; gap: 2.5rem; }
  @media (min-width: 1024px) {
    .footer-grid { flex-direction: row; flex-wrap: nowrap; justify-content: space-between; align-items: flex-start; }
  }
  @media (min-width: 640px) and (max-width: 1023px) {
    .footer-grid { flex-direction: row; flex-wrap: wrap; justify-content: space-between; }
  }

  .footer-reveal       { transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .footer-reveal-fast  { transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1); }
  .footer-reveal-bounce{ transition: opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  .footer-reveal-simple{ transition: opacity 1s ease; }

  .quick-link { position: relative; transition: padding-left 0.25s, color 0.25s; }
  .quick-link:hover { padding-left: 8px; color: #B8860B !important; }
  .quick-link::before {
    content: '›'; position: absolute; left: -4px;
    opacity: 0; transition: opacity 0.25s, left 0.25s; color: #B8860B;
  }
  .quick-link:hover::before { opacity: 1; left: 0; }

  .empty-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 1rem;
    padding: 4rem 2rem; text-align: center;
    opacity: 0; animation: fadeIn 0.6s ease 0.2s both;
  }
`;

/* ─────────────────────────────────────────
   NAV STYLES
───────────────────────────────────────── */
const S = {
  nav: {
    position: 'relative' as const,
    zIndex: 20,
    padding: 'clamp(1rem, 3vw, 3rem) clamp(1rem, 3vw, 3.125rem)',
  },
  navInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: tokens.color.navBg,
    borderRadius: tokens.radius.nav,
    padding: 'clamp(0.75rem, 2vw, 1.5rem) clamp(1rem, 2vw, 2rem)',
    backdropFilter: 'blur(8px)',
    minHeight: '3.5rem',
  } as React.CSSProperties,
  logoWrap: {
    display: 'flex', alignItems: 'center',
    gap: 'clamp(0.5rem, 1vw, 0.75rem)',
  } as React.CSSProperties,
  logoText: {
    color: tokens.color.white,
    fontSize: tokens.font.logoText,
    fontWeight: 600,
    letterSpacing: '0.15em',
  } as React.CSSProperties,
  navLinks: {
    display: 'flex', alignItems: 'center',
    gap: 'clamp(1.25rem, 2.5vw, 2.5rem)',
  } as React.CSSProperties,
  navLink: {
    fontSize: tokens.font.nav,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  contactBtn: {
    color: tokens.color.white,
    fontSize: tokens.font.nav,
    fontWeight: 500,
    textDecoration: 'none',
    border: `3px solid ${tokens.color.white}`,
    borderRadius: tokens.radius.nav,
    padding: 'clamp(0.375rem, 0.5vw, 0.5rem) clamp(1rem, 1.5vw, 1.75rem)',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap' as const,
    position: 'relative' as const,
    zIndex: 1,
  } as React.CSSProperties,
  mobileMenu: {
    marginTop: '0.5rem',
    background: 'rgba(0,0,0,0.92)',
    borderRadius: tokens.radius.nav,
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  } as React.CSSProperties,
  mobileNavLink: {
    color: tokens.color.white,
    fontSize: '1rem',
    fontWeight: 500,
    textDecoration: 'none',
  } as React.CSSProperties,
  mobileContact: {
    color: tokens.color.white,
    fontSize: '1rem',
    textAlign: 'center' as const,
    padding: '0.625rem 0',
    borderRadius: '0.75rem',
    border: `2px solid ${tokens.color.white}`,
    textDecoration: 'none',
    transition: 'all 0.2s',
  } as React.CSSProperties,
};

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
function LogoIcon({ className = '', size = 48 }: { className?: string; size?: number }) {
  return (
    <Image
      src={sayoLogo}
      alt="SAYO Logo"
      width={size}
      height={size}
      className={className}
      style={{ width: 'clamp(2rem, 4vw, 3.5rem)', height: 'auto', objectFit: 'contain' }}
      priority
    />
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth={filled ? 0 : 1.5}
      className={filled ? 'star-filled' : 'star-empty'}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function MapPinIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.24-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.86c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.4.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.35 1.05.4 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.4 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.35-2.22.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.22-.4a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.35-1.05-.4-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.8.4-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.35 2.22-.4 1.27-.06 1.65-.07 4.85-.07zm0-2.16C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39A5.87 5.87 0 0 0 .62 4.15C.32 4.9.12 5.78.06 7.05.01 8.33 0 8.74 0 12s.01 3.67.06 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.3 1.64.5 2.91.56C8.33 24 8.74 24 12 24s3.67-.01 4.95-.06c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.39.67-.67 1.08-1.34 1.39-2.13.3-.76.5-1.64.56-2.91.06-1.28.06-1.69.06-4.95s0-3.67-.06-4.95c-.06-1.27-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.39-2.13A5.87 5.87 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
    </svg>
  );
}

function IconPhoneFooter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function IconMailFooter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function IconMapPinFooter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function Divider() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '0 clamp(1rem, 4vw, 3.5rem)' }}>
      <div
        style={{
          width: '100%',
          maxWidth: tokens.layout.inner,
          height: '1px',
          background: 'rgba(255,255,255,0.5)',
        }}
      />
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= rating} />
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

/* ─────────────────────────────────────────
   REVIEW CARD
───────────────────────────────────────── */
function ReviewCard({ review, delay }: { review: Review; delay: number }) {
  return (
    <div className="review-card" style={{ animationDelay: `${delay}s` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
        <div className="avatar">{review.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            color: tokens.color.white,
            fontSize: 'clamp(0.875rem, 1.3vw, 1rem)',
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.3,
          }}>
            {review.name}
          </p>
          <p style={{
            color: tokens.color.whiteFaint,
            fontSize: '0.72rem',
            margin: '0.2rem 0 0',
            fontWeight: 400,
          }}>
            {formatDate(review.date)}
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <Stars rating={review.rating} />
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="service-badge">{review.service}</span>
        <span className="location-badge">
          <MapPinIcon size={10} />
          {review.location}
        </span>
      </div>

      {/* Comment */}
      <p style={{
        color: tokens.color.whiteDim,
        fontSize: 'clamp(0.825rem, 1.1vw, 0.9rem)',
        lineHeight: 1.75,
        margin: 0,
        flexGrow: 1,
      }}>
        &ldquo;{review.comment}&rdquo;
      </p>

      {/* Gold accent bar */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, rgba(184,134,11,0.6), transparent)',
        borderRadius: '999px',
        marginTop: '0.25rem',
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   RATING SUMMARY
───────────────────────────────────────── */
function RatingSummary({ reviews, visible }: { reviews: Review[]; visible: boolean }) {
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const counts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  return (
    <div style={{
      display: 'flex',
      gap: 'clamp(1.5rem, 3vw, 3rem)',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: tokens.layout.inner,
      margin: '0 auto',
    }}>
      {/* Big number */}
      <div className="summary-card" style={{ minWidth: '160px' }}>
        <p style={{
          color: tokens.color.gold,
          fontSize: 'clamp(3rem, 6vw, 4.5rem)',
          fontWeight: 700,
          lineHeight: 1,
          margin: 0,
        }}>
          {avg.toFixed(1)}
        </p>
        <Stars rating={Math.round(avg)} />
        <p style={{
          color: tokens.color.whiteFaint,
          fontSize: '0.8rem',
          margin: '0.25rem 0 0',
        }}>
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Bar breakdown */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem',
        flex: '1 1 260px',
        maxWidth: '380px',
      }}>
        {counts.map(({ star, count }, i) => {
          const pct = reviews.length ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                color: tokens.color.whiteDim,
                fontSize: '0.78rem',
                fontWeight: 500,
                width: '12px',
                textAlign: 'right',
                flexShrink: 0,
              }}>
                {star}
              </span>
              <StarIcon filled />
              <div className="stat-bar-bg">
                <div
                  className="stat-bar-fill"
                  style={{ width: visible ? `${pct}%` : '0%', transitionDelay: `${0.3 + i * 0.1}s` }}
                />
              </div>
              <span style={{
                color: tokens.color.whiteFaint,
                fontSize: '0.72rem',
                width: '28px',
                textAlign: 'right',
                flexShrink: 0,
              }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function ReviewsPage() {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [loaded,    setLoaded]    = useState(false);
  const [filter,    setFilter]    = useState<FilterOption>('All');
  const [sort,      setSort]      = useState<SortOption>('Newest');

  const isMobile = useIsMobile(1024);

  const { ref: heroRef,    inView: heroVisible    } = useInView(0.05);
  const { ref: summaryRef, inView: summaryVisible } = useInView(0.1);
  const { ref: filterRef,  inView: filterVisible  } = useInView(0.1);
  const { ref: gridRef,    inView: gridVisible    } = useInView(0.05);
  const { ref: footerRef,  inView: footerVisible  } = useInView(0.1);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* ── Derived list ── */
  const filtered = REVIEWS.filter(r =>
    filter === 'All' || r.location === filter
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'Newest')        return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sort === 'Highest Rated') return b.rating - a.rating;
    if (sort === 'Lowest Rated')  return a.rating - b.rating;
    return 0;
  });

  return (
    <>
      <style>{globalCss}</style>

      <main style={{
        minHeight: '100vh',
        backgroundColor: 'transparent',
        fontFamily: tokens.font.family,
        color: tokens.color.white,
      }}>

        {/* ── Background ── */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <Image
            src="/services-bg.jpg"
            alt="Reviews background"
            fill priority sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(0deg, rgba(4,4,5,0.6) 0%, transparent 30%)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* ══════════════ NAVBAR ══════════════ */}
          <nav
            className={loaded ? 'nav-animate' : ''}
            style={{ ...S.nav, opacity: loaded ? undefined : 0 }}
          >
            <div style={S.navInner}>
              {/* Logo */}
              <div style={S.logoWrap}>
                <LogoIcon className="logo-float" />
                <span style={S.logoText}>SAYO</span>
              </div>

              {/* Desktop links */}
              {!isMobile && (
                <div style={S.navLinks}>
                  {NAV_ITEMS.map((item) => {
                    const isActive = item === ACTIVE_NAV;
                    return (
                      <a
                        key={item}
                        href={NAV_HREFS[item]}
                        className="nav-link-wrap"
                        style={{
                          ...S.navLink,
                          color: isActive ? tokens.color.gold : tokens.color.white,
                        }}
                        onMouseEnter={e => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.color = tokens.color.gold;
                        }}
                        onMouseLeave={e => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.color = tokens.color.white;
                        }}
                      >
                        {isActive ? `[ ${item} ]` : item}
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Contact button */}
              {!isMobile && (
                <a href="/contact" className="contact-btn-wrap" style={S.contactBtn}>
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
                    color: tokens.color.white, cursor: 'pointer',
                    padding: '0.5rem', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {menuOpen ? (
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <>
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </>
                    )}
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile menu */}
            {isMobile && menuOpen && (
              <div style={{ ...S.mobileMenu, animation: 'fadeInDown 0.3s ease both' }}>
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item}
                    href={NAV_HREFS[item]}
                    style={{
                      ...S.mobileNavLink,
                      color: item === ACTIVE_NAV ? tokens.color.gold : tokens.color.white,
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item === ACTIVE_NAV ? `[ ${item} ]` : item}
                  </a>
                ))}
                <a href="/contact" style={S.mobileContact} onClick={() => setMenuOpen(false)}>
                  CONTACT US
                </a>
              </div>
            )}
          </nav>

          {/* ══════════════ HERO ══════════════ */}
          <div
            ref={heroRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: 'clamp(2rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem)',
              gap: 'clamp(1.25rem, 2.5vw, 2rem)',
            }}
          >
            <p
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                color: tokens.color.gold,
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                margin: 0,
                opacity: heroVisible ? 1 : 0,
                animationDelay: '0.05s',
              }}
            >
              Client Stories
            </p>

            <h1
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                color: tokens.color.white,
                fontSize: tokens.font.heroTitle,
                fontWeight: 500,
                lineHeight: 1.2,
                maxWidth: '52rem',
                margin: 0,
                opacity: heroVisible ? 1 : 0,
                animationDelay: '0.15s',
                textShadow: '0 4px 40px rgba(0,0,0,0.4)',
              }}
            >
              What Our Clients{' '}
              <span style={{ color: tokens.color.gold }}>Say About Us</span>
            </h1>

            <p
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                color: tokens.color.whiteMuted,
                fontSize: tokens.font.heroSub,
                fontWeight: 500,
                lineHeight: 1.7,
                maxWidth: '48rem',
                margin: 0,
                opacity: heroVisible ? 1 : 0,
                animationDelay: '0.28s',
              }}
            >
              Real experiences from real clients. Discover why SAYO is
              Sri Lanka&apos;s most trusted luxury beauty destination.
            </p>
          </div>

          <Divider />

          {/* ══════════════ RATING SUMMARY ══════════════ */}
          <div
            ref={summaryRef}
            style={{
              padding: 'clamp(2rem, 4vw, 3.25rem) clamp(1.25rem, 5vw, 4rem)',
              opacity: summaryVisible ? 1 : 0,
              transform: summaryVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <RatingSummary reviews={REVIEWS} visible={summaryVisible} />
          </div>

          <Divider />

          {/* ══════════════ FILTERS ══════════════ */}
          <div
            ref={filterRef}
            style={{
              padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.25rem, 5vw, 4rem)',
              opacity: filterVisible ? 1 : 0,
              transform: filterVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div style={{
              maxWidth: tokens.layout.inner,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              {/* Location filter pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`filter-pill ${filter === opt ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                  >
                    {opt === 'All' ? 'All Locations' : opt}
                  </button>
                ))}
              </div>

              {/* Sort dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{
                  color: tokens.color.whiteFaint,
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}>
                  Sort by
                </span>
                <select
                  className="sort-select"
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result count */}
            <div style={{
              maxWidth: tokens.layout.inner,
              margin: '1rem auto 0',
            }}>
              <p style={{
                color: tokens.color.whiteFaint,
                fontSize: '0.8rem',
                fontWeight: 500,
              }}>
                Showing{' '}
                <span style={{ color: tokens.color.gold, fontWeight: 600 }}>
                  {sorted.length}
                </span>{' '}
                review{sorted.length !== 1 ? 's' : ''}
                {filter !== 'All' && (
                  <> in <span style={{ color: tokens.color.gold }}>{filter}</span></>
                )}
              </p>
            </div>
          </div>

          {/* ══════════════ REVIEWS GRID ══════════════ */}
          <div
            ref={gridRef}
            style={{
              padding: '0 clamp(1.25rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)',
              opacity: gridVisible ? 1 : 0,
              transform: gridVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div style={{ maxWidth: tokens.layout.inner, margin: '0 auto' }}>
              {sorted.length === 0 ? (
                <div className="empty-state">
                  <div style={{
                    width: '64px', height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(184,134,11,0.12)',
                    border: '1.5px solid rgba(184,134,11,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p style={{ color: tokens.color.whiteMuted, fontSize: '1rem', fontWeight: 500 }}>
                    No reviews found for this location yet.
                  </p>
                  <button
                    onClick={() => setFilter('All')}
                    className="filter-pill filter-pill-active"
                  >
                    View all reviews
                  </button>
                </div>
              ) : (
                <div className="reviews-grid">
                  {sorted.map((review, i) => (
                    <ReviewCard
                      key={`${review.id}-${filter}-${sort}`}
                      review={review}
                      delay={gridVisible ? i * 0.07 : 0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* ══════════════ FOOTER ══════════════ */}
          <footer
            ref={footerRef}
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: tokens.color.bgFooter,
              padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 5.188rem)',
              marginTop: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            <div className="footer-grid" style={{ position: 'relative', zIndex: 10 }}>

              {/* Brand column */}
              <div
                className="footer-reveal"
                style={{
                  flex: '1 1 260px', maxWidth: '320px',
                  display: 'flex', flexDirection: 'column', gap: '1rem',
                  opacity: footerVisible ? 1 : 0,
                  transform: footerVisible ? 'translateX(0)' : 'translateX(-40px)',
                  transitionDelay: '0s',
                }}
              >
                <LogoIcon size={56} />
                <h2 style={{
                  color: tokens.color.white,
                  fontSize: tokens.font.brand,
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  margin: 0,
                }}>
                  SAYO
                </h2>
                <p style={{
                  color: tokens.color.whiteMuted,
                  fontSize: tokens.font.tagline,
                  lineHeight: 1.6, margin: 0, maxWidth: '260px',
                }}>
                  We are experienced in making you more beautiful
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {[
                    { label: 'WhatsApp', Icon: IconWhatsApp },
                    { label: 'Facebook', Icon: IconFacebook },
                    { label: 'Instagram', Icon: IconInstagram },
                  ].map(({ label, Icon }, i) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="social-icon footer-reveal-bounce"
                      style={{
                        color: tokens.color.white,
                        opacity: footerVisible ? 1 : 0,
                        transform: footerVisible ? 'scale(1)' : 'scale(0.5)',
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
                  flex: '1 1 160px',
                  display: 'flex', flexDirection: 'column', gap: '0.85rem',
                  opacity: footerVisible ? 1 : 0,
                  transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
                  transitionDelay: '0.15s',
                }}
              >
                <p style={{
                  color: tokens.color.gold,
                  fontSize: tokens.font.label,
                  fontWeight: 600, letterSpacing: '0.15em',
                  textTransform: 'uppercase', margin: 0,
                }}>
                  Quick Links
                </p>
                {QUICK_LINKS.map((link, i) => (
                  <a
                    key={link}
                    href="#"
                    className="quick-link footer-reveal-fast"
                    style={{
                      color: tokens.color.whiteDim,
                      fontSize: '0.875rem', fontWeight: 500,
                      textDecoration: 'none',
                      opacity: footerVisible ? 1 : 0,
                      transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
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
                  flex: '1 1 160px',
                  display: 'flex', flexDirection: 'column', gap: '0.85rem',
                  opacity: footerVisible ? 1 : 0,
                  transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
                  transitionDelay: '0.25s',
                }}
              >
                <p style={{
                  color: tokens.color.gold,
                  fontSize: tokens.font.label,
                  fontWeight: 600, letterSpacing: '0.15em',
                  textTransform: 'uppercase', margin: 0,
                }}>
                  Our Locations
                </p>
                {LOCATIONS.map((loc, i) => (
                  <div
                    key={loc}
                    className="footer-reveal-fast"
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      opacity: footerVisible ? 1 : 0,
                      transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
                      transitionDelay: `${0.35 + i * 0.08}s`,
                    }}
                  >
                    <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}>
                      <IconMapPinFooter />
                    </span>
                    <p style={{
                      color: tokens.color.whiteDim,
                      fontSize: '0.875rem', fontWeight: 500,
                      lineHeight: 1.5, margin: 0,
                    }}>
                      {loc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div
                className="footer-reveal"
                style={{
                  flex: '1 1 160px',
                  display: 'flex', flexDirection: 'column', gap: '0.85rem',
                  opacity: footerVisible ? 1 : 0,
                  transform: footerVisible ? 'translateX(0)' : 'translateX(40px)',
                  transitionDelay: '0.35s',
                }}
              >
                <p style={{
                  color: tokens.color.gold,
                  fontSize: tokens.font.label,
                  fontWeight: 600, letterSpacing: '0.15em',
                  textTransform: 'uppercase', margin: 0,
                }}>
                  Contact Us
                </p>
                {[
                  { Icon: IconPhoneFooter, text: '+94 77 233 6233' },
                  { Icon: IconMailFooter,  text: 'Example@email.com' },
                  { Icon: IconMapPinFooter, text: 'No. 45, Galle Road, Colombo 03, Sri Lanka' },
                ].map(({ Icon, text }, i) => (
                  <div
                    key={text}
                    className="footer-reveal-fast"
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      opacity: footerVisible ? 1 : 0,
                      transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
                      transitionDelay: `${0.45 + i * 0.08}s`,
                    }}
                  >
                    <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}>
                      <Icon />
                    </span>
                    <p style={{
                      color: tokens.color.whiteDim,
                      fontSize: '0.875rem', fontWeight: 500,
                      lineHeight: 1.5, margin: 0,
                    }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div
              className="footer-reveal-simple"
              style={{
                position: 'relative', zIndex: 10,
                marginTop: 'clamp(2rem, 4vw, 2.5rem)',
                paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
                borderTop: `1px solid ${tokens.color.whiteBorder}`,
                opacity: footerVisible ? 1 : 0,
                transitionDelay: '0.7s',
              }}
            >
              <p style={{
                color: tokens.color.whiteFaint,
                fontSize: '0.813rem',
                textAlign: 'center', margin: 0,
              }}>
                © {new Date().getFullYear()} SAYO Beauty. All rights reserved.
              </p>
            </div>
          </footer>

        </div>
      </main>
    </>
  );
}