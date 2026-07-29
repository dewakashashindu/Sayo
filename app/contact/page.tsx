//contact page
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
    goldMuted:   'rgba(184,134,11,0.37)',
    goldCard:    'rgba(184,134,11,0.49)',
    goldLight:   'rgba(184,134,11,0.15)',
    bgDark:      '#040405',
    bgFooter:    '#1a1a1a',
    navBg:       'rgba(68,68,68,0.40)',
    cardBg:      'rgba(40,40,40,0.88)',
    inputBg:     'rgba(87,87,87,0.62)',
    iconBg:      'rgba(68,68,68,0.40)',
    white:       '#ffffff',
    whiteMuted:  'rgba(255,255,255,0.75)',
    whiteDim:    'rgba(255,255,255,0.70)',
    whiteDim69:  'rgba(255,255,255,0.69)',
    whiteFaint:  'rgba(255,255,255,0.35)',
    whiteBorder: 'rgba(255,255,255,0.10)',
  },
  font: {
    family:    'Inter, sans-serif',
    nav:       'clamp(0.875rem, 1.2vw, 1rem)',
    logoText:  'clamp(1.125rem, 1.5vw, 1.375rem)',
    heroTitle: 'clamp(2.5rem, 7vw, 6rem)',
    heroSub:   'clamp(0.875rem, 1.4vw, 1.1rem)',
    label:     '0.75rem',
    quickLink: '0.875rem',
    brand:     'clamp(1.5rem, 3vw, 2.5rem)',
    tagline:   'clamp(0.875rem, 1.2vw, 1rem)',
  },
  radius: {
    nav:     '0.75rem',
    contact: '0.75rem',
    card:    '1.25rem',
    input:   '0.9375rem',
    dot:     '9999px',
    icon:    '9999px',
  },
} as const;

