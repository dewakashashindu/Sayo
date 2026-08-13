'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import sayoLogo from '../../public/sayologo.png';

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
};

type NavItem   = { label: string; href: string };
type QuickLink = { label: string; href: string };
type NavData = {
  logo_text: string; contact_btn_text: string; contact_btn_link: string; nav_items: NavItem[];
};
type FooterData = {
  brand_name: string; brand_tagline: string; contact_phone: string; contact_email: string;
  contact_address: string; copyright_text: string; locations: string[];
  quick_links: QuickLink[]; social_whatsapp: string; social_facebook: string; social_instagram: string;
};
type Product  = { id: number; category: string; name: string; brand: string; price: string; badge: string | null; image: string; description: string; };
type Category = { key: string; label: string };

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

const CATEGORIES: Category[] = [
  { key: 'ALL', label: 'All' }, { key: 'HAIR', label: 'Hair Care' },
  { key: 'SKIN', label: 'Skin Care' }, { key: 'NAIL', label: 'Nail Care' },
  { key: 'BODY', label: 'Body Care' }, { key: 'FRAGRANCE', label: 'Fragrance' },
];

// All images use Unsplash with verified photo IDs — direct CDN, no auth needed
// Format: https://images.unsplash.com/photo-{ID}?w=400&h=460&fit=crop&q=85&auto=format
const u = (id: string, focus = 'center') =>
  `https://images.unsplash.com/photo-${id}?w=400&h=460&fit=crop&q=85&auto=format&crop=${focus}`;

