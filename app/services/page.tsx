'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import sayoLogo from '../../public/sayologo.png';

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const tokens = {
  color: {
    gold:        '#B8860B',
    goldAlpha:   'rgba(184,134,11,0.69)',
    goldBorder:  'rgba(184,134,11,0.4)',
    bgFooter:    '#1a1a1a',
    navBg:       'rgba(68,68,68,0.40)',
    white:       '#ffffff',
    whiteMuted:  'rgba(255,255,255,0.80)',
    whiteDim:    'rgba(255,255,255,0.70)',
    whiteFaint:  'rgba(255,255,255,0.35)',
    whiteBorder: 'rgba(255,255,255,0.10)',
  },
  font: {
    family:          'Inter, sans-serif',
    nav:             'clamp(0.875rem, 1.2vw, 1.05rem)',
    logoText:        'clamp(1.125rem, 1.5vw, 1.375rem)',
    heroTitle:       'clamp(2rem, 4.5vw, 4rem)',
    heroSub:         'clamp(0.9rem, 1.6vw, 1.4rem)',
    section:         'clamp(1.1rem, 2vw, 1.6rem)',
    tabLabel:        'clamp(0.9rem, 1.6vw, 1.4rem)',
    label:           '0.75rem',
    tagline:         'clamp(0.875rem, 1.2vw, 1rem)',
    brand:           'clamp(1.5rem, 3vw, 2.5rem)',
    priceName:       'clamp(0.85rem, 1.3vw, 1rem)',
    pricePriceValue: 'clamp(0.85rem, 1.3vw, 1.05rem)',
  },
  radius: {
    nav:  '0.75rem',
    card: '1.25rem',
    tab:  '0.9375rem',
    pill: '1.25rem',
    icon: '9999px',
  },
  layout: {
    maxWidth: '108rem',
    inner:    '86rem',
  },
} as const;

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type NavItem   = { label: string; href: string };
type QuickLink = { label: string; href: string };
type PriceItem = { name: string; price1: string; price2?: string };
type GenderKey = 'her' | 'his';

// ── Dynamic category type ──
type ServiceCategory = {
  key:   string;
  label: string;
  image: string;
};

type NavData = {
  logo_text: string; contact_btn_text: string; contact_btn_link: string; nav_items: NavItem[];
};
type FooterData = {
  brand_name: string; brand_tagline: string; contact_phone: string; contact_email: string;
  contact_address: string; copyright_text: string; locations: string[]; quick_links: QuickLink[];
  social_whatsapp: string; social_facebook: string; social_instagram: string;
};
type ServicesData = {
  hero_heading:  string;
  hero_subtitle: string;
  categories:    ServiceCategory[];
  price_list:    Record<string, Record<string, PriceItem[]>>;
};

/* ─────────────────────────────────────────
   DEFAULTS
───────────────────────────────────────── */
const NAV_DEFAULTS: NavData = {
  logo_text: 'SAYO', contact_btn_text: 'CONTACT US', contact_btn_link: '/contact',
  nav_items: [
    { label: 'HOME', href: '/' }, { label: 'OUR STORY', href: '/about' },
    { label: 'SERVICES', href: '/services' }, { label: 'PRODUCTS', href: '/products' },
    { label: 'REVIEWS', href: '/reviews' },
  ],
};

