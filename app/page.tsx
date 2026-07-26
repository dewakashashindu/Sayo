'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import backgroundImage from '../public/model1.png';
import sayoLogo from '../public/sayologo.png';

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
    overlayL:    '#000000',
    overlayR:    'rgba(40,40,40,0.49)',
    white:       '#ffffff',
    whiteMuted:  'rgba(255,255,255,0.75)',
    whiteDim:    'rgba(255,255,255,0.70)',
    whiteFaint:  'rgba(255,255,255,0.35)',
    whiteBorder: 'rgba(255,255,255,0.10)',
  },
  font: {
    family: 'Inter, sans-serif',
    eyebrow:  'clamp(0.875rem, 2vw, 1.25rem)',
    hero:     'clamp(2rem, 6vw, 4rem)',
    body:     'clamp(1rem, 1.5vw, 1.125rem)',
    cta:      'clamp(1rem, 1.5vw, 1.125rem)',
    nav:      'clamp(0.875rem, 1.2vw, 1rem)',
    brand:    'clamp(1.5rem, 3vw, 2.5rem)',
    tagline:  'clamp(0.875rem, 1.2vw, 1rem)',
    label:    '0.75rem',
    copy:     '0.813rem',
    quickLink:'0.875rem',
    logoText: 'clamp(1.125rem, 1.5vw, 1.375rem)',
  },
  radius: {
    nav:     '0.75rem',
    cta:     '1.25rem',
    contact: '0.75rem',
    social:  '0.375rem',
    insta:   '0.625rem',
  },
} as const;