const PRODUCTS: Product[] = [
  {
    id: 1, category: 'HAIR',
    name: 'Argan Oil Repair Shampoo', brand: 'SAYO Essentials',
    price: 'Rs. 2,450.00', badge: 'Best Seller',
    // Amber glass shampoo/conditioner bottles on dark surface
    image: u('1526045612335-40f3db5f0ee2'),
    description: 'Restores moisture and shine to damaged, over-processed hair.',
  },
  {
    id: 2, category: 'HAIR',
    name: 'Keratin Smoothing Mask', brand: 'SAYO Pro',
    price: 'Rs. 3,800.00', badge: 'New',
    // White cream jar open showing thick product
    image: u('1608248543803-ba4f8c70ae0b'),
    description: 'Deep conditioning treatment for frizz-free, silky smooth results.',
  },
  {
    id: 3, category: 'HAIR',
    name: 'Scalp Revive Serum', brand: 'SAYO Botanics',
    price: 'Rs. 4,200.00', badge: null,
    // Elegant dropper bottle with botanical oil, dark moody
    image: u('1617897903246-719242758050'),
    description: 'Nourishes scalp and promotes healthy hair growth naturally.',
  },
  {
    id: 4, category: 'HAIR',
    name: 'Gloss & Shine Conditioner', brand: 'SAYO Essentials',
    price: 'Rs. 2,100.00', badge: null,
    // Sleek pump/tube haircare product on clean background
    image: u('1585751119414-ef2636f8aede'),
    description: 'Lightweight daily conditioner that boosts luminosity and softness.',
  },
  {
    id: 5, category: 'SKIN',
    name: 'Gold Brightening Serum', brand: 'SAYO Gold',
    price: 'Rs. 6,900.00', badge: 'Premium',
    // Luxurious gold serum dropper bottle on black/dark velvet
    image: u('1620916566398-39f1143ab7be'),
    description: '24K gold-infused formula for radiant, even-toned complexion.',
  },
  {
    id: 6, category: 'SKIN',
    name: 'Hyaluronic Hydra Cream', brand: 'SAYO Botanics',
    price: 'Rs. 4,500.00', badge: 'Best Seller',
    // Elegant white moisturiser jar on marble with soft lighting
    image: u('1611080626919-7cf5a9dbab12'),
    description: 'Intense 72-hour hydration with plumping hyaluronic acid complex.',
  },
  {
    id: 7, category: 'SKIN',
    name: 'Rose Clay Purifying Mask', brand: 'SAYO Pure',
    price: 'Rs. 2,800.00', badge: null,
    // Pink clay mask product with rose petals, flatlay
    image: u('1596755389378-c31d21fd1273'),
    description: 'Deep pore-cleansing mask infused with kaolin and rose extract.',
  },
  {
    id: 8, category: 'SKIN',
    name: 'Vitamin C Glow Toner', brand: 'SAYO Pure',
    price: 'Rs. 3,100.00', badge: 'New',
    // Bright skincare serum/toner bottle with citrus/orange tones
    image: u('1570194065650-d99fb4ee0241'),
    description: 'Brightening toner with stable Vitamin C and niacinamide.',
  },
  {
    id: 9, category: 'NAIL',
    name: 'Strengthening Base Coat', brand: 'SAYO Nails',
    price: 'Rs. 1,200.00', badge: null,
    // Clear nail lacquer bottle closeup, manicured nails
    image: u('1604654894610-df63bc536371'),
    description: 'Fortifies brittle nails with keratin and calcium complex.',
  },
  {
    id: 10, category: 'NAIL',
    name: 'Cuticle Revival Oil', brand: 'SAYO Nails',
    price: 'Rs. 1,650.00', badge: 'Best Seller',
    // Small amber dropper oil bottle, soft clean background
    image: u('1631390069613-04b89426cc54'),
    description: 'Jojoba and vitamin E oil blend for soft, healthy cuticles.',
  },
  {
    id: 11, category: 'NAIL',
    name: 'Gel Top Coat — High Shine', brand: 'SAYO Pro',
    price: 'Rs. 2,200.00', badge: 'New',
    // Glossy red/nude nail polish bottles neatly arranged
    image: u('1632345031435-8727f592d8db'),
    description: 'Ultra-glossy, chip-resistant finish that lasts up to 3 weeks.',
  },
  {
    id: 12, category: 'BODY',
    name: 'Jasmine Body Butter', brand: 'SAYO Botanics',
    price: 'Rs. 3,400.00', badge: null,
    // Glass jar of rich white body butter/cream with botanicals
    image: u('1608181831718-c9fbb1a3b2a0'),
    description: 'Rich whipped body butter with jasmine and shea for silky skin.',
  },
  {
    id: 13, category: 'BODY',
    name: 'Sugar & Coconut Scrub', brand: 'SAYO Pure',
    price: 'Rs. 2,900.00', badge: 'Best Seller',
    // Sugar body scrub in open glass jar with coconut and sugar crystals
    image: u('1556228578-0d85b1a4d571'),
    description: 'Exfoliating sugar scrub that buffs and moisturises simultaneously.',
  },
  {
    id: 14, category: 'BODY',
    name: 'Relaxing Massage Oil', brand: 'SAYO Essentials',
    price: 'Rs. 3,700.00', badge: null,
    // Golden massage/body oil in glass bottle with spa herbs
    image: u('1600428877878-1a0fd85beda8'),
    description: 'Warming blend of arnica and eucalyptus for post-treatment care.',
  },
  {
    id: 15, category: 'FRAGRANCE',
    name: 'Oud & Rose Eau de Parfum', brand: 'SAYO Gold',
    price: 'Rs. 9,500.00', badge: 'Premium',
    // Dramatic luxury perfume bottle on dark moody background
    image: u('1594035910387-fea47794261f'),
    description: 'A sensuous blend of Bulgarian rose and aged oud wood.',
  },
  {
    id: 16, category: 'FRAGRANCE',
    name: 'White Jasmine Body Mist', brand: 'SAYO Pure',
    price: 'Rs. 4,100.00', badge: 'New',
    // Delicate spray perfume/body mist bottle with white floral styling
    image: u('1587017539504-67cfbddac569'),
    description: 'Light, refreshing body mist perfect for everyday wear.',
  },
];

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #040405; }
  @keyframes fadeInDown { from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn     { from{opacity:0}to{opacity:1} }
  @keyframes floatY     { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
  @keyframes cardIn     { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
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
  .category-tab { cursor:pointer;border:none;outline:none;font-family:Inter,sans-serif;color:#fff;transition:background 0.3s ease,border-color 0.3s ease,transform 0.25s ease,box-shadow 0.3s ease; }
  .category-tab:hover { transform: translateY(-3px); }
  .category-tab-active   { background:#B8860B;box-shadow:0 8px 24px rgba(184,134,11,0.4); }
  .category-tab-inactive { background:transparent;border:3px solid rgba(255,255,255,0.7); }
  .category-tab-inactive:hover { border-color:#B8860B;background:rgba(184,134,11,0.12); }
  .product-card { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.10);border-radius:1.25rem;overflow:hidden;transition:transform 0.35s cubic-bezier(0.16,1,0.3,1),box-shadow 0.35s ease,border-color 0.35s ease;cursor:pointer;animation:cardIn 0.6s cubic-bezier(0.16,1,0.3,1) both; }
  .product-card:hover { transform:translateY(-8px);box-shadow:0 24px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(184,134,11,0.4);border-color:rgba(184,134,11,0.4); }
  .card-img-wrap { overflow:hidden; }
  .product-card .card-img { width:100%;aspect-ratio:4/4.5;object-fit:cover;display:block;transition:filter 0.4s ease,transform 0.5s cubic-bezier(0.16,1,0.3,1); }
  .product-card:hover .card-img { filter:brightness(1.08) saturate(1.12);transform:scale(1.05); }
  .add-btn { border:none;outline:none;cursor:pointer;font-family:Inter,sans-serif;font-weight:600;font-size:0.82rem;letter-spacing:0.08em;text-transform:uppercase;background:rgba(184,134,11,0.18);color:#B8860B;border:1.5px solid rgba(184,134,11,0.5);border-radius:0.625rem;padding:0.55rem 1rem;transition:background 0.25s,color 0.25s,border-color 0.25s,transform 0.2s;position:relative;overflow:hidden; }
  .add-btn::before { content:'';position:absolute;inset:0;background:#B8860B;transform:scaleX(0);transform-origin:left;transition:transform 0.3s cubic-bezier(0.4,0,0.2,1);z-index:0; }
  .add-btn:hover::before { transform:scaleX(1); }
  .add-btn:hover { color:#000;border-color:#B8860B;transform:translateY(-1px); }
  .add-btn span { position:relative;z-index:1; }
  .search-input { background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.15);border-radius:0.75rem;color:#fff;font-family:Inter,sans-serif;font-size:0.95rem;padding:0.75rem 1rem 0.75rem 2.75rem;width:100%;outline:none;transition:border-color 0.25s,background 0.25s; }
  .search-input::placeholder { color:rgba(255,255,255,0.35); }
  .search-input:focus { border-color:rgba(184,134,11,0.6);background:rgba(255,255,255,0.09); }
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
  .category-tabs-wrap { display:flex;flex-wrap:nowrap;justify-content:flex-start;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:4px; }
  .category-tabs-wrap::-webkit-scrollbar { display:none; }
  .products-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.75rem; }
  @media(max-width:640px){ .products-grid { grid-template-columns:1fr 1fr;gap:1rem; } }
  @media(max-width:380px){ .products-grid { grid-template-columns:1fr; } }
  @media(max-width:768px){.category-tabs-wrap{gap:0.6rem!important;}}
  @media(prefers-reduced-motion:reduce){ .product-card,.nav-animate,.reveal-up,.reveal-fade { animation:none!important;transition:none!important; } }
`;

const S = {
  nav:          { position: 'relative' as const, zIndex: 20, padding: 'clamp(1rem,3vw,3rem) clamp(1rem,3vw,3.125rem)' },
  navInner:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: tokens.color.navBg, borderRadius: tokens.radius.nav, padding: 'clamp(0.75rem,2vw,1.5rem) clamp(1rem,2vw,2rem)', backdropFilter: 'blur(8px)', minHeight: '3.5rem' },
  logoWrap:     { display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem,1vw,0.75rem)' },
  logoText:     { color: tokens.color.white, fontSize: tokens.font.logoText, fontWeight: 600, letterSpacing: '0.15em' },
  navLinks:     { display: 'flex', alignItems: 'center', gap: 'clamp(1.25rem,2.5vw,2.5rem)' },
  navLink:      { fontSize: tokens.font.nav, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', whiteSpace: 'nowrap' as const },
  contactBtn:   { color: tokens.color.white, fontSize: tokens.font.nav, fontWeight: 500, textDecoration: 'none', border: `3px solid ${tokens.color.white}`, borderRadius: tokens.radius.nav, padding: 'clamp(0.375rem,0.5vw,0.5rem) clamp(1rem,1.5vw,1.75rem)', transition: 'all 0.3s', whiteSpace: 'nowrap' as const, position: 'relative' as const, zIndex: 1 },
  mobileMenu:   { marginTop: '0.5rem', background: 'rgba(0,0,0,0.92)', borderRadius: tokens.radius.nav, padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column' as const, gap: '1rem' },
  mobileNavLink:{ color: tokens.color.white, fontSize: '1rem', fontWeight: 500, textDecoration: 'none' },
  mobileContact:{ color: tokens.color.white, fontSize: '1rem', textAlign: 'center' as const, padding: '0.625rem 0', borderRadius: '0.75rem', border: `2px solid ${tokens.color.white}`, textDecoration: 'none', transition: 'all 0.2s' },
};

function LogoIcon({ className = '', size = 48 }: { className?: string; size?: number }) {
  return <Image src={sayoLogo} alt="SAYO Logo" width={size} height={size} className={className} style={{ width: 'clamp(2rem,4vw,3.5rem)', height: 'auto', objectFit: 'contain' }} priority />;
}
function IconWhatsApp()  { return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.1h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.78.97-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.24-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z"/></svg>; }
function IconFacebook()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.86c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z"/></svg>; }
function IconInstagram() { return <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.4.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.35 1.05.4 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.4 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.35-2.22.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.22-.4a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.35-1.05-.4-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.8.4-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.35 2.22-.4 1.27-.06 1.65-.07 4.85-.07zm0-2.16C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39A5.87 5.87 0 0 0 .62 4.15C.32 4.9.12 5.78.06 7.05.01 8.33 0 8.74 0 12s.01 3.67.06 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.3 1.64.5 2.91.56C8.33 24 8.74 24 12 24s3.67-.01 4.95-.06c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.39.67-.67 1.08-1.34 1.39-2.13.3-.76.5-1.64.56-2.91.06-1.28.06-1.69.06-4.95s0-3.67-.06-4.95c-.06-1.27-.26-2.15-.56-2.91a5.87 5.87 0 0 0-1.39-2.13A5.87 5.87 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>; }
function IconPhone()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>; }
function IconMail()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>; }
function IconLocation() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>; }
function IconSearch()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>; }
function IconX()        { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>; }

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check(); window.addEventListener('resize', check); return () => window.removeEventListener('resize', check);
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

// Verified fallback images per category — guaranteed beauty-relevant
const CATEGORY_FALLBACKS: Record<string, string> = {
  HAIR:      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=460&fit=crop&q=85&auto=format',
  SKIN:      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=460&fit=crop&q=85&auto=format',
  NAIL:      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=460&fit=crop&q=85&auto=format',
  BODY:      'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400&h=460&fit=crop&q=85&auto=format',
  FRAGRANCE: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=460&fit=crop&q=85&auto=format',
};

function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const [imgSrc, setImgSrc] = useState(product.image);

  const badgeStyle =
    product.badge === 'Premium'     ? { background: 'rgba(184,134,11,0.28)', color: '#d4a017', border: '1px solid rgba(184,134,11,0.5)' } :
    product.badge === 'Best Seller' ? { background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' } :
                                      { background: 'rgba(80,200,140,0.2)', color: '#5fcf97', border: '1px solid rgba(80,200,140,0.4)' };

  return (
    <div className="product-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="card-img-wrap" style={{ position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.name}
          className="card-img"
          onError={() => {
            const fb = CATEGORY_FALLBACKS[product.category];
            if (fb && imgSrc !== fb) setImgSrc(fb);
          }}
        />
        {product.badge && (
          <span style={{
            ...badgeStyle,
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', padding: '0.3rem 0.75rem',
            borderRadius: '999px', backdropFilter: 'blur(8px)',
          }}>
            {product.badge}
          </span>
        )}
      </div>
      <div style={{ padding: '1.1rem 1.25rem 1.35rem' }}>
        <p style={{ color: tokens.color.gold, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{product.brand}</p>
        <h3 style={{ color: tokens.color.white, fontSize: 'clamp(0.85rem,1.3vw,1rem)', fontWeight: 600, lineHeight: 1.35, marginBottom: '0.45rem' }}>{product.name}</h3>
        <p style={{ color: tokens.color.whiteFaint, fontSize: '0.78rem', lineHeight: 1.55, marginBottom: '1rem' }}>{product.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <span style={{ color: tokens.color.gold, fontSize: 'clamp(0.9rem,1.4vw,1.05rem)', fontWeight: 700, flexShrink: 0 }}>{product.price}</span>
          <button className="add-btn"><span>Add to Bag</span></button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  const [category, setCategory] = useState('ALL');
  const [search,   setSearch]   = useState('');
  const [navData,    setNavData]    = useState<NavData>(NAV_DEFAULTS);
  const [footerData, setFooterData] = useState<FooterData>(FOOTER_DEFAULTS);
  const isMobile = useIsMobile(1024);
  const { ref: heroRef,   inView: heroVisible   } = useInView(0.05);
  const { ref: filterRef, inView: filterVisible } = useInView(0.1);
  const { ref: gridRef,   inView: gridVisible   } = useInView(0.05);
  const { ref: footerRef, inView: footerVisible } = useInView(0.05);

  useEffect(() => {
    fetch('/api/content').then(r => r.json())
      .then((data: { nav?: Partial<NavData>; footer?: Partial<FooterData> }) => {
        if (data?.nav)    setNavData(p    => ({ ...p, ...data.nav }));
        if (data?.footer) setFooterData(p => ({ ...p, ...data.footer }));
      }).catch(() => {});
  }, []);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  const filtered = PRODUCTS.filter(p => {
    const matchCat    = category === 'ALL' || p.category === category;
    const q           = search.trim().toLowerCase();
    const matchSearch = q === '' || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <>
      <style>{globalCss}</style>
      <main style={{ minHeight: '100vh', backgroundColor: 'transparent', fontFamily: tokens.font.family, color: tokens.color.white }}>

        {/* BG */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <Image src="/products-bg.jpg" alt="Products background" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.85) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(4,4,5,0.6) 0%,transparent 30%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10 }}>

          {/* NAV */}
          <nav className={loaded ? 'nav-animate' : ''} style={{ ...S.nav, opacity: loaded ? undefined : 0 }}>
            <div style={S.navInner}>
              <div style={S.logoWrap}>
                <LogoIcon className="logo-float" />
                <span style={S.logoText}>{navData.logo_text}</span>
              </div>
              {!isMobile && (
                <div style={S.navLinks}>
                  {navData.nav_items.map((item, i) => {
                    const isActive = item.href === '/products';
                    return (
                      <a key={item.href + i} href={item.href} className="nav-link-wrap"
                        style={{ ...S.navLink, color: isActive ? tokens.color.gold : tokens.color.white }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = tokens.color.gold; }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = tokens.color.white; }}
                      >
                        {isActive ? `[ ${item.label} ]` : item.label}
                      </a>
                    );
                  })}
                </div>
              )}
              {!isMobile && <a href={navData.contact_btn_link} className="contact-btn-wrap" style={S.contactBtn}>{navData.contact_btn_text}</a>}
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
                {navData.nav_items.map((item, i) => (
                  <a key={item.href + i} href={item.href}
                    style={{ ...S.mobileNavLink, color: item.href === '/products' ? tokens.color.gold : tokens.color.white }}
                    onClick={() => setMenuOpen(false)}>
                    {item.href === '/products' ? `[ ${item.label} ]` : item.label}
                  </a>
                ))}
                <a href={navData.contact_btn_link} style={S.mobileContact} onClick={() => setMenuOpen(false)}>{navData.contact_btn_text}</a>
              </div>
            )}
          </nav>

          {/* HERO */}
          <div ref={heroRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(2rem,6vw,5rem) clamp(1.25rem,5vw,4rem)', gap: 'clamp(1.25rem,2.5vw,2rem)' }}>
            <p className={heroVisible ? 'reveal-up' : ''} style={{ color: tokens.color.gold, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: heroVisible ? 1 : 0, animationDelay: '0.05s', margin: 0 }}>SAYO Beauty · Curated Collection</p>
            <h1 className={heroVisible ? 'reveal-up' : ''} style={{ color: tokens.color.gold, fontSize: tokens.font.heroTitle, fontWeight: 500, lineHeight: 1.2, maxWidth: '56rem', margin: 0, opacity: heroVisible ? 1 : 0, animationDelay: '0.15s', textShadow: '0 4px 40px rgba(184,134,11,0.3)' }}>Products Crafted for Your Unique Glow</h1>
            <p className={heroVisible ? 'reveal-up' : ''} style={{ color: tokens.color.whiteMuted, fontSize: tokens.font.heroSub, fontWeight: 500, lineHeight: 1.7, maxWidth: '52rem', margin: 0, opacity: heroVisible ? 1 : 0, animationDelay: '0.25s' }}>Handpicked formulas from the world's most exclusive botanicals. Every product in our collection is salon-tested and curated by our expert stylists.</p>
          </div>

          <Divider />

          {/* FILTERS */}
          <div ref={filterRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'clamp(1.5rem,3vw,2.5rem)', padding: 'clamp(2rem,4vw,3.25rem) clamp(1.25rem,5vw,4rem)' }}>
            <div className={heroVisible ? 'reveal-up' : ''} style={{ width: '100%', maxWidth: '480px', position: 'relative', opacity: filterVisible ? 1 : 0, animationDelay: '0.05s' }}>
              <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: tokens.color.whiteFaint, pointerEvents: 'none', display: 'flex' }}><IconSearch /></span>
              <input type="text" className="search-input" placeholder="Search by product name or brand…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch('')} aria-label="Clear search"
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: tokens.color.whiteFaint, cursor: 'pointer', display: 'flex', padding: '0.2rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = tokens.color.whiteFaint}
                ><IconX /></button>
              )}
            </div>
            <div className={`category-tabs-wrap ${filterVisible ? 'reveal-up' : ''}`} style={{ gap: 'clamp(0.875rem,2vw,1.75rem)', maxWidth: tokens.layout.inner, width: '100%', opacity: filterVisible ? 1 : 0, animationDelay: '0.15s', justifyContent: 'center' }}>
              {CATEGORIES.map(cat => {
                const isActive = category === cat.key;
                return (
                  <button key={cat.key} onClick={() => setCategory(cat.key)}
                    className={`category-tab ${isActive ? 'category-tab-active' : 'category-tab-inactive'}`}
                    style={{ minWidth: 'clamp(90px,12vw,148px)', height: 'clamp(52px,6.5vh,66px)', borderRadius: tokens.radius.tab, fontSize: tokens.font.tabLabel, fontWeight: 600, flexShrink: 0 }}>
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <p className={filterVisible ? 'reveal-fade' : ''} style={{ color: tokens.color.whiteFaint, fontSize: '0.82rem', fontWeight: 500, opacity: filterVisible ? 1 : 0, animationDelay: '0.25s', margin: 0 }}>
              {filtered.length === 0 ? 'No products found' : `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}${search ? ` for "${search}"` : ''}`}
            </p>
          </div>

          <Divider />

          {/* GRID */}
          <div ref={gridRef} style={{ padding: 'clamp(2rem,4vw,3.5rem) clamp(1.25rem,5vw,4rem) clamp(4rem,7vw,6rem)', opacity: gridVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
            <div style={{ maxWidth: tokens.layout.inner, margin: '0 auto' }}>
              {filtered.length > 0 ? (
                <div className="products-grid">
                  {filtered.map((p, i) => <ProductCard key={p.id} product={p} delay={Math.min(i * 60, 400)} />)}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                  <div style={{ color: tokens.color.gold, fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}>✦</div>
                  <p style={{ color: tokens.color.whiteMuted, fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>No products found</p>
                  <p style={{ color: tokens.color.whiteFaint, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Try a different search term or browse all categories.</p>
                  <button onClick={() => { setSearch(''); setCategory('ALL'); }} className="category-tab category-tab-inactive" style={{ minWidth: '160px', height: '50px', borderRadius: tokens.radius.tab, fontSize: '0.9rem', fontWeight: 600 }}>Clear Filters</button>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* FOOTER */}
          <footer ref={footerRef} style={{ position: 'relative', overflow: 'hidden', background: tokens.color.bgFooter, padding: 'clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,5.188rem)', marginTop: 'clamp(2rem,4vw,3rem)' }}>
            <div className="footer-grid" style={{ position: 'relative', zIndex: 10 }}>
              <div className="footer-reveal" style={{ flex: '1 1 260px', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(-40px)', transitionDelay: '0s' }}>
                <LogoIcon size={56} />
                <h2 style={{ color: tokens.color.white, fontSize: tokens.font.brand, fontWeight: 600, letterSpacing: '0.15em', margin: 0 }}>{footerData.brand_name}</h2>
                <p style={{ color: tokens.color.whiteMuted, fontSize: tokens.font.tagline, lineHeight: 1.6, margin: 0, maxWidth: '260px' }}>{footerData.brand_tagline}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {([
                    { label: 'WhatsApp',  Icon: IconWhatsApp,  href: footerData.social_whatsapp  || '#' },
                    { label: 'Facebook',  Icon: IconFacebook,  href: footerData.social_facebook  || '#' },
                    { label: 'Instagram', Icon: IconInstagram, href: footerData.social_instagram || '#' },
                  ] as const).map(({ label, Icon, href }, i) => (
                    <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={label}
                      className="social-icon footer-reveal-bounce"
                      style={{ opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'scale(1)' : 'scale(0.5)', transitionDelay: `${0.4 + i * 0.1}s` }}>
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
              <div className="footer-reveal" style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.85rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: '0.15s' }}>
                <p style={{ color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Quick Links</p>
                {footerData.quick_links.map((link, i) => (
                  <a key={link.label + i} href={link.href} className="quick-link footer-reveal-fast"
                    style={{ color: tokens.color.whiteDim, fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: `${0.25 + i * 0.08}s` }}>
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="footer-reveal" style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.85rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: '0.25s' }}>
                <p style={{ color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Our Locations</p>
                {footerData.locations.map((loc, i) => (
                  <div key={loc + i} className="footer-reveal-fast" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(20px)', transitionDelay: `${0.35 + i * 0.08}s` }}>
                    <span style={{ color: tokens.color.gold, flexShrink: 0, marginTop: '2px' }}><IconLocation /></span>
                    <p style={{ color: tokens.color.whiteDim, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>{loc}</p>
                  </div>
                ))}
              </div>
              <div className="footer-reveal" style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '0.85rem', opacity: footerVisible ? 1 : 0, transform: footerVisible ? 'translateX(0)' : 'translateX(40px)', transitionDelay: '0.35s' }}>
                <p style={{ color: tokens.color.gold, fontSize: tokens.font.label, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Contact Us</p>
                {([
                  { Icon: IconPhone,    text: footerData.contact_phone   },
                  { Icon: IconMail,     text: footerData.contact_email   },
                  { Icon: IconLocation, text: footerData.contact_address },
                ] as const).map(({ Icon, text }, i) => (
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