/* ─────────────────────────────────────────
   BRANCH LOCATIONS DATA
───────────────────────────────────────── */
const BRANCH_LOCATIONS = [
  {
    name:    'Colombo — Head Office',
    address: 'No. 45, Galle Road, Colombo 03, Sri Lanka',
    phone:   '0772336233',
    email:   'info@sayobeauty.com',
    isHead:  true,
    mapHref: 'https://maps.google.com/?q=45+Galle+Rd+Colombo+00500+Sri+Lanka',
  },
  {
    name:    'Negombo Branch',
    address: 'No. 12, Poruthota Road, Negombo, Sri Lanka',
    phone:   '0772336233',
    email:   'negombo@sayobeauty.com',
    isHead:  false,
    mapHref: 'https://maps.google.com/?q=Poruthota+Road+Negombo+Sri+Lanka',
  },
  {
    name:    'Kiribathgoda Branch',
    address: 'No. 78, Kandy Road, Kiribathgoda, Sri Lanka',
    phone:   '0772336233',
    email:   'kiribathgoda@sayobeauty.com',
    isHead:  false,
    mapHref: 'https://maps.google.com/?q=Kandy+Road+Kiribathgoda+Sri+Lanka',
  },
] as const;

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
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes bounceDown {
    0%, 100% { transform: translateY(0);   }
    50%       { transform: translateY(6px); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  .nav-animate  { animation: fadeInDown 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
  .logo-float   { animation: floatY 4s ease-in-out 1.5s infinite; }
  .reveal-up    { animation: fadeInUp    0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .reveal-left  { animation: fadeInLeft  0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .reveal-right { animation: fadeInRight 0.8s cubic-bezier(0.16,1,0.3,1) both; }

  /* ── Scroll indicator: outer wrapper stays horizontally centered,
       inner element bounces vertically only (no transform conflict) ── */
  .scroll-indicator-wrap {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    animation: bounceDown 1.5s ease-in-out infinite;
  }

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

  .hero-cta-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: #B8860B; color: #fff;
    font-size: clamp(0.8rem,1.2vw,0.95rem); font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
    padding: 0.875rem 2.25rem; border-radius: 9999px;
    transition: transform 0.25s, box-shadow 0.25s, background 0.25s;
    box-shadow: 0 6px 28px rgba(184,134,11,0.45);
  }
  .hero-cta-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 36px rgba(184,134,11,0.65);
    background: #a07509;
  }

  .hero-cta-secondary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.08); backdrop-filter: blur(8px);
    color: #fff; font-size: clamp(0.8rem,1.2vw,0.95rem); font-weight: 500;
    letter-spacing: 0.06em; text-decoration: none;
    padding: 0.875rem 2.25rem; border-radius: 9999px;
    border: 1.5px solid rgba(255,255,255,0.25);
    transition: transform 0.25s, border-color 0.25s, background 0.25s;
  }
  .hero-cta-secondary:hover {
    transform: translateY(-3px);
    border-color: #B8860B;
    background: rgba(184,134,11,0.15);
  }

  .submit-btn { transition: background 0.3s, transform 0.2s; cursor: pointer; }
  .submit-btn:hover { background: rgba(184,134,11,0.6) !important; transform: translateY(-2px); }
  .submit-btn:active { transform: translateY(0); }

  .view-map-btn { transition: background 0.3s, transform 0.2s !important; }
  .view-map-btn:hover { background: rgba(184,134,11,0.75) !important; transform: translateY(-2px) !important; }

  .branch-card { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease; }
  .branch-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(184,134,11,0.15); }

  .branch-map-link { transition: background 0.25s, color 0.25s, transform 0.25s; text-decoration: none; }
  .branch-map-link:hover { background: #B8860B !important; transform: translateY(-2px); }

  .social-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s, border-color 0.3s;
    color: white; text-decoration: none;
  }
  .social-icon:hover { transform: scale(1.12) translateY(-3px); background: #B8860B; border-color: #B8860B; }

  .input-field {
    width: 100%; background: rgba(87,87,87,0.62); border: none;
    border-radius: 0.9375rem; padding: 1.25rem 1.5rem;
    color: rgba(255,255,255,0.69); font-size: clamp(0.875rem,1.8vw,1.125rem);
    font-family: Inter, sans-serif; font-weight: 500; outline: none;
    transition: box-shadow 0.2s, background 0.2s; resize: none;
  }
  .input-field::placeholder { color: rgba(255,255,255,0.45); }
  .input-field:focus { background: rgba(87,87,87,0.85); box-shadow: 0 0 0 2px rgba(184,134,11,0.55); }

  .map-iframe {
    border: 0; position: absolute; inset: 0; width: 100%; height: 100%;
    filter: invert(90%) hue-rotate(180deg) saturate(0.85) brightness(0.9);
  }

  .footer-grid { display: flex; flex-direction: column; flex-wrap: wrap; gap: 2.5rem; }
  @media (min-width: 1024px) {
    .footer-grid { flex-direction: row; flex-wrap: nowrap; justify-content: space-between; align-items: flex-start; }
  }
  @media (min-width: 640px) and (max-width: 1023px) {
    .footer-grid { flex-direction: row; flex-wrap: wrap; justify-content: space-between; }
  }

  .footer-reveal { transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .footer-reveal-fast { transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1); }
  .footer-reveal-bounce { transition: opacity 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  .footer-reveal-simple { transition: opacity 1s ease; }

  .quick-link { position: relative; transition: padding-left 0.25s, color 0.25s; }
  .quick-link:hover { padding-left: 8px; color: #B8860B !important; }
  .quick-link::before {
    content: '›'; position: absolute; left: -4px; opacity: 0;
    transition: opacity 0.25s, left 0.25s; color: #B8860B;
  }
  .quick-link:hover::before { opacity: 1; left: 0; }

  @media (max-width: 768px) {
    .contact-grid  { grid-template-columns: 1fr !important; }
    .branches-grid { grid-template-columns: 1fr !important; }
  }
  @media (min-width: 769px) and (max-width: 1100px) {
    .branches-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 480px) {
    .hero-content { padding: 1.5rem !important; }
    .hero-cta-wrap { flex-direction: column !important; align-items: stretch !important; }
    .hero-cta-primary, .hero-cta-secondary { justify-content: center; }
  }
`;

/* ─────────────────────────────────────────
   NAV STYLES
───────────────────────────────────────── */
const S = {
  nav: {
    position: 'relative', zIndex: 20,
    padding: 'clamp(1rem, 3vw, 3rem) clamp(1rem, 3vw, 3.125rem)',
  } as React.CSSProperties,

  navInner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: tokens.color.navBg, borderRadius: tokens.radius.nav,
    padding: 'clamp(0.75rem, 2vw, 1.5rem) clamp(1rem, 2vw, 2rem)',
    backdropFilter: 'blur(8px)', minHeight: '3.5rem',
  } as React.CSSProperties,

  logoWrap: {
    display: 'flex', alignItems: 'center',
    gap: 'clamp(0.5rem, 1vw, 0.75rem)',
  } as React.CSSProperties,

  logoText: {
    color: tokens.color.white, fontSize: tokens.font.logoText,
    fontWeight: 600, letterSpacing: '0.15em',
  } as React.CSSProperties,

  navLinks: {
    display: 'flex', alignItems: 'center',
    gap: 'clamp(1.25rem, 2.5vw, 2.5rem)',
  } as React.CSSProperties,

  navLink: {
    color: tokens.color.white, fontSize: tokens.font.nav, fontWeight: 500,
    textDecoration: 'none', transition: 'color 0.2s', whiteSpace: 'nowrap',
  } as React.CSSProperties,

  contactBtnActive: {
    color: tokens.color.white, fontSize: tokens.font.nav, fontWeight: 500,
    textDecoration: 'none', border: `3px solid ${tokens.color.gold}`,
    borderRadius: tokens.radius.contact,
    padding: 'clamp(0.375rem, 0.5vw, 0.5rem) clamp(1rem, 1.5vw, 1.75rem)',
    transition: 'all 0.3s', whiteSpace: 'nowrap', position: 'relative', zIndex: 1,
  } as React.CSSProperties,

  mobileMenu: {
    marginTop: '0.5rem', background: 'rgba(0,0,0,0.92)',
    borderRadius: tokens.radius.nav, padding: '1rem 1.5rem',
    display: 'flex', flexDirection: 'column', gap: '1rem',
  } as React.CSSProperties,

  mobileNavLink: {
    color: tokens.color.white, fontSize: '1rem', fontWeight: 500, textDecoration: 'none',
  } as React.CSSProperties,

  mobileContact: {
    color: tokens.color.white, fontSize: '1rem', textAlign: 'center' as const,
    padding: '0.625rem 0', borderRadius: '0.75rem',
    border: `2px solid ${tokens.color.gold}`, textDecoration: 'none', transition: 'all 0.2s',
  } as React.CSSProperties,
};

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const NAV_ITEMS   = ['HOME', 'OUR STORY', 'SERVICES', 'PRODUCTS', 'REVIEWS'] as const;
const QUICK_LINKS = ['Home', 'Services', 'Products', 'Reviews'] as const;
const LOCATIONS   = ['Colombo', 'Negombo', 'Kiribathgoda'] as const;

const NAV_HREFS: Record<string, string> = {
  'HOME': '/', 'OUR STORY': '/about',
  'SERVICES': '/services', 'PRODUCTS': '/products', 'REVIEWS': '/reviews',
};

const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0558055526335!2d79.85803897585825!3d6.883918893115073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bc5b891a4b5%3A0xc60aa90940280873!2s45%2C%203%20Galle%20Rd%2C%20Colombo%2000500!5e0!3m2!1sen!2slk!4v1785130068196!5m2!1sen!2slk';

const MAP_OPEN_HREF = 'https://maps.google.com/?q=45+Galle+Rd+Colombo+00500+Sri+Lanka';

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
function LogoIcon({ className = '', size = 48 }: { className?: string; size?: number }) {
  return (
    <Image src={sayoLogo} alt="SAYO Logo" width={size} height={size} className={className}
      style={{ width: 'clamp(2rem, 4vw, 3.5rem)', height: 'auto', objectFit: 'contain' }} priority />
  );
}
function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>
    </svg>
  );
}
function IconLocation() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconMapPinSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconPhoneSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
    </svg>
  );
}
function IconMailSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.24-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/>
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
function IconInstagram() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.4.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.35 1.05.4 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.4 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.35-2.22.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.22-.4a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.35-1.05-.4-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.8.4-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.35 2.22-.4 1.27-.06 1.65-.07 4.85-.07zm0-2.16C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39A5.87 5.87 0 0 0 .62 4.15C.32 4.9.12 5.78.06 7.05.01 8.33 0 8.74 0 12s.01 3.67.06 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.3 1.64.5 2.91.56C8.33 24 8.74 24 12 24s3.67-.01 4.95-.06c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.39.67-.67 1.08-1.34 1.39-2.13.3-.76.5-1.64.56-2.91.06-1.28.06-1.69.06-4.95s0-3.67-.06-4.95c-.06-1.27-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.39-2.13A5.87 5.87 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
    </svg>
  );
}
function IconPhoneFooter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
    </svg>
  );
}
function IconMailFooter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>
    </svg>
  );
}
function IconMapPinFooter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}
function IconChat() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function IconPhoneCall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>
    </svg>
  );
}

/* Down-arrow icon used for the scroll indicator (matches reference image) */
function IconArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v15M5 12l7 7 7-7"/>
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
   BRANCH CARD
───────────────────────────────────────── */
function BranchCard({
  branch, visible, delay,
}: {
  branch: typeof BRANCH_LOCATIONS[number];
  visible: boolean;
  delay: string;
}) {
  return (
    <div
      className={`branch-card ${visible ? 'reveal-up' : ''}`}
      style={{
        background:     tokens.color.cardBg,
        borderRadius:   tokens.radius.card,
        overflow:       'hidden',
        opacity:        visible ? 1 : 0,
        animationDelay: delay,
        border:         branch.isHead
          ? '1px solid rgba(184,134,11,0.45)'
          : '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}
    >
      {branch.isHead && (
        <div style={{
          height:     '3px',
          background: `linear-gradient(90deg, ${tokens.color.gold}, rgba(184,134,11,0.3))`,
        }} />
      )}

      <div style={{ padding: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: tokens.radius.icon,
              background: branch.isHead ? 'rgba(184,134,11,0.20)' : tokens.color.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: tokens.color.gold,
              border: branch.isHead ? '1px solid rgba(184,134,11,0.35)' : 'none',
            }}>
              <IconBuilding />
            </div>
            <h3 style={{ color: tokens.color.white, fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
              {branch.name}
            </h3>
          </div>
          {branch.isHead && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              background: tokens.color.goldLight, border: '1px solid rgba(184,134,11,0.4)',
              borderRadius: tokens.radius.dot, padding: '0.25rem 0.75rem', flexShrink: 0,
              color: tokens.color.gold, fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              <IconStar /> Head Office
            </div>
          )}
        </div>

        <div style={{ height: '1px', background: tokens.color.whiteBorder, marginBottom: '1.125rem' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
            <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}><IconMapPinSm /></span>
            <p style={{ color: tokens.color.whiteMuted, fontSize: 'clamp(0.78rem, 1.2vw, 0.9rem)', fontWeight: 400, margin: 0, lineHeight: 1.55 }}>{branch.address}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ color: tokens.color.gold, flexShrink: 0 }}><IconPhoneSm /></span>
            <p style={{ color: tokens.color.whiteMuted, fontSize: 'clamp(0.78rem, 1.2vw, 0.9rem)', fontWeight: 400, margin: 0 }}>{branch.phone}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ color: tokens.color.gold, flexShrink: 0 }}><IconMailSm /></span>
            <p style={{ color: tokens.color.whiteMuted, fontSize: 'clamp(0.78rem, 1.2vw, 0.9rem)', fontWeight: 400, margin: 0 }}>{branch.email}</p>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <a
            href={branch.mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="branch-map-link"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: tokens.color.goldMuted, borderRadius: tokens.radius.dot,
              padding: '0.5rem 1.25rem', color: tokens.color.white,
              fontSize: 'clamp(0.72rem, 1.1vw, 0.825rem)', fontWeight: 500,
              letterSpacing: '0.06em',
            }}
          >
            <IconMapPin /> VIEW ON MAP
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────── */
export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  const [formData, setFormData] = useState({ email: '', message: '' });

  const isMobile = useIsMobile(1024);

  const { ref: heroRef,     inView: heroVisible     } = useInView(0.05);
  const { ref: contactRef,  inView: contactVisible  } = useInView(0.08);
  const { ref: branchesRef, inView: branchesVisible } = useInView(0.08);
  const { ref: footerRef,   inView: footerVisible   } = useInView(0.1);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <style>{globalCss}</style>

      <main style={{ minHeight: '100vh', backgroundColor: 'transparent', fontFamily: tokens.font.family, color: tokens.color.white }}>

        {/* ══ FIXED BACKGROUND ══ */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <Image src="/contact-bg.jpg" alt="Contact background" fill priority sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(4,4,5,0.55) 0%, rgba(4,4,5,0.25) 40%, rgba(4,4,5,0.55) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
        </div>

        {/* ══ SCROLLABLE CONTENT ══ */}
        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* ── NAVBAR ── */}
          <nav className={loaded ? 'nav-animate' : ''} style={{ ...S.nav, opacity: loaded ? undefined : 0 }}>
            <div style={S.navInner}>
              <div style={S.logoWrap}>
                <LogoIcon className="logo-float" />
                <span style={S.logoText}>SAYO</span>
              </div>

              {!isMobile && (
                <div style={S.navLinks}>
                  {NAV_ITEMS.map((item) => (
                    <a key={item} href={NAV_HREFS[item]} className="nav-link-wrap" style={S.navLink}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = tokens.color.gold; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = tokens.color.white; }}>
                      {item}
                    </a>
                  ))}
                </div>
              )}

              {!isMobile && (
                <a href="#" className="contact-btn-wrap" style={S.contactBtnActive}>CONTACT US</a>
              )}

              {isMobile && (
                <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
                  style={{ background: 'none', border: 'none', color: tokens.color.white, cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
                  </svg>
                </button>
              )}
            </div>

            {isMobile && menuOpen && (
              <div style={{ ...S.mobileMenu, animation: 'fadeInDown 0.3s ease both' }}>
                {NAV_ITEMS.map((item) => (
                  <a key={item} href={NAV_HREFS[item]} style={S.mobileNavLink} onClick={() => setMenuOpen(false)}>{item}</a>
                ))}
                <a href="#" style={S.mobileContact} onClick={() => setMenuOpen(false)}>CONTACT US</a>
              </div>
            )}
          </nav>

          {/* ══════════════════════════════════════
              HERO SECTION
          ══════════════════════════════════════ */}
          <div
            ref={heroRef}
            className="hero-content"
            style={{
              minHeight:      'calc(100vh - 120px)',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              padding:        'clamp(2rem, 6vw, 5rem)',
              textAlign:      'center',
              position:       'relative',
            }}
          >
            {/* Eyebrow */}
            <div
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '0.875rem',
                marginBottom:   'clamp(1rem, 2.5vh, 1.75rem)',
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.1s',
              }}
            >
              <div style={{ width: 'clamp(2rem,5vw,4rem)', height: '1px', background: `linear-gradient(90deg, transparent, ${tokens.color.gold})` }} />
              <span style={{ color: tokens.color.gold, fontSize: 'clamp(0.65rem,1vw,0.8rem)', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                Luxury Concierge Experience
              </span>
              <div style={{ width: 'clamp(2rem,5vw,4rem)', height: '1px', background: `linear-gradient(90deg, ${tokens.color.gold}, transparent)` }} />
            </div>

            {/* Main title */}
            <h1
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                color:          tokens.color.gold,
                fontSize:       tokens.font.heroTitle,
                fontWeight:     700,
                letterSpacing:  '0.08em',
                margin:         0,
                lineHeight:     1.05,
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.2s',
                textShadow:     '0 4px 40px rgba(184,134,11,0.35)',
              }}
            >
              GET IN TOUCH
            </h1>

            {/* Gold accent divider */}
            <div
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '0.5rem',
                margin:         'clamp(0.75rem,1.5vh,1.25rem) 0',
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.3s',
              }}
            >
              <div style={{ width: '3rem', height: '2px', background: tokens.color.gold, borderRadius: '9999px' }} />
              <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', background: tokens.color.gold }} />
              <div style={{ width: '3rem', height: '2px', background: tokens.color.gold, borderRadius: '9999px' }} />
            </div>

            {/* Subtitle */}
            <p
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                color:          'rgba(255,255,255,0.88)',
                fontSize:       tokens.font.heroSub,
                fontWeight:     400,
                lineHeight:     1.8,
                maxWidth:       '600px',
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.4s',
                marginBottom:   'clamp(2rem, 4vh, 3rem)',
              }}
            >
              Experience personalized luxury tailored specifically for your needs.
              Our dedicated concierge team in Colombo is here to
              orchestrate your journey into refined elegance.
            </p>

            {/* CTA buttons */}
            <div
              className={`hero-cta-wrap ${heroVisible ? 'reveal-up' : ''}`}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '1rem',
                flexWrap:       'wrap',
                justifyContent: 'center',
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.55s',
              }}
            >
              <a href="#contact-form" className="hero-cta-primary">
                <IconChat />
                Send an Inquiry
              </a>
              <a href="tel:0772336233" className="hero-cta-secondary">
                <IconPhoneCall />
                Call Us Now
              </a>
            </div>

            {/* Floating stat pills */}
            <div
              className={heroVisible ? 'reveal-up' : ''}
              style={{
                display:        'flex',
                gap:            'clamp(0.75rem, 2vw, 1.5rem)',
                marginTop:      'clamp(2.5rem, 5vh, 4rem)',
                flexWrap:       'wrap',
                justifyContent: 'center',
                opacity:        heroVisible ? 1 : 0,
                animationDelay: '0.7s',
              }}
            >
              {[
                { value: '3', label: 'Locations' },
                { value: '10+', label: 'Years of Excellence' },
                { value: '5K+', label: 'Happy Clients' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  style={{
                    background:     'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    border:         '1px solid rgba(255,255,255,0.12)',
                    borderRadius:   tokens.radius.card,
                    padding:        '0.75rem 1.5rem',
                    textAlign:      'center',
                  }}
                >
                  <p style={{ color: tokens.color.gold, fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 700, margin: 0, lineHeight: 1 }}>{value}</p>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.65rem, 1vw, 0.75rem)', fontWeight: 500, margin: '0.3rem 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* ══════════════════════════════════
                SCROLL INDICATOR
                Outer wrapper: handles absolute positioning + horizontal
                centering ONLY (static transform, never touched by animation).
                Inner element: handles the bounce animation.
                This prevents the translateX(-50%) from being overwritten
                by the bounceDown keyframes' translateY.
            ══════════════════════════════════ */}
            {loaded && !isMobile && (
              <div
                className="scroll-indicator-wrap"
                style={{
                  bottom:  'clamp(1.5rem, 4vh, 3rem)',
                  opacity: 0.85,
                }}
              >
                <div className="scroll-indicator">
                  <span style={{
                    color:         tokens.color.white,
                    fontSize:      '0.7rem',
                    fontWeight:    700,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                  }}>
                    Scroll
                  </span>
                  <span style={{
                    color:          tokens.color.gold,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                  }}>
                    <IconArrowDown />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── CONTACT CARDS SECTION ── */}
          <div
            ref={contactRef}
            id="contact-form"
            style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 3.5rem)' }}
          >
            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(1rem, 2vw, 1.5rem)', maxWidth: '1400px', margin: '0 auto' }}>

              {/* LEFT — Inquiry Form */}
              <div
                className={contactVisible ? 'reveal-left' : ''}
                style={{
                  background: tokens.color.cardBg, borderRadius: tokens.radius.card,
                  padding: 'clamp(1.5rem, 3vw, 2.5rem)', display: 'flex',
                  flexDirection: 'column', gap: 'clamp(1rem, 2vh, 1.5rem)',
                  opacity: contactVisible ? 1 : 0, animationDelay: '0.1s',
                }}
              >
                <h2 style={{ color: tokens.color.goldAlpha, fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', fontWeight: 500, margin: 0 }}>
                  Send an Inquiry
                </h2>
                <input type="email" placeholder="example@gmail.com" className="input-field"
                  value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  style={{ minHeight: '4rem' }} />
                <textarea placeholder="Enter Your Message" className="input-field" rows={8}
                  value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  style={{ minHeight: 'clamp(160px, 20vh, 260px)' }} />
                <button className="submit-btn" onClick={handleSubmit}
                  style={{ background: tokens.color.goldMuted, border: 'none', borderRadius: tokens.radius.input, padding: 'clamp(0.875rem, 2vh, 1.25rem)', color: tokens.color.white, fontSize: 'clamp(1rem, 2vw, 1.375rem)', fontWeight: 500, fontFamily: tokens.font.family, letterSpacing: '0.08em', width: '100%' }}>
                  SUBMIT
                </button>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>

                {/* Contact Info Card */}
                <div
                  className={contactVisible ? 'reveal-right' : ''}
                  style={{
                    background: tokens.color.cardBg, borderRadius: tokens.radius.card,
                    padding: 'clamp(1.5rem, 3vw, 2.5rem)', display: 'flex',
                    flexDirection: 'column', gap: 'clamp(1rem, 2vh, 1.5rem)',
                    opacity: contactVisible ? 1 : 0, animationDelay: '0.2s',
                  }}
                >
                  {/* Phone */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: tokens.radius.icon, background: tokens.color.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tokens.color.gold }}>
                      <IconPhone />
                    </div>
                    <div>
                      <p style={{ color: tokens.color.whiteDim69, fontSize: 'clamp(0.7rem,1.1vw,0.875rem)', fontWeight: 500, margin: '0 0 0.2rem', letterSpacing: '0.08em' }}>PHONE</p>
                      <p style={{ color: tokens.color.white, fontSize: 'clamp(0.875rem,1.4vw,1rem)', fontWeight: 500, margin: 0 }}>0772336233 </p>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: tokens.color.whiteBorder }} />
                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: tokens.radius.icon, background: tokens.color.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tokens.color.gold }}>
                      <IconMail />
                    </div>
                    <div>
                      <p style={{ color: tokens.color.whiteDim69, fontSize: 'clamp(0.7rem,1.1vw,0.875rem)', fontWeight: 500, margin: '0 0 0.2rem', letterSpacing: '0.08em' }}>EMAIL</p>
                      <p style={{ color: tokens.color.white, fontSize: 'clamp(0.875rem,1.4vw,1rem)', fontWeight: 500, margin: 0 }}>Example@email.com</p>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: tokens.color.whiteBorder }} />
                  {/* Follow Us */}
                  <div>
                    <p style={{ color: tokens.color.white, fontSize: 'clamp(0.9rem,1.4vw,1.1rem)', fontWeight: 500, margin: '0 0 0.875rem', letterSpacing: '0.04em' }}>FOLLOW US</p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {[
                        { label: 'Instagram', Icon: IconInstagram },
                        { label: 'Facebook',  Icon: IconFacebook  },
                        { label: 'WhatsApp',  Icon: IconWhatsApp  },
                      ].map(({ label, Icon }) => (
                        <a key={label} href="#" aria-label={label} className="social-icon"><Icon /></a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map Card */}
                <div
                  className={contactVisible ? 'reveal-right' : ''}
                  style={{
                    borderRadius: tokens.radius.card, overflow: 'hidden',
                    position: 'relative', flex: 1, minHeight: 'clamp(260px, 32vh, 420px)',
                    opacity: contactVisible ? 1 : 0, animationDelay: '0.35s',
                  }}
                >
                  <iframe className="map-iframe" src={MAP_EMBED_SRC} allowFullScreen loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin" title="SAYO Beauty — Galle Rd, Colombo 03" />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(4,4,5,0.96) 0%, rgba(4,4,5,0.75) 55%, transparent 100%)', padding: 'clamp(1rem, 2.5vw, 1.75rem)', display: 'flex', flexDirection: 'column', gap: '0.625rem', pointerEvents: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', pointerEvents: 'auto' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: tokens.radius.icon, background: tokens.color.iconBg, backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: tokens.color.gold }}>
                        <IconLocation />
                      </div>
                      <p style={{ color: tokens.color.white, fontSize: 'clamp(0.7rem,1.1vw,0.875rem)', fontWeight: 600, margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Address</p>
                    </div>
                    <p style={{ color: tokens.color.white, fontSize: 'clamp(0.8rem,1.3vw,1rem)', fontWeight: 500, margin: 0, lineHeight: 1.5, pointerEvents: 'auto' }}>
                      No. 45, Galle Road, Colombo 03, Sri Lanka
                    </p>
                    <a href={MAP_OPEN_HREF} target="_blank" rel="noopener noreferrer" className="view-map-btn"
                      style={{ alignSelf: 'flex-start', background: tokens.color.goldCard, borderRadius: tokens.radius.card, padding: '0.55rem 1.5rem', color: tokens.color.white, fontSize: 'clamp(0.75rem,1.1vw,0.9rem)', fontWeight: 500, fontFamily: tokens.font.family, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', pointerEvents: 'auto', border: 'none', cursor: 'pointer' }}>
                      <IconMapPin /> VIEW ON MAP
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ OUR LOCATIONS SECTION ══ */}
          <div ref={branchesRef} style={{ padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 4vw, 3.5rem) clamp(3rem, 6vw, 5rem)' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div className={branchesVisible ? 'reveal-up' : ''} style={{ opacity: branchesVisible ? 1 : 0, animationDelay: '0.05s', marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.625rem' }}>
                  <div style={{ width: '3rem', height: '2px', background: tokens.color.gold, borderRadius: tokens.radius.dot, flexShrink: 0 }} />
                  <h2 style={{ color: tokens.color.gold, fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', fontWeight: 500, margin: 0, letterSpacing: '0.04em' }}>Our Locations</h2>
                </div>
                <p style={{ color: tokens.color.whiteMuted, fontSize: 'clamp(0.8rem, 1.3vw, 0.95rem)', fontWeight: 400, margin: '0 0 0 4.5rem', lineHeight: 1.6 }}>
                  Visit us at any of our branches across Sri Lanka — each offering the full SAYO experience.
                </p>
              </div>
              <div className="branches-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(0.875rem, 1.5vw, 1.25rem)' }}>
                {BRANCH_LOCATIONS.map((branch, i) => (
                  <BranchCard key={branch.name} branch={branch} visible={branchesVisible} delay={`${0.1 + i * 0.12}s`} />
                ))}
              </div>
            </div>
          </div>

          {/* ══ FOOTER ══ */}
          <footer ref={footerRef} style={{ position: 'relative', overflow: 'hidden', background: tokens.color.bgFooter, padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 5.188rem)' }}>
            <div className="footer-grid" style={{ position: 'relative', zIndex: 10 }}>

              {/* Brand */}
              <div className="footer-reveal" style={{ flex: '1 1 260px', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(-40px)', transitionDelay: '0s' }}>
                <LogoIcon size={56} />
                <h2 style={{ color: tokens.color.white, fontSize: tokens.font.brand, fontWeight: 600, letterSpacing: '0.15em', margin: 0 }}>SAYO</h2>
                <p style={{ color: tokens.color.whiteMuted, fontSize: tokens.font.tagline, lineHeight: 1.6, margin: 0, maxWidth: '260px' }}>We are experienced in making you more beautiful</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {[{ label: 'WhatsApp', Icon: IconWhatsApp }, { label: 'Facebook', Icon: IconFacebook }, { label: 'Instagram', Icon: IconInstagram }].map(({ label, Icon }, i) => (
                    <a key={label} href="#" aria-label={label} className="social-icon footer-reveal-bounce"
                      style={{ color: tokens.color.white, opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'scale(1)' : 'scale(0.5)', transitionDelay: `${0.4 + i * 0.1}s` }}>
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="footer-reveal" style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.85rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: '0.15s' }}>
                <p style={{ color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Quick Links</p>
                {QUICK_LINKS.map((link, i) => (
                  <a key={link} href="#" className="quick-link footer-reveal-fast"
                    style={{ color: tokens.color.whiteDim, fontSize: tokens.font.quickLink, fontWeight: 500, textDecoration: 'none', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: `${0.25 + i * 0.08}s` }}>
                    {link}
                  </a>
                ))}
              </div>

              {/* Locations */}
              <div className="footer-reveal" style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.85rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: '0.25s' }}>
                <p style={{ color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Our Locations</p>
                {LOCATIONS.map((loc, i) => (
                  <div key={loc} className="footer-reveal-fast" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: `${0.35 + i * 0.08}s` }}>
                    <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}><IconMapPinFooter /></span>
                    <p style={{ color: tokens.color.whiteDim, fontSize: tokens.font.quickLink, fontWeight: 500, lineHeight: 1.5, margin: 0 }}>{loc}</p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="footer-reveal" style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.85rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(40px)', transitionDelay: '0.35s' }}>
                <p style={{ color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Contact Us</p>
                {[
                  { Icon: IconPhoneFooter,  text: '+94 77 233 6233' },
                  { Icon: IconMailFooter,   text: 'Example@email.com' },
                  { Icon: IconMapPinFooter, text: 'No. 45, Galle Road, Colombo 03, Sri Lanka' },
                ].map(({ Icon, text }, i) => (
                  <div key={text} className="footer-reveal-fast" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: `${0.45 + i * 0.08}s` }}>
                    <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}><Icon /></span>
                    <p style={{ color: tokens.color.whiteDim, fontSize: tokens.font.quickLink, fontWeight: 500, lineHeight: 1.5, margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>

            </div>

            <div className="footer-reveal-simple" style={{ position: 'relative', zIndex: 10, marginTop: 'clamp(2rem, 4vw, 2.5rem)', paddingTop: 'clamp(1rem, 2vw, 1.5rem)', borderTop: `1px solid ${tokens.color.whiteBorder}`, opacity: footerVisible ? 1 : 0, transitionDelay: '0.7s' }}>
              <p style={{ color: tokens.color.whiteFaint, fontSize: '0.813rem', textAlign: 'center', margin: 0 }}>
                © {new Date().getFullYear()} SAYO Beauty. All rights reserved.
              </p>
            </div>
          </footer>

        </div>
      </main>
    </>
  );
}