/* ─────────────────────────────────────────
   GLOBAL CSS ANIMATIONS
───────────────────────────────────────── */
const globalCss = `
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-50px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1);    }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes drawLine {
    from { stroke-dashoffset: 3000; }
    to   { stroke-dashoffset: 0;    }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0);    }
    50%       { transform: translateY(-8px); }
  }
  @keyframes bgZoom {
    from { transform: scale(1.08); }
    to   { transform: scale(1);    }
  }
  @keyframes overlayFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes bounceDown {
    0%, 100% { transform: translateY(0);   }
    50%       { transform: translateY(6px); }
  }
  @keyframes floatParticle {
    0%   { transform: translateY(0)     rotate(0deg);   opacity: 0.4; }
    50%  { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
    100% { transform: translateY(0)     rotate(360deg); opacity: 0.4; }
  }

  .hero-bg-img   { animation: bgZoom 1.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
  .hero-overlay  { animation: overlayFade 1.5s ease forwards; }
  .nav-animate   { animation: fadeInDown 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
  .logo-float    { animation: floatY 4s ease-in-out 1.5s infinite; }
  .eyebrow-animate { animation: fadeInLeft 0.7s cubic-bezier(0.16,1,0.3,1) 0.8s both; }
  .heading-animate { animation: fadeInUp  0.8s cubic-bezier(0.16,1,0.3,1) 1s   both; }
  .body-animate    { animation: fadeInUp  0.8s cubic-bezier(0.16,1,0.3,1) 1.2s both; }
  .cta-animate     { animation: scaleIn  0.7s cubic-bezier(0.34,1.56,0.64,1) 1.5s both; }

  /* ── Golden curve line draw ── */
  .gold-curve {
    stroke-dasharray: 3000;
    stroke-dashoffset: 3000;
    animation: drawLine 2.4s cubic-bezier(0.4,0,0.2,1) 1.8s forwards;
  }

  .cta-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.8) 0%,
      rgba(255,255,255,1)   40%,
      rgba(255,255,255,0.8) 60%,
      rgba(255,255,255,0.4) 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shimmer 3s linear 2.5s infinite;
  }

  .nav-link-wrap { position: relative; display: inline-block; }
  .nav-link-wrap::after {
    content: ''; position: absolute; bottom: -3px; left: 0;
    width: 0; height: 2px; background: #B8860B;
    transition: width 0.3s ease;
  }
  .nav-link-wrap:hover::after { width: 100%; }

  .cta-btn-wrap { position: relative; overflow: hidden; }
  .cta-btn-wrap::after {
    content: ''; position: absolute;
    top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
    transition: left 0.5s ease;
  }
  .cta-btn-wrap:hover::after { left: 150%; }

  .social-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 42px; height: 42px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.15);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }
  .social-icon:hover {
    transform: scale(1.12) translateY(-3px);
    background: #B8860B; border-color: #B8860B;
  }

  .quick-link { position: relative; padding-left: 0; transition: padding-left 0.25s ease, color 0.25s ease; }
  .quick-link:hover { padding-left: 8px; }
  .quick-link::before {
    content: '›'; position: absolute; left: -4px; opacity: 0;
    transition: opacity 0.25s ease, left 0.25s ease; color: #B8860B;
  }
  .quick-link:hover::before { opacity: 1; left: 0; }

  .contact-btn-wrap { position: relative; overflow: hidden; }
  .contact-btn-wrap::before {
    content: ''; position: absolute; inset: 0; background: white;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); z-index: -1;
  }
  .contact-btn-wrap:hover::before { transform: scaleX(1); }
  .contact-btn-wrap:hover { color: #000 !important; }

  .scroll-indicator { animation: bounceDown 1.5s ease-in-out infinite; }

  .footer-reveal       { transition-property: opacity, transform; transition-duration: 0.8s; transition-timing-function: cubic-bezier(0.16,1,0.3,1); }
  .footer-reveal-fast  { transition-property: opacity, transform; transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.16,1,0.3,1); }
  .footer-reveal-bounce{ transition-property: opacity, transform; transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.34,1.56,0.64,1); }
  .footer-reveal-simple{ transition-property: opacity; transition-duration: 1s; transition-timing-function: ease; }

  .footer-item { display: flex; align-items: flex-start; gap: 8px; }

  .footer-grid { display: flex; flex-direction: column; flex-wrap: wrap; gap: 2.5rem; }
  .footer-brand-col { flex: 1 1 260px; max-width: 320px; }
  .footer-side-col  { flex: 1 1 160px; min-width: 150px; }

  @media (min-width: 1024px) {
    .footer-grid { flex-direction: row; flex-wrap: nowrap; justify-content: space-between; align-items: flex-start; }
  }
  @media (min-width: 640px) and (max-width: 1023px) {
    .footer-grid { flex-direction: row; flex-wrap: wrap; justify-content: space-between; }
  }
`;

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const S = {
  main: {
    minHeight: '100vh',
    backgroundColor: tokens.color.bgDark,
    fontFamily: tokens.font.family,
  } as React.CSSProperties,

  hero: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    overflow: 'hidden',
  } as React.CSSProperties,

  heroBg: { position: 'absolute', inset: 0 } as React.CSSProperties,

  heroOverlay: {
    position: 'absolute', inset: 0,
    background: `linear-gradient(270deg, ${tokens.color.overlayR} 0%, ${tokens.color.overlayL} 100%)`,
  } as React.CSSProperties,

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

  logoWrap: { display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 1vw, 0.75rem)' } as React.CSSProperties,
  logoText: { color: tokens.color.white, fontSize: tokens.font.logoText, fontWeight: 600, letterSpacing: '0.15em' } as React.CSSProperties,
  navLinks: { display: 'flex', alignItems: 'center', gap: 'clamp(1.25rem, 2.5vw, 2.5rem)' } as React.CSSProperties,

  navLinkActive: { color: tokens.color.gold, fontSize: tokens.font.nav, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' } as React.CSSProperties,
  navLink:       { color: tokens.color.white, fontSize: tokens.font.nav, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', whiteSpace: 'nowrap' } as React.CSSProperties,

  contactBtn: {
    color: tokens.color.white, fontSize: tokens.font.nav, fontWeight: 500,
    textDecoration: 'none', border: `3px solid ${tokens.color.white}`,
    borderRadius: tokens.radius.contact,
    padding: 'clamp(0.375rem, 0.5vw, 0.5rem) clamp(1rem, 1.5vw, 1.75rem)',
    transition: 'all 0.3s', whiteSpace: 'nowrap', position: 'relative', zIndex: 1,
  } as React.CSSProperties,

  mobileMenu: {
    marginTop: '0.5rem', background: 'rgba(0,0,0,0.92)',
    borderRadius: tokens.radius.nav, padding: '1rem 1.5rem',
    display: 'flex', flexDirection: 'column', gap: '1rem',
  } as React.CSSProperties,

  mobileNavLinkActive: { color: tokens.color.gold, fontSize: '1rem', fontWeight: 500, textDecoration: 'none' } as React.CSSProperties,
  mobileNavLink:       { color: tokens.color.white, fontSize: '1rem', fontWeight: 500, textDecoration: 'none' } as React.CSSProperties,
  mobileContact: {
    color: tokens.color.white, fontSize: '1rem', textAlign: 'center' as const,
    padding: '0.625rem 0', borderRadius: '0.75rem',
    border: `2px solid ${tokens.color.white}`, textDecoration: 'none', transition: 'all 0.2s',
  } as React.CSSProperties,

  heroContent: {
    position: 'relative', zIndex: 10,
    padding: 'clamp(2rem, 8vh, 7.5rem) clamp(1rem, 3vw, 3.125rem) clamp(3rem, 10vh, 5rem)',
    minHeight: 'calc(100vh - 200px)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  } as React.CSSProperties,

  eyebrow: {
    color: tokens.color.white, fontSize: tokens.font.eyebrow, fontWeight: 500,
    opacity: 0.75, margin: 0, paddingBottom: 'clamp(0.5rem, 1vh, 1rem)',
  } as React.CSSProperties,

  heading: {
    color: tokens.color.white, fontSize: tokens.font.hero, fontWeight: 500,
    lineHeight: 1.15, margin: 0, paddingBottom: 'clamp(1rem, 2vh, 2rem)', maxWidth: '900px',
  } as React.CSSProperties,

  bodyText: {
    color: tokens.color.white, fontSize: tokens.font.body, fontWeight: 400,
    lineHeight: 1.6, opacity: 0.75, margin: 0,
    paddingBottom: 'clamp(1.5rem, 3vh, 3.75rem)', maxWidth: '700px',
  } as React.CSSProperties,

  ctaBtn: {
    display: 'inline-block', color: tokens.color.white, fontSize: tokens.font.cta,
    fontWeight: 500, background: tokens.color.goldAlpha, borderRadius: tokens.radius.cta,
    padding: 'clamp(0.75rem, 1.5vh, 1rem) clamp(1.5rem, 3vw, 2.25rem)',
    textDecoration: 'none', transition: 'all 0.3s', textAlign: 'center',
    alignSelf: 'flex-start', position: 'relative', zIndex: 1,
  } as React.CSSProperties,

  curveWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '45%',
    pointerEvents: 'none',
    zIndex: 11,
  } as React.CSSProperties,

  footer: {
    position: 'relative', overflow: 'hidden',
    background: tokens.color.bgFooter,
    padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 5.188rem)',
  } as React.CSSProperties,

  footerGridBase: { position: 'relative', zIndex: 10 } as React.CSSProperties,

  footerBrand: { display: 'flex', flexDirection: 'column' as const, gap: 'clamp(0.75rem, 1.5vw, 1rem)' } as React.CSSProperties,
  brandName:   { color: tokens.color.white, fontSize: tokens.font.brand, fontWeight: 600, letterSpacing: '0.15em', margin: 0 } as React.CSSProperties,
  tagline:     { color: tokens.color.white, fontSize: tokens.font.tagline, fontWeight: 400, lineHeight: 1.6, margin: 0, opacity: 0.75, maxWidth: '260px' } as React.CSSProperties,
  socialRow:   { display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 1.5vw, 1rem)', marginTop: '0.5rem' } as React.CSSProperties,
  socialLink:  { color: tokens.color.white } as React.CSSProperties,
  footerCol:   { display: 'flex', flexDirection: 'column' as const, gap: '0.85rem' } as React.CSSProperties,
  quickLabel:  { color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const, margin: 0, paddingBottom: '0.25rem' } as React.CSSProperties,
  quickLink:   { color: tokens.color.whiteDim, fontSize: tokens.font.quickLink, fontWeight: 500, textDecoration: 'none' } as React.CSSProperties,
  footerItemText: { color: tokens.color.whiteDim, fontSize: tokens.font.quickLink, fontWeight: 500, lineHeight: 1.5, margin: 0 } as React.CSSProperties,
  footerItemIcon: { color: tokens.color.gold, flexShrink: 0, marginTop: '2px' } as React.CSSProperties,
  footerBottom: {
    position: 'relative' as const, zIndex: 10,
    marginTop: 'clamp(2rem, 4vw, 2.5rem)', paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
    borderTop: `1px solid ${tokens.color.whiteBorder}`,
  } as React.CSSProperties,
  copyright: { color: tokens.color.whiteFaint, fontSize: tokens.font.copy, textAlign: 'center' as const, margin: 0 } as React.CSSProperties,
};