const FOOTER_DEFAULTS: FooterData = {
  brand_name: 'SAYO', brand_tagline: 'We are experienced in making you more beautiful',
  contact_phone: '+94 77 233 6233', contact_email: 'hello@sayobeauty.com',
  contact_address: '123 Galle Road, Colombo, Sri Lanka',
  copyright_text: `© ${new Date().getFullYear()} SAYO Beauty. All rights reserved.`,
  locations: ['Colombo', 'Negombo', 'Kiribathgoda'],
  quick_links: [
    { label: 'Home', href: '/' }, { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' }, { label: 'Reviews', href: '/reviews' },
  ],
  social_whatsapp: '', social_facebook: '', social_instagram: '',
};

// ── Default categories (used only if DB has none) ──
const SERVICES_CATEGORIES_DEFAULT: ServiceCategory[] = [
  { key: 'WAX',    label: 'WAX',    image: '' },
  { key: 'HAIR',   label: 'HAIR',   image: '' },
  { key: 'SKIN',   label: 'SKIN',   image: '' },
  { key: 'NAIL',   label: 'NAIL',   image: '' },
  { key: 'BODY',   label: 'BODY',   image: '' },
  { key: 'BRIDAL', label: 'BRIDAL', image: '' },
];

const SERVICES_DEFAULTS: ServicesData = {
  hero_heading:  'Tailored Treatments for Your Unique Glow',
  hero_subtitle: "Experience a symphony of precision and luxury. Our services are tailored to the individual, utilizing the world's most exclusive botanical formulas and advanced styling techniques.",
  categories:    SERVICES_CATEGORIES_DEFAULT,
  price_list: {
    her: {
      WAX:    [{ name: 'Full Arms Wax', price1: '2,500.00' }, { name: 'Full Legs Wax', price1: '3,500.00' }, { name: 'Underarm Wax', price1: '1,200.00' }, { name: 'Eyebrow Threading', price1: '800.00' }, { name: 'Full Body Wax', price1: '7,500.00' }],
      HAIR:   [{ name: 'Cut & Re-Style (Advance)', price1: '4,200.00', price2: '3,600.00' }, { name: 'Fringe Cut', price1: '1,500.00' }, { name: 'Trim', price1: '1,500.00' }, { name: 'Blow Dry - Short', price1: '2,500.00' }, { name: 'Hair Wash & Blast Dry', price1: '2,100.00' }],
      SKIN:   [{ name: 'Classic Facial', price1: '3,000.00' }, { name: 'Gold Facial', price1: '6,500.00' }, { name: 'Skin Brightening', price1: '5,200.00' }, { name: 'Acne Treatment', price1: '4,800.00' }, { name: 'Anti-Aging Facial', price1: '7,200.00' }],
      NAIL:   [{ name: 'Classic Manicure', price1: '1,800.00' }, { name: 'Gel Manicure', price1: '3,200.00' }, { name: 'Classic Pedicure', price1: '2,200.00' }, { name: 'Gel Pedicure', price1: '3,800.00' }, { name: 'Nail Art (Per Set)', price1: '1,500.00' }],
      BODY:   [{ name: 'Full Body Massage', price1: '5,500.00' }, { name: 'Body Scrub', price1: '4,200.00' }, { name: 'Body Wrap', price1: '6,000.00' }, { name: 'Aromatherapy Massage', price1: '6,800.00' }, { name: 'Hot Stone Massage', price1: '7,500.00' }],
      BRIDAL: [{ name: 'Bridal Package - Full', price1: '45,000.00' }, { name: 'Bridal Hair & Makeup', price1: '18,000.00' }, { name: 'Pre-Bridal Package', price1: '22,000.00' }, { name: 'Trial Makeup', price1: '6,500.00' }, { name: 'Bridal Draping', price1: '5,000.00' }],
    },
    his: {
      WAX:    [{ name: 'Half Arms Wax', price1: '2,000.00' }, { name: 'Chest Wax', price1: '3,200.00' }, { name: 'Back Wax', price1: '3,600.00' }, { name: 'Full Legs Wax', price1: '4,000.00' }, { name: 'Beard Shaping', price1: '1,000.00' }],
      HAIR:   [{ name: 'Haircut - Classic', price1: '1,800.00' }, { name: 'Beard Trim', price1: '900.00' }, { name: 'Hair Wash', price1: '700.00' }, { name: 'Head Massage', price1: '1,500.00', price2: '1,200.00' }, { name: 'Hair Color', price1: '3,500.00' }],
      SKIN:   [{ name: 'Deep Cleansing Facial', price1: '3,500.00' }, { name: 'Skin Polishing', price1: '4,000.00' }, { name: 'Beard Care Facial', price1: '3,200.00' }, { name: 'Whitening Facial', price1: '4,800.00' }, { name: 'Detox Facial', price1: '5,500.00', price2: '4,900.00' }],
      NAIL:   [{ name: 'Basic Manicure', price1: '1,200.00' }, { name: 'Basic Pedicure', price1: '1,500.00' }, { name: 'Nail Trim & Buff', price1: '800.00' }, { name: 'Callus Removal', price1: '1,000.00' }, { name: 'Hand Spa', price1: '2,200.00' }],
      BODY:   [{ name: 'Deep Tissue Massage', price1: '6,000.00' }, { name: 'Body Scrub', price1: '4,000.00' }, { name: 'Sports Massage', price1: '6,500.00' }, { name: 'Back Massage', price1: '3,500.00' }, { name: 'Head & Shoulder Massage', price1: '2,800.00' }],
      BRIDAL: [{ name: 'Groom Package', price1: '25,000.00' }, { name: 'Groom Hair & Makeup', price1: '10,000.00' }, { name: 'Pre-Groom Package', price1: '14,000.00' }, { name: 'Groom Facial', price1: '4,500.00' }, { name: 'Groom Grooming', price1: '3,500.00' }],
    },
  },
};

/* ─────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────── */
const GENDER_OPTIONS = [
  { key: 'her' as GenderKey, label: 'Her Sanctuary' },
  { key: 'his' as GenderKey, label: 'His Retreat' },
];

// ── Fallback placeholder images for gallery carousel (used if category has no custom image) ──
const CATEGORY_IMAGES: Record<string, string> = {
  WAX:    'https://placehold.co/487x582?text=Wax',
  HAIR:   'https://placehold.co/487x582?text=Hair',
  SKIN:   'https://placehold.co/487x582?text=Skin',
  NAIL:   'https://placehold.co/487x582?text=Nail',
  BODY:   'https://placehold.co/487x582?text=Body',
  BRIDAL: 'https://placehold.co/487x582?text=Bridal',
};

const getImageForCategory = (key: string, image?: string): string => {
  if (image && image.trim().length > 0) return image;
  return CATEGORY_IMAGES[key] || `https://placehold.co/487x582?text=${encodeURIComponent(key)}`;
};

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #040405; }

  @keyframes fadeInDown { from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn     { from{opacity:0}to{opacity:1} }
  @keyframes floatY     { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }

  .nav-animate { animation: fadeInDown 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
  .logo-float  { animation: floatY 4s ease-in-out 1.5s infinite; }
  .reveal-up   { animation: fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .reveal-fade { animation: fadeIn 1s ease both; }

  .nav-link-wrap { position: relative; display: inline-block; }
  .nav-link-wrap::after { content:'';position:absolute;bottom:-3px;left:0;width:0;height:2px;background:#B8860B;transition:width 0.3s ease; }
  .nav-link-wrap:hover::after { width: 100%; }

  .contact-btn-wrap { position: relative; overflow: hidden; }
  .contact-btn-wrap::before { content:'';position:absolute;inset:0;background:white;transform:scaleX(0);transform-origin:left;transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);z-index:-1; }
  .contact-btn-wrap:hover::before { transform: scaleX(1); }
  .contact-btn-wrap:hover { color: #000 !important; }

  .gender-tab, .category-tab { cursor:pointer;border:none;outline:none;font-family:Inter,sans-serif;color:#fff;transition:background 0.3s ease,border-color 0.3s ease,transform 0.25s ease,box-shadow 0.3s ease; }
  .gender-tab:hover, .category-tab:hover { transform: translateY(-3px); }
  .gender-tab-active   { background:rgba(184,134,11,0.49);box-shadow:0 8px 26px rgba(184,134,11,0.25); }
  .gender-tab-inactive { background:transparent;border:3px solid rgba(184,134,11,0.49); }
  .gender-tab-inactive:hover { background: rgba(184,134,11,0.15); }
  .category-tab-active   { background:#B8860B;box-shadow:0 8px 24px rgba(184,134,11,0.4); }
  .category-tab-inactive { background:transparent;border:3px solid rgba(255,255,255,0.7); }
  .category-tab-inactive:hover { border-color:#B8860B;background:rgba(184,134,11,0.12); }

  :root { --gallery-card-min:clamp(110px,14vw,193px);--gallery-card-max:clamp(240px,28vw,487px); }
  .gallery-scroll-outer { width:100%;overflow:hidden; }
  ul.gallery-scroll { container-type:inline-size;list-style:none;display:flex;align-items:center;gap:1rem;width:100%;height:clamp(300px,34vw,610px);overflow-x:auto;overflow-y:hidden;padding-block:0.75rem;padding-inline:calc(50% - (var(--gallery-card-min)) * 0.5);margin:0;cursor:grab;scrollbar-width:thin;scrollbar-color:#B8860B transparent;-webkit-overflow-scrolling:touch;scroll-behavior:auto; }
  ul.gallery-scroll[data-dragging='true'] { cursor:grabbing; }
  ul.gallery-scroll[data-dragging='true'] li a { pointer-events:none; }
  ul.gallery-scroll li { position:relative;flex-shrink:0;display:flex;align-items:flex-end;justify-content:center;width:var(--gallery-card-min);aspect-ratio:487/582;scroll-snap-align:center;animation:gallery-grow both linear(0 0%,0.0027 3.64%,0.0106 7.29%,0.0425 14.58%,0.0957 21.87%,0.1701 29.16%,0.2477 35.19%,0.3401 41.23%,0.5982 55.18%,0.7044 61.56%,0.7987 68.28%,0.875 75%,0.9297 81.25%,0.9687 87.5%,0.9922 93.75%,1 100%);animation-timeline:view(inline); }
  @keyframes gallery-grow { 50%{width:var(--gallery-card-max)} }
  ul.gallery-scroll li article { position:relative;width:100%;height:100%;border-radius:1.25rem;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.55);transition:box-shadow 0.4s ease; }
  ul.gallery-scroll li img { position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(0.55) contrast(1.15) brightness(0.85);transition:filter 0.4s ease;-webkit-user-drag:none;user-select:none; }
  ul.gallery-scroll li a { position:absolute;inset:0;z-index:2;display:flex;align-items:flex-end;justify-content:center;padding:1rem;text-align:center;text-decoration:none;color:#fff;font-size:clamp(0.7rem,1vw,0.85rem);font-weight:600;letter-spacing:0.15em;text-transform:uppercase;background:linear-gradient(0deg,rgba(0,0,0,0.65) 0%,transparent 55%); }
  ul.gallery-scroll::-webkit-scrollbar{height:6px} ul.gallery-scroll::-webkit-scrollbar-thumb{background:#B8860B;border-radius:999px} ul.gallery-scroll::-webkit-scrollbar-track{background:transparent}

  .price-row { transition:background 0.2s ease,padding-left 0.2s ease; }
  .price-row:hover { background:rgba(184,134,11,0.1)!important;padding-left:1.75rem!important; }
  .price-list-reveal { transition:opacity 0.5s ease,transform 0.5s cubic-bezier(0.16,1,0.3,1); }

  .social-icon { display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),background 0.3s,border-color 0.3s;color:white;text-decoration:none; }
  .social-icon:hover { transform:scale(1.12) translateY(-3px);background:#B8860B;border-color:#B8860B; }

  .footer-grid { display:flex;flex-direction:column;flex-wrap:wrap;gap:2.5rem; }
  @media(min-width:1024px){.footer-grid{flex-direction:row;flex-wrap:nowrap;justify-content:space-between;align-items:flex-start;}}
  @media(min-width:640px) and (max-width:1023px){.footer-grid{flex-direction:row;flex-wrap:wrap;justify-content:space-between;}}

  .footer-reveal        { transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .footer-reveal-fast   { transition:opacity 0.5s cubic-bezier(0.16,1,0.3,1),transform 0.5s cubic-bezier(0.16,1,0.3,1); }
  .footer-reveal-bounce { transition:opacity 0.5s cubic-bezier(0.34,1.56,0.64,1),transform 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  .footer-reveal-simple { transition:opacity 1s ease; }

  .quick-link { position:relative;transition:padding-left 0.25s,color 0.25s; }
  .quick-link:hover { padding-left:8px;color:#B8860B!important; }
  .quick-link::before { content:'›';position:absolute;left:-4px;opacity:0;transition:opacity 0.25s,left 0.25s;color:#B8860B; }
  .quick-link:hover::before { opacity:1;left:0; }

  .gender-tabs-wrap{display:flex;flex-wrap:wrap;justify-content:center;}
  .category-tabs-wrap{display:flex;flex-wrap:nowrap;justify-content:flex-start;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px;}
  .category-tabs-wrap::-webkit-scrollbar{display:none;}
  @media(max-width:768px){.gender-tabs-wrap{gap:0.75rem!important;}.category-tabs-wrap{gap:0.6rem!important;}}
`;

/* ─────────────────────────────────────────
   NAV STYLES
───────────────────────────────────────── */
const S = {
  nav: { position: 'relative', zIndex: 20, padding: 'clamp(1rem,3vw,3rem) clamp(1rem,3vw,3.125rem)' } as React.CSSProperties,
  navInner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: tokens.color.navBg, borderRadius: tokens.radius.nav, padding: 'clamp(0.75rem,2vw,1.5rem) clamp(1rem,2vw,2rem)', backdropFilter: 'blur(8px)', minHeight: '3.5rem' } as React.CSSProperties,
  logoWrap: { display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem,1vw,0.75rem)' } as React.CSSProperties,
  logoText: { color: tokens.color.white, fontSize: tokens.font.logoText, fontWeight: 600, letterSpacing: '0.15em' } as React.CSSProperties,
  navLinks: { display: 'flex', alignItems: 'center', gap: 'clamp(1.25rem,2.5vw,2.5rem)' } as React.CSSProperties,
  navLink: { fontSize: tokens.font.nav, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', whiteSpace: 'nowrap' } as React.CSSProperties,
  contactBtn: { color: tokens.color.white, fontSize: tokens.font.nav, fontWeight: 500, textDecoration: 'none', border: `3px solid ${tokens.color.white}`, borderRadius: tokens.radius.nav, padding: 'clamp(0.375rem,0.5vw,0.5rem) clamp(1rem,1.5vw,1.75rem)', transition: 'all 0.3s', whiteSpace: 'nowrap', position: 'relative', zIndex: 1 } as React.CSSProperties,
  mobileMenu: { marginTop: '0.5rem', background: 'rgba(0,0,0,0.92)', borderRadius: tokens.radius.nav, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' } as React.CSSProperties,
  mobileNavLink: { color: tokens.color.white, fontSize: '1rem', fontWeight: 500, textDecoration: 'none' } as React.CSSProperties,
  mobileContact: { color: tokens.color.white, fontSize: '1rem', textAlign: 'center' as const, padding: '0.625rem 0', borderRadius: '0.75rem', border: `2px solid ${tokens.color.white}`, textDecoration: 'none', transition: 'all 0.2s' } as React.CSSProperties,
};

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
function LogoIcon({ className = '', size = 48 }: { className?: string; size?: number }) {
  return <Image src={sayoLogo} alt="SAYO Logo" width={size} height={size} className={className} style={{ width: 'clamp(2rem,4vw,3.5rem)', height: 'auto', objectFit: 'contain' }} priority />;
}
function IconWhatsApp() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.24-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/></svg>; }
function IconFacebook() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.86c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z"/></svg>; }
function IconInstagram() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.4.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.35 1.05.4 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.4 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.35-2.22.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.22-.4a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.35-1.05-.4-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.8.4-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.35 2.22-.4 1.27-.06 1.65-.07 4.85-.07zm0-2.16C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39A5.87 5.87 0 0 0 .62 4.15C.32 4.9.12 5.78.06 7.05.01 8.33 0 8.74 0 12s.01 3.67.06 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.3 1.64.5 2.91.56C8.33 24 8.74 24 12 24s3.67-.01 4.95-.06c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.39.67-.67 1.08-1.34 1.39-2.13.3-.76.5-1.64.56-2.91.06-1.28.06-1.69.06-4.95s0-3.67-.06-4.95c-.06-1.27-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.39-2.13A5.87 5.87 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>; }
function IconPhone() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>; }
function IconMail() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>; }
function IconLocation() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>; }

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold });
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

function Divider() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '0 clamp(1rem,4vw,3.5rem)' }}>
      <div style={{ width: '100%', maxWidth: tokens.layout.inner, height: '1px', background: 'rgba(255,255,255,0.5)' }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function ServicesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  const [gender,   setGender]   = useState<GenderKey>('her');

  // category is now dynamic — string, not fixed union
  const [category, setCategory] = useState<string>('NAIL');

  // ── DB data state ──
  const [navData,      setNavData]      = useState<NavData>(NAV_DEFAULTS);
  const [footerData,   setFooterData]   = useState<FooterData>(FOOTER_DEFAULTS);
  const [servicesData, setServicesData] = useState<ServicesData>(SERVICES_DEFAULTS);

  const categorySource = useRef<'tab' | 'scroll'>('tab');
  const observerPaused = useRef(true);
  const galleryListRef = useRef<HTMLUListElement>(null);
  const isMobile       = useIsMobile(1024);

  const { ref: heroRef,     inView: heroVisible     } = useInView(0.05);
  const { ref: toggleRef,   inView: toggleVisible   } = useInView(0.1);
  const { ref: categoryRef, inView: categoryVisible } = useInView(0.1);
  const { ref: galleryRef,  inView: galleryVisible  } = useInView(0.1);
  const { ref: priceRef,    inView: priceVisible    } = useInView(0.1);
  const { ref: footerRef,   inView: footerVisible   } = useInView(0.1);

  // ── Load from DB ──
  useEffect(() => {
    fetch('/api/site-data')
      .then(r => r.json())
      .then(data => {
        if (data?.nav) setNavData({ logo_text: data.nav.logo_text || NAV_DEFAULTS.logo_text, contact_btn_text: data.nav.contact_btn_text || NAV_DEFAULTS.contact_btn_text, contact_btn_link: data.nav.contact_btn_link || NAV_DEFAULTS.contact_btn_link, nav_items: Array.isArray(data.nav.nav_items) && data.nav.nav_items.length > 0 ? data.nav.nav_items : NAV_DEFAULTS.nav_items });
        if (data?.footer) setFooterData({ brand_name: data.footer.brand_name || FOOTER_DEFAULTS.brand_name, brand_tagline: data.footer.brand_tagline || FOOTER_DEFAULTS.brand_tagline, contact_phone: data.footer.contact_phone || FOOTER_DEFAULTS.contact_phone, contact_email: data.footer.contact_email || FOOTER_DEFAULTS.contact_email, contact_address: data.footer.contact_address || FOOTER_DEFAULTS.contact_address, copyright_text: data.footer.copyright_text || FOOTER_DEFAULTS.copyright_text, locations: Array.isArray(data.footer.locations) && data.footer.locations.length > 0 ? data.footer.locations : FOOTER_DEFAULTS.locations, quick_links: Array.isArray(data.footer.quick_links) && data.footer.quick_links.length > 0 ? data.footer.quick_links : FOOTER_DEFAULTS.quick_links, social_whatsapp: data.footer.social_whatsapp || '', social_facebook: data.footer.social_facebook || '', social_instagram: data.footer.social_instagram || '' });
        if (data?.services) {
          const cats: ServiceCategory[] = Array.isArray(data.services.categories) && data.services.categories.length > 0
            ? data.services.categories
            : SERVICES_DEFAULTS.categories;
          setServicesData({
            hero_heading:  data.services.hero_heading  || SERVICES_DEFAULTS.hero_heading,
            hero_subtitle: data.services.hero_subtitle || SERVICES_DEFAULTS.hero_subtitle,
            categories:    cats,
            price_list: data.services.price_list && typeof data.services.price_list === 'object'
              ? data.services.price_list
              : SERVICES_DEFAULTS.price_list,
          });
          // Auto-select NAIL by default, fallback to first category
          const nailCat = cats.find((c: ServiceCategory) => c.key === 'NAIL');
          if (nailCat) setCategory('NAIL');
          else if (cats.length > 0) setCategory(cats[0].key);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  // ── Fallback: if categories change and current category no longer exists, reset to first ──
  useEffect(() => {
    if (servicesData.categories.length === 0) return;
    const exists = servicesData.categories.some(c => c.key === category);
    if (!exists) {
      const nailCat = servicesData.categories.find(c => c.key === 'NAIL');
      setCategory(nailCat ? 'NAIL' : servicesData.categories[0].key);
    }
  }, [servicesData.categories, category]);

  // ── GSAP Draggable ──
  useEffect(() => {
    gsap.registerPlugin(Draggable, InertiaPlugin);
    const list = galleryListRef.current;
    if (!list) return;
    const proxy = document.createElement('div');
    const updateScroll = function (this: Draggable & { scrollLeft?: number }) { list.scrollLeft = (this as any).scrollLeft + -this.x; };
    const draggable = Draggable.create(proxy, {
      type: 'x', trigger: list, inertia: true, allowContextMenu: true,
      onPressInit: function (this: Draggable & { scrollLeft?: number }) { list.dataset.dragging = 'false'; this.scrollLeft = list.scrollLeft; gsap.set(proxy, { clearProps: 'all' }); },
      onDragStart: () => { list.dataset.dragging = 'true'; observerPaused.current = false; },
      onDragEnd: () => { list.dataset.dragging = 'false'; },
      onDrag: updateScroll, onThrowUpdate: updateScroll,
    });
    return () => { draggable.forEach(d => d.kill()); };
  }, [servicesData.categories]);

  // ── IntersectionObserver for scroll detection ──
  useEffect(() => {
    const list = galleryListRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLLIElement>('li[data-key]'));
    const observer = new IntersectionObserver(entries => {
      if (observerPaused.current) return;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const key = entry.target.getAttribute('data-key');
          if (key) { categorySource.current = 'scroll'; setCategory(key); }
        }
      });
    }, { root: list, threshold: [0.6], rootMargin: '0px -30% 0px -30%' });
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, [servicesData.categories]);

  // ── Programmatic scroll to center active card ──
  useEffect(() => {
    const list = galleryListRef.current;
    if (!list || !category) return;
    const target = list.querySelector<HTMLElement>(`li[data-key="${category}"]`);
    if (!target) return;
    observerPaused.current = true;
    let rafId = 0; let frame = 0; const MAX_FRAMES = 150; const EASE = 0.15;
    const step = () => {
      if (list.dataset.dragging === 'true') { observerPaused.current = false; return; }
      const listRect = list.getBoundingClientRect(); const targetRect = target.getBoundingClientRect();
      const error = targetRect.left + targetRect.width / 2 - (listRect.left + listRect.width / 2);
      if (Math.abs(error) < 0.5 || frame >= MAX_FRAMES) { setTimeout(() => { observerPaused.current = false; }, 350); return; }
      list.scrollLeft += error * EASE; frame += 1; rafId = requestAnimationFrame(step);
    };
    const startTimer = setTimeout(() => { rafId = requestAnimationFrame(step); }, frame === 0 ? 120 : 0);
    return () => { clearTimeout(startTimer); cancelAnimationFrame(rafId); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleTabClick = (key: string) => { categorySource.current = 'tab'; setCategory(key); };

  // Safe price items getter — handles missing keys gracefully
  const getPriceItems = (): PriceItem[] => {
    try {
      const pl = servicesData.price_list;
      return pl?.[gender]?.[category] ?? [];
    } catch { return []; }
  };

  const priceItems        = getPriceItems();
  const activeGenderLabel = GENDER_OPTIONS.find(g => g.key === gender)?.label ?? '';
  const activeCategoryObj = servicesData.categories.find(c => c.key === category);

  return (
    <>
      <style>{globalCss}</style>
      <main style={{ minHeight: '100vh', backgroundColor: 'transparent', fontFamily: tokens.font.family, color: tokens.color.white }}>

        {/* Background */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <Image src="/services-bg.jpg" alt="Services background" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.85) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(4,4,5,0.6) 0%,transparent 30%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* ════════ NAVBAR ════════ */}
          <nav className={loaded ? 'nav-animate' : ''} style={{ ...S.nav, opacity: loaded ? undefined : 0 }}>
            <div style={S.navInner}>
              <div style={S.logoWrap}>
                <LogoIcon className="logo-float" />
                <span style={S.logoText}>{navData.logo_text}</span>
              </div>
              {!isMobile && (
                <div style={S.navLinks}>
                  {navData.nav_items.map((item, i) => {
                    const isActive = item.href === '/services';
                    return (
                      <a key={item.href + i} href={item.href} className="nav-link-wrap"
                        style={{ ...S.navLink, color: isActive ? tokens.color.gold : tokens.color.white }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = tokens.color.gold; }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = tokens.color.white; }}
                      >
                        {isActive ? `[ ${item.label} ]` : item.label}
                      </a>
                    );
                  })}
                </div>
              )}
              {!isMobile && <a href={navData.contact_btn_link} className="contact-btn-wrap" style={S.contactBtn}>{navData.contact_btn_text}</a>}
              {isMobile && (
                <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{ background: 'none', border: 'none', color: tokens.color.white, cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
                  </svg>
                </button>
              )}
            </div>
            {isMobile && menuOpen && (
              <div style={{ ...S.mobileMenu, animation: 'fadeInDown 0.3s ease both' }}>
                {navData.nav_items.map((item, i) => (
                  <a key={item.href + i} href={item.href} style={{ ...S.mobileNavLink, color: item.href === '/services' ? tokens.color.gold : tokens.color.white }} onClick={() => setMenuOpen(false)}>
                    {item.href === '/services' ? `[ ${item.label} ]` : item.label}
                  </a>
                ))}
                <a href={navData.contact_btn_link} style={S.mobileContact} onClick={() => setMenuOpen(false)}>{navData.contact_btn_text}</a>
              </div>
            )}
          </nav>

          {/* ════════ HERO ════════ */}
          <div ref={heroRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(2rem,6vw,5rem) clamp(1.25rem,5vw,4rem)', gap: 'clamp(1.25rem,2.5vw,2rem)' }}>
            <h1 className={heroVisible ? 'reveal-up' : ''} style={{ color: tokens.color.gold, fontSize: tokens.font.heroTitle, fontWeight: 500, lineHeight: 1.2, maxWidth: '56rem', margin: 0, opacity: heroVisible ? 1 : 0, animationDelay: '0.1s', textShadow: '0 4px 40px rgba(184,134,11,0.3)' }}>
              {servicesData.hero_heading}
            </h1>
            <p className={heroVisible ? 'reveal-up' : ''} style={{ color: tokens.color.whiteMuted, fontSize: tokens.font.heroSub, fontWeight: 500, lineHeight: 1.7, maxWidth: '52rem', margin: 0, opacity: heroVisible ? 1 : 0, animationDelay: '0.25s' }}>
              {servicesData.hero_subtitle}
            </p>
          </div>

          <Divider />

          {/* ════════ GENDER TOGGLE ════════ */}
          <div ref={toggleRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'clamp(1.5rem,3vw,2.5rem)', padding: 'clamp(2rem,4vw,3.25rem) clamp(1.25rem,5vw,4rem)' }}>
            <p className={toggleVisible ? 'reveal-up' : ''} style={{ color: tokens.color.white, fontSize: tokens.font.section, fontWeight: 500, maxWidth: '46rem', margin: 0, lineHeight: 1.6, opacity: toggleVisible ? 1 : 0, animationDelay: '0.05s' }}>
              Select a category below to explore our tailored treatments, pricing, and specialized artists.
            </p>
            <div className={`gender-tabs-wrap ${toggleVisible ? 'reveal-up' : ''}`} style={{ gap: 'clamp(1.25rem,3vw,2.5rem)', opacity: toggleVisible ? 1 : 0, animationDelay: '0.15s' }}>
              {GENDER_OPTIONS.map(opt => {
                const isActive = gender === opt.key;
                return (
                  <button key={opt.key} onClick={() => setGender(opt.key)} className={`gender-tab ${isActive ? 'gender-tab-active' : 'gender-tab-inactive'}`} style={{ minWidth: 'clamp(180px,22vw,268px)', padding: 'clamp(1rem,2vh,1.5rem) clamp(1.5rem,3vw,2.5rem)', borderRadius: tokens.radius.pill, fontSize: tokens.font.tabLabel, fontWeight: 500 }}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* ════════ CATEGORY TABS — dynamic from DB ════════ */}
          <div ref={categoryRef} style={{ padding: 'clamp(2rem,4vw,3.25rem) clamp(1.25rem,5vw,4rem) 0' }}>
            <div className={`category-tabs-wrap ${categoryVisible ? 'reveal-up' : ''}`} style={{ gap: 'clamp(0.875rem,2vw,1.75rem)', maxWidth: tokens.layout.inner, margin: '0 auto', opacity: categoryVisible ? 1 : 0, animationDelay: '0.05s' }}>
              {servicesData.categories.map(cat => {
                const isActive = category === cat.key;
                return (
                  <button key={cat.key} onClick={() => handleTabClick(cat.key)} className={`category-tab ${isActive ? 'category-tab-active' : 'category-tab-inactive'}`} style={{ minWidth: 'clamp(110px,14vw,160px)', height: 'clamp(52px,6.5vh,66px)', borderRadius: tokens.radius.tab, fontSize: tokens.font.tabLabel, fontWeight: 600, flexShrink: 0 }}>
                    {cat.label}
                  </button>
                );
              })}
              {servicesData.categories.length === 0 && (
                <p style={{ color: tokens.color.whiteFaint, fontSize: '0.9rem' }}>No categories available.</p>
              )}
            </div>
          </div>

          {/* ════════ GALLERY CAROUSEL — dynamic from DB ════════ */}
          <div ref={galleryRef} className="gallery-scroll-outer" style={{ opacity: galleryVisible ? 1 : 0, transform: galleryVisible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1),transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
            <ul ref={galleryListRef} className="gallery-scroll" data-dragging="false">
              {servicesData.categories.map(cat => (
                <li key={cat.key} data-key={cat.key}>
                  <article>
                    <Image
                      src={getImageForCategory(cat.key, cat.image)}
                      alt={cat.label}
                      fill
                      sizes="487px"
                      draggable={false}
                    />
                    <a href="#" onClick={e => { e.preventDefault(); handleTabClick(cat.key); }}>{cat.label}</a>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          {/* ════════ PRICE LIST ════════ */}
          <div ref={priceRef} style={{ padding: 'clamp(1rem,3vw,2rem) clamp(1.25rem,5vw,4rem) clamp(3rem,6vw,5rem)' }}>
            <div style={{ maxWidth: tokens.layout.inner, margin: '0 auto' }}>
              <div className="price-list-reveal" style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem,3vw,2.25rem)', opacity: priceVisible ? 1 : 0, transform: priceVisible ? 'translateY(0)' : 'translateY(20px)' }}>
                <p style={{ color: tokens.color.gold, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>{activeGenderLabel} &middot; Price List</p>
                <h3 style={{ color: tokens.color.white, fontSize: tokens.font.section, fontWeight: 600, marginTop: '0.5rem' }}>
                  {activeCategoryObj?.label ?? category}
                </h3>
              </div>
              <div key={`${gender}-${category}`} className="price-list-reveal" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: tokens.radius.card, overflow: 'hidden', opacity: priceVisible ? 1 : 0, transform: priceVisible ? 'translateY(0)' : 'translateY(20px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(0.9rem,1.8vw,1.1rem) clamp(1.25rem,3vw,2rem)', background: 'rgba(184,134,11,0.14)', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '1rem' }}>
                  <span style={{ color: tokens.color.white, fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Service</span>
                  <span style={{ color: tokens.color.gold, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: '7rem', textAlign: 'right', flexShrink: 0 }}>Price</span>
                </div>
                {priceItems.length > 0 ? priceItems.map((item, i) => (
                  <div key={item.name + i} className="price-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'clamp(0.9rem,1.8vw,1.25rem) clamp(1.25rem,3vw,2rem)', background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderBottom: i !== priceItems.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', gap: '1rem' }}>
                    <span style={{ color: tokens.color.whiteMuted, fontSize: tokens.font.priceName, fontWeight: 500 }}>{item.name}</span>
                    <span style={{ color: tokens.color.gold, fontSize: tokens.font.pricePriceValue, fontWeight: 600, minWidth: '7rem', textAlign: 'right', flexShrink: 0 }}>{item.price1}</span>
                  </div>
                )) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                    No services listed for this category yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <Divider />

          {/* ════════ FOOTER ════════ */}
          <footer ref={footerRef} style={{ position: 'relative', overflow: 'hidden', background: tokens.color.bgFooter, padding: 'clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,5.188rem)', marginTop: 'clamp(2rem,4vw,3rem)' }}>
            <div className="footer-grid" style={{ position: 'relative', zIndex: 10 }}>

              {/* Brand */}
              <div className="footer-reveal" style={{ flex: '1 1 260px', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(-40px)', transitionDelay: '0s' }}>
                <LogoIcon size={56} />
                <h2 style={{ color: tokens.color.white, fontSize: tokens.font.brand, fontWeight: 600, letterSpacing: '0.15em', margin: 0 }}>{footerData.brand_name}</h2>
                <p style={{ color: tokens.color.whiteMuted, fontSize: tokens.font.tagline, lineHeight: 1.6, margin: 0, maxWidth: '260px' }}>{footerData.brand_tagline}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {[
                    { label: 'WhatsApp',  Icon: IconWhatsApp,  href: footerData.social_whatsapp  || '#' },
                    { label: 'Facebook',  Icon: IconFacebook,  href: footerData.social_facebook  || '#' },
                    { label: 'Instagram', Icon: IconInstagram, href: footerData.social_instagram || '#' },
                  ].map(({ label, Icon, href }, i) => (
                    <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={label} className="social-icon footer-reveal-bounce" style={{ color: tokens.color.white, opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'scale(1)' : 'scale(0.5)', transitionDelay: `${0.4 + i * 0.1}s` }}>
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="footer-reveal" style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.85rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: '0.15s' }}>
                <p style={{ color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Quick Links</p>
                {footerData.quick_links.map((link, i) => (
                  <a key={link.label + i} href={link.href} className="quick-link footer-reveal-fast" style={{ color: tokens.color.whiteDim, fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: `${0.25 + i * 0.08}s` }}>{link.label}</a>
                ))}
              </div>

              {/* Locations */}
              <div className="footer-reveal" style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.85rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: '0.25s' }}>
                <p style={{ color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Our Locations</p>
                {footerData.locations.map((loc, i) => (
                  <div key={loc + i} className="footer-reveal-fast" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: `${0.35 + i * 0.08}s` }}>
                    <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}><IconLocation /></span>
                    <p style={{ color: tokens.color.whiteDim, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>{loc}</p>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="footer-reveal" style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.85rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(40px)', transitionDelay: '0.35s' }}>
                <p style={{ color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Contact Us</p>
                {[
                  { Icon: IconPhone,    text: footerData.contact_phone   },
                  { Icon: IconMail,     text: footerData.contact_email   },
                  { Icon: IconLocation, text: footerData.contact_address },
                ].map(({ Icon, text }, i) => (
                  <div key={text + i} className="footer-reveal-fast" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: `${0.45 + i * 0.08}s` }}>
                    <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}><Icon /></span>
                    <p style={{ color: tokens.color.whiteDim, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer-reveal-simple" style={{ position: 'relative', zIndex: 10, marginTop: 'clamp(2rem,4vw,2.5rem)', paddingTop: 'clamp(1rem,2vw,1.5rem)', borderTop: `1px solid ${tokens.color.whiteBorder}`, opacity: footerVisible ? 1 : 0, transitionDelay: '0.7s' }}>
              <p style={{ color: tokens.color.whiteFaint, fontSize: '0.813rem', textAlign: 'center', margin: 0 }}>{footerData.copyright_text}</p>
            </div>
          </footer>

        </div>
      </main>
    </>
  );
}