/* ─────────────────────────────────────────
   LOGO COMPONENT  ← now uses sayologo.png
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

function GoldenCurve() {
  return (
    <div style={S.curveWrap}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          className="gold-curve"
          d="M 0 320 C 150 340, 300 180, 500 260 C 700 340, 950 160, 1200 200"
          stroke={tokens.color.gold}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
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
function IconLocation() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────── */
const PARTICLES = [
  { size: 4, x: '15%', delay: '0s',   dur: '6s'   },
  { size: 6, x: '30%', delay: '1s',   dur: '8s'   },
  { size: 3, x: '50%', delay: '0.5s', dur: '7s'   },
  { size: 5, x: '70%', delay: '2s',   dur: '9s'   },
  { size: 4, x: '85%', delay: '1.5s', dur: '6.5s' },
  { size: 3, x: '60%', delay: '3s',   dur: '7.5s' },
];
function FloatingParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5, overflow: 'hidden' }}>
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: '20%', left: p.x,
          width: p.size, height: p.size, borderRadius: '50%',
          background: tokens.color.gold, opacity: 0.5,
          animation: `floatParticle ${p.dur} ease-in-out ${p.delay} infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   INTERSECTION OBSERVER HOOK
───────────────────────────────────────── */
function useInView(threshold = 0.2) {
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

/* ─────────────────────────────────────────
   IS MOBILE HOOK
───────────────────────────────────────── */
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
   DATA
───────────────────────────────────────── */
const NAV_ITEMS   = ['HOME', 'OUR STORY', 'SERVICES', 'PRODUCTS', 'REVIEWS'] as const;
const QUICK_LINKS = ['Home', 'Our Story', 'Services', 'Products', 'Reviews'] as const;
const LOCATIONS   = ['Colombo', 'Negombo', 'Kiribathgoda'] as const;

const NAV_HREFS: Record<string, string> = {
  'HOME':      '/',
  'OUR STORY': '/about',
  'SERVICES':  '#',
  'PRODUCTS':  '#',
  'REVIEWS':   '#',
};

/* ─────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  const { ref: footerRef, inView: footerVisible } = useInView(0.1);
  const isMobile = useIsMobile(); // breakpoint for nav/menu switch (1024px)
  const isNarrowScreen = useIsMobile(768); // breakpoint for hero image reposition

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{globalCss}</style>

      <main style={S.main}>

        {/* ══════════════════════════
            HERO
        ══════════════════════════ */}
        <section style={S.hero}>

          {/* Background — objectPosition adjusts on mobile so the
              full face is visible instead of just the side/ear */}
          <div style={S.heroBg}>
            <Image
              src={backgroundImage}
              alt="Beauty model"
              fill priority
              className="hero-bg-img"
              style={{
                objectFit: 'cover',
                objectPosition: isNarrowScreen ? 'center 15%' : 'right center',
              }}
            />
          </div>

          {/* Overlay */}
          <div style={S.heroOverlay} className="hero-overlay" />

          {/* Particles */}
          <FloatingParticles />

          {/* ── Navbar ── */}
          <nav
            className={loaded ? 'nav-animate' : ''}
            style={{ ...S.nav, opacity: loaded ? undefined : 0 }}
          >
            <div style={S.navInner}>

              {/* Logo — always visible */}
              <div style={S.logoWrap}>
                <LogoIcon className="logo-float" />
                <span style={S.logoText}>SAYO</span>
              </div>

              {/* ── DESKTOP: nav links (hidden on mobile) ── */}
              {!isMobile && (
                <div style={S.navLinks}>
                  {NAV_ITEMS.map((item, i) => (
                    <a
                      key={item}
                      href={NAV_HREFS[item]}
                      className="nav-link-wrap"
                      style={i === 0 ? S.navLinkActive : S.navLink}
                      onMouseEnter={e => {
                        if (i !== 0) (e.currentTarget as HTMLElement).style.color = tokens.color.gold;
                      }}
                      onMouseLeave={e => {
                        if (i !== 0) (e.currentTarget as HTMLElement).style.color = tokens.color.white;
                      }}
                    >
                      {i === 0 ? `[ ${item} ]` : item}
                    </a>
                  ))}
                </div>
              )}

              {/* ── DESKTOP: Contact Us button (hidden on mobile) ── */}
              {!isMobile && (
                <a href="#" className="contact-btn-wrap" style={S.contactBtn}>
                  CONTACT US
                </a>
              )}

              {/* ── MOBILE: Hamburger button only ── */}
              {isMobile && (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                  style={{
                    background: 'none', border: 'none', color: tokens.color.white,
                    cursor: 'pointer', padding: '0.5rem', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.3s ease',
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

            {/* ── MOBILE: Dropdown menu ── */}
            {isMobile && menuOpen && (
              <div style={{ ...S.mobileMenu, animation: 'fadeInDown 0.3s ease both' }}>
                {NAV_ITEMS.map((item, i) => (
                  <a
                    key={item}
                    href={NAV_HREFS[item]}
                    style={i === 0 ? S.mobileNavLinkActive : S.mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {i === 0 ? `[ ${item} ]` : item}
                  </a>
                ))}
                <a href="#" style={S.mobileContact} onClick={() => setMenuOpen(false)}>
                  CONTACT US
                </a>
              </div>
            )}
          </nav>

          {/* ── Hero content ── */}
          <div style={S.heroContent}>
            <p style={S.eyebrow} className={loaded ? 'eyebrow-animate' : ''}>
              Experienced hair stylists
            </p>
            <h1 style={S.heading} className={loaded ? 'heading-animate' : ''}>
              Enjoy Professional Beauty Services!
            </h1>
            <p style={S.bodyText} className={loaded ? 'body-animate' : ''}>
              Providing expert skin care advice &amp; beauty services using
              natural products to cater for any skin.
            </p>
            <a
              href="#"
              style={S.ctaBtn}
              className={`cta-btn-wrap ${loaded ? 'cta-animate' : ''}`}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = tokens.color.gold;
                el.style.transform = 'scale(1.06)';
                el.style.boxShadow = `0 8px 30px rgba(184,134,11,0.45)`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = tokens.color.goldAlpha;
                el.style.transform = 'scale(1)';
                el.style.boxShadow = 'none';
              }}
            >
              <span className="cta-shimmer">Reserve Experience</span>
            </a>

            {/* Scroll indicator — desktop only */}
            {loaded && !isMobile && (
              <div className="scroll-indicator" style={{
                position: 'absolute', bottom: '2rem', left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', opacity: 0.5,
              }}>
                <span style={{ color: tokens.color.white, fontSize: '0.7rem', letterSpacing: '0.15em' }}>SCROLL</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tokens.color.gold} strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
            )}
          </div>

          {/* Golden Curve */}
          <GoldenCurve />

        </section>

        {/* ══════════════════════════
            FOOTER
        ══════════════════════════ */}
        <footer style={S.footer} ref={footerRef}>
          <div className="footer-grid" style={S.footerGridBase}>

            {/* Brand */}
            <div className="footer-brand-col footer-reveal" style={{
              ...S.footerBrand,
              opacity: footerVisible ? 1 : 0,
              transform: footerVisible ? 'translateX(0)' : 'translateX(-40px)',
              transitionDelay: '0s',
            }}>
              <LogoIcon size={56} />
              <h2 style={S.brandName}>SAYO</h2>
              <p style={S.tagline}>We are experienced in making you more beautiful</p>
              <div style={S.socialRow}>
                {[
                  { label: 'WhatsApp',  Icon: IconWhatsApp  },
                  { label: 'Facebook',  Icon: IconFacebook  },
                  { label: 'Instagram', Icon: IconInstagram },
                ].map(({ label, Icon }, i) => (
                  <a key={label} href="#" aria-label={label}
                    className="social-icon footer-reveal-bounce"
                    style={{
                      ...S.socialLink,
                      opacity: footerVisible ? 1 : 0,
                      transform: footerVisible ? 'scale(1)' : 'scale(0.5)',
                      transitionDelay: `${0.4 + i * 0.1}s`,
                    }}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-side-col footer-reveal" style={{
              ...S.footerCol,
              opacity: footerVisible ? 1 : 0,
              transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
              transitionDelay: '0.15s',
            }}>
              <p style={S.quickLabel}>Quick Links</p>
              {QUICK_LINKS.map((link, i) => (
                <a key={link} href={link === 'Our Story' ? '/about' : '#'}
                  className="quick-link footer-reveal-fast"
                  style={{
                    ...S.quickLink,
                    opacity: footerVisible ? 1 : 0,
                    transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
                    transitionDelay: `${0.25 + i * 0.08}s`,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = tokens.color.gold; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = tokens.color.whiteDim; }}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Locations */}
            <div className="footer-side-col footer-reveal" style={{
              ...S.footerCol,
              opacity: footerVisible ? 1 : 0,
              transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
              transitionDelay: '0.25s',
            }}>
              <p style={S.quickLabel}>Our Locations</p>
              {LOCATIONS.map((loc, i) => (
                <div key={loc} className="footer-item footer-reveal-fast" style={{
                  opacity: footerVisible ? 1 : 0,
                  transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
                  transitionDelay: `${0.35 + i * 0.08}s`,
                }}>
                  <span style={S.footerItemIcon}><IconLocation /></span>
                  <p style={S.footerItemText}>{loc}</p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="footer-side-col footer-reveal" style={{
              ...S.footerCol,
              opacity: footerVisible ? 1 : 0,
              transform: footerVisible ? 'translateX(0)' : 'translateX(40px)',
              transitionDelay: '0.35s',
            }}>
              <p style={S.quickLabel}>Contact Us</p>
              {[
                { delay: '0.45s', Icon: IconPhone,    text: '+94 77 123 4567' },
                { delay: '0.53s', Icon: IconMail,     text: 'hello@sayobeauty.com' },
                { delay: '0.61s', Icon: IconLocation, text: '123 Galle Road, Colombo, Sri Lanka' },
              ].map(({ delay, Icon, text }) => (
                <div key={text} className="footer-item footer-reveal-fast" style={{
                  opacity: footerVisible ? 1 : 0,
                  transform: footerVisible ? 'translateX(0)' : 'translateX(20px)',
                  transitionDelay: delay,
                }}>
                  <span style={S.footerItemIcon}><Icon /></span>
                  <p style={S.footerItemText}>{text}</p>
                </div>
              ))}
            </div>

          </div>

          <div className="footer-reveal-simple" style={{
            ...S.footerBottom,
            opacity: footerVisible ? 1 : 0,
            transitionDelay: '0.7s',
          }}>
            <p style={S.copyright}>© 2025 SAYO Beauty. All rights reserved.</p>
          </div>
        </footer>

      </main>
    </>
  );
}