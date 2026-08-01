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

  .staff-card:hover { transform: translateY(-6px); }
  .gallery-img:hover { transform: scale(1.03); }
  .mobile-gallery-img { transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  .mobile-gallery-img:hover { transform: scale(1.02); }
  .mosaic-tile:hover img { transform: scale(1.08); }
  .mosaic-tile img { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }

  .review-dot { cursor: pointer; transition: background 0.3s; }

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

  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr !important; }
  }

  @media (max-width: 480px) {
    .story-mosaic { transform: scale(0.82); transform-origin: center; }
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
    color: tokens.color.white,
    fontSize: tokens.font.logoText,
    fontWeight: 600,
    letterSpacing: '0.15em',
  } as React.CSSProperties,

  navLinks: {
    display: 'flex', alignItems: 'center',
    gap: 'clamp(1.25rem, 2.5vw, 2.5rem)',
  } as React.CSSProperties,

  navLinkActive: {
    color: tokens.color.gold,
    fontSize: tokens.font.nav,
    fontWeight: 500,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,

  navLink: {
    color: tokens.color.white,
    fontSize: tokens.font.nav,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,

  contactBtn: {
    color: tokens.color.white,
    fontSize: tokens.font.nav,
    fontWeight: 500,
    textDecoration: 'none',
    border: `3px solid ${tokens.color.white}`,
    borderRadius: tokens.radius.contact,
    padding: 'clamp(0.375rem, 0.5vw, 0.5rem) clamp(1rem, 1.5vw, 1.75rem)',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,

  mobileMenu: {
    marginTop: '0.5rem',
    background: 'rgba(0,0,0,0.92)',
    borderRadius: tokens.radius.nav,
    padding: '1rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  } as React.CSSProperties,

  mobileNavLinkActive: {
    color: tokens.color.gold,
    fontSize: '1rem',
    fontWeight: 500,
    textDecoration: 'none',
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
   TYPES
───────────────────────────────────────── */
type NavItem     = { label: string; href: string };
type QuickLink   = { label: string; href: string };

type StaffMember = {
  name:        string;
  role:        string;
  experience:  string;
  bio:         string;
  specialties: string;
};

type AboutReview = { quote: string; author: string };

type NavData = {
  logo_text:        string;
  contact_btn_text: string;
  contact_btn_link: string;
  nav_items:        NavItem[];
};

type FooterData = {
  brand_name:       string;
  brand_tagline:    string;
  contact_phone:    string;
  contact_email:    string;
  contact_address:  string;
  copyright_text:   string;
  locations:        string[];
  quick_links:      QuickLink[];
  social_whatsapp:  string;
  social_facebook:  string;
  social_instagram: string;
};

type AboutData = {
  hero_eyebrow:          string;
  hero_heading:          string;
  hero_body:             string;
  team_section_title:    string;
  staff:                 StaffMember[];
  gallery_section_title: string;
  gallery_description:   string;
  review_section_title:  string;
  reviews:               AboutReview[];
};

/* ─────────────────────────────────────────
   DEFAULTS
───────────────────────────────────────── */
const NAV_DEFAULTS: NavData = {
  logo_text:        'SAYO',
  contact_btn_text: 'CONTACT US',
  contact_btn_link: '/contact',
  nav_items: [
    { label: 'HOME',      href: '/'         },
    { label: 'OUR STORY', href: '/about'    },
    { label: 'SERVICES',  href: '/services' },
    { label: 'PRODUCTS',  href: '/products' },
    { label: 'REVIEWS',   href: '/reviews'  },
  ],
};

const FOOTER_DEFAULTS: FooterData = {
  brand_name:      'SAYO',
  brand_tagline:   'We are experienced in making you more beautiful',
  contact_phone:   '+94 77 233 6233',
  contact_email:   'hello@sayobeauty.com',
  contact_address: '123 Galle Road, Colombo, Sri Lanka',
  copyright_text:  `© ${new Date().getFullYear()} SAYO Beauty. All rights reserved.`,
  locations:       ['Colombo', 'Negombo', 'Kiribathgoda'],
  quick_links: [
    { label: 'Home',      href: '/'         },
    { label: 'Services',  href: '/services' },
    { label: 'Products',  href: '/products' },
    { label: 'Reviews',   href: '/reviews'  },
  ],
  social_whatsapp:  '',
  social_facebook:  '',
  social_instagram: '',
};

const ABOUT_DEFAULTS: AboutData = {
  hero_eyebrow:       'OUR STORY',
  hero_heading:       'We are experience in making you more beautiful',
  hero_body:          'We will make your skin better and also more glowing skin. And we provide to treatment spa and face with best service our employees,',
  team_section_title: 'Meet the Visionaries',
  staff: [
    {
      name:        'Hiruni Perera',
      role:        'Lead Stylist & Founder',
      experience:  '12+ Years',
      bio:         'Train-certified in London and Singapore, Hiruni founded the salon with a vision to revolutionize modern hair styling in Sri Lanka. Known for signature balayage techniques and tailored consultations, she ensures every client leaves with a look that flatters their unique features.',
      specialties: 'Precision Haircuts, Balayage & Highlights, Advanced Hair Treatments',
    },
    {
      name:        'Aruna Ratnayake',
      role:        'Grooming Specialist',
      experience:  '10+ Years',
      bio:         "Bringing a sharp eye for detail and modern barbering techniques, Aruna specializes in tailored men's styling and beard architecture. From crisp fade cuts and traditional hot-towel shaves to complete pre-wedding grooming sessions for grooms and groomsmen.",
      specialties: "Precision Beard Sculpting, Classic & Modern Men's Haircuts, Groom's Styling Package",
    },
  ],
  gallery_section_title: 'Transformations & Artistry',
  gallery_description:   'Explore our latest work, behind-the-scenes moments, and client transformations. From timeless Sri Lankan bridal looks to sleek modern cuts — see how we bring beauty to life.',
  review_section_title:  'What Our Clients Say',
  reviews: [
    { quote: '"Choosing SAYO for my Kandyan bridal dressing was the best decision I made. The artist listened to every detail, and my saree draping and makeup stayed flawless through the hot humidity from morning to night."', author: 'Nimesha D.' },
    { quote: '"I\'ve tried many salons across Colombo, but SAYO stands apart. The balayage Hiruni did for me was absolutely stunning — I\'ve never had so many compliments on my hair!"',                                         author: 'Sanduni R.' },
    { quote: '"Aruna\'s attention to detail with my beard and fade was exceptional. Worth every rupee. I\'ll never go anywhere else for my grooming."',                                                                           author: 'Kasun P.'   },
    { quote: '"From the moment you walk in, you feel looked after. The team is professional, warm, and genuinely talented. My go-to salon for every occasion."',                                                                  author: 'Dilani W.'  },
  ],
};

// Staff images — DB eke naha, index eken match karanawa
const STAFF_IMAGES = ['/staff-hiruni.jpg', '/staff-aruna.jpg'];

/* ─────────────────────────────────────────
   IMAGE / VIDEO DATA
───────────────────────────────────────── */
const GALLERY = {
  img1: '/Rectangle 32.jpg',
  img2: '/Rectangle 33.jpg',
  img3: '/Rectangle 34.jpg',
  img4: '/Rectangle 36.jpg',
  img5: '/Rectangle 35.jpg',
};

const HERO_ABOUT_IMAGE = '/heroabout.jpg';
const FLOWER_IMAGE     = '/flower.png';
const REVIEW_BG        = '/review.jpg';

/* ─────────────────────────────────────────
   LOGO
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

/* ─────────────────────────────────────────
   SVG / ICONS
───────────────────────────────────────── */
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
      <path d="M21 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
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
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
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
      { threshold },
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
   SMOKE BACKGROUND
───────────────────────────────────────── */
function SmokeBackground() {
  const particles = [
    { top: '35%', left: '8%',  delay: '0s',   dur: '7s'  },
    { top: '28%', left: '15%', delay: '1.5s', dur: '9s'  },
    { top: '40%', left: '22%', delay: '3s',   dur: '8s'  },
    { top: '32%', left: '30%', delay: '0.8s', dur: '11s' },
    { top: '45%', left: '45%', delay: '2s',   dur: '10s' },
    { top: '50%', left: '55%', delay: '4s',   dur: '8s'  },
    { top: '38%', left: '65%', delay: '1s',   dur: '9s'  },
    { top: '25%', left: '75%', delay: '2.5s', dur: '7s'  },
    { top: '42%', left: '82%', delay: '3.5s', dur: '12s' },
    { top: '60%', left: '10%', delay: '1.2s', dur: '10s' },
    { top: '55%', left: '35%', delay: '2.8s', dur: '8s'  },
    { top: '65%', left: '60%', delay: '0.5s', dur: '11s' },
    { top: '20%', left: '50%', delay: '3.2s', dur: '9s'  },
    { top: '70%', left: '80%', delay: '1.8s', dur: '7s'  },
  ];

  return (
    <div style={{
      position:      'fixed',
      inset:         0,
      zIndex:        0,
      pointerEvents: 'none',
      background:    '#0a0a0a',
      overflow:      'hidden',
    }}>
      <div style={{
        position:   'absolute', bottom: '-10%', left: '30%',
        width:      '40%',      height: '40%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)',
        animation:  'glowPulse 6s ease-in-out infinite',
      }} />
      <div style={{
        position:   'absolute', top: '-5%', right: '-5%',
        width:      '30%',      height: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)',
        animation:  'glowPulse 8s ease-in-out 2s infinite',
      }} />
      <div style={{
        position:     'absolute', top: '25%', left: 0,
        width:        '70%',      height: '35%',
        background:   'radial-gradient(ellipse 80% 40% at 30% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(18px)',
        animation:    'smokeFlow1 18s ease-in-out infinite',
      }} />
      <div style={{
        position:     'absolute', top: '20%', right: 0,
        width:        '50%',      height: '30%',
        background:   'radial-gradient(ellipse 70% 40% at 70% 50%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(22px)',
        animation:    'smokeFlow2 22s ease-in-out 4s infinite',
      }} />
      <div style={{
        position:     'absolute', top: '30%', left: '10%',
        width:        '80%',      height: '25%',
        background:   'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.06) 70%, transparent 100%)',
        borderRadius: '50%', filter: 'blur(25px)', transform: 'rotate(-5deg)',
        animation:    'smokeFlow1 25s ease-in-out 2s infinite',
      }} />
      <div style={{
        position:   'absolute', top: '10%', right: '5%',
        width:      '35%',      height: '40%',
        background: 'radial-gradient(ellipse 60% 80% at 60% 30%, rgba(255,255,255,0.09) 0%, transparent 70%)',
        filter:     'blur(20px)',
        animation:  'smokeFlow2 20s ease-in-out 6s infinite',
      }} />
      <div style={{
        position:     'absolute', bottom: '15%', left: '20%',
        width:        '60%',      height: '20%',
        background:   'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(30px)',
        animation:    'smokeFlow1 30s ease-in-out 8s infinite',
      }} />
      {particles.map((p, i) => (
        <div key={i} style={{
          position:     'absolute',
          top:          p.top,
          left:         p.left,
          width:        i % 3 === 0 ? '3px' : '2px',
          height:       i % 3 === 0 ? '3px' : '2px',
          borderRadius: '50%',
          background:   'rgba(255,255,255,0.85)',
          boxShadow:    '0 0 4px rgba(255,255,255,0.6)',
          animation:    `particleFloat ${p.dur} ease-in-out ${p.delay} infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   MOSAIC
───────────────────────────────────────── */
function getMosaicMetricsMobile() {
  const COL1 = 9.2, COL2 = 9.2, COL3 = 7.1;
  const ROW1 = 6.5, ROW2 = 10,  ROW3 = 6.5;
  const GAP  = 1;
  const CANVAS_W = COL1 + COL2 + COL3 + GAP * 2;
  const CANVAS_H = ROW1 + ROW2 + ROW3 + GAP * 2;
  const COL1_X = 0, COL2_X = COL1 + GAP, COL3_X = COL2_X + COL2 + GAP;
  const ROW1_Y = 0, ROW2_Y = ROW1 + GAP, ROW3_Y = ROW2_Y + ROW2 + GAP;
  return { COL1, COL2, COL3, ROW1, ROW2, ROW3, GAP, CANVAS_W, CANVAS_H, COL1_X, COL2_X, COL3_X, ROW1_Y, ROW2_Y, ROW3_Y };
}

function getMosaicMetricsDesktop() {
  const COL1 = 14, COL2 = 14, COL3 = 11;
  const ROW1 = 10, ROW2 = 15, ROW3 = 10;
  const GAP  = 1.2;
  const CANVAS_W = COL1 + COL2 + COL3 + GAP * 2;
  const CANVAS_H = ROW1 + ROW2 + ROW3 + GAP * 2;
  const COL1_X = 0, COL2_X = COL1 + GAP, COL3_X = COL2_X + COL2 + GAP;
  const ROW1_Y = 0, ROW2_Y = ROW1 + GAP, ROW3_Y = ROW2_Y + ROW2 + GAP;
  return { COL1, COL2, COL3, ROW1, ROW2, ROW3, GAP, CANVAS_W, CANVAS_H, COL1_X, COL2_X, COL3_X, ROW1_Y, ROW2_Y, ROW3_Y };
}

function ImageSlice({ x, y, canvasW, canvasH, alt }: {
  x: number; y: number; canvasW: number; canvasH: number; alt: string;
}) {
  return (
    <div style={{ position: 'absolute', top: `-${y}rem`, left: `-${x}rem`, width: `${canvasW}rem`, height: `${canvasH}rem` }}>
      <Image
        src={HERO_ABOUT_IMAGE} alt={alt} fill
        sizes="(max-width: 900px) 100vw, 50vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}

function StoryMosaic({ visible, desktop }: { visible: boolean; desktop: boolean }) {
  const m = desktop ? getMosaicMetricsDesktop() : getMosaicMetricsMobile();

  return (
    <div
      className="story-mosaic"
      style={{
        display:             'grid',
        gridTemplateColumns: `${m.COL1}rem ${m.COL2}rem ${m.COL3}rem`,
        gridTemplateRows:    `${m.ROW1}rem ${m.ROW2}rem ${m.ROW3}rem`,
        gap:                 `${m.GAP}rem`,
        width:               `${m.CANVAS_W}rem`,
        maxWidth:            '100%',
        margin:              '0 auto',
      }}
    >
      {/* Top — small square */}
      <div
        className={`mosaic-tile ${visible ? 'tile-reveal' : ''}`}
        style={{
          gridColumn: 2, gridRow: 1,
          position: 'relative', borderRadius: tokens.radius.tile, overflow: 'hidden',
          opacity: visible ? 1 : 0, animationDelay: '0.15s',
        }}
      >
        <ImageSlice x={m.COL2_X} y={m.ROW1_Y} canvasW={m.CANVAS_W} canvasH={m.CANVAS_H} alt="Makeup application" />
      </div>

      {/* Middle-left */}
      <div
        className={`mosaic-tile ${visible ? 'tile-reveal' : ''}`}
        style={{
          gridColumn: 1, gridRow: 2,
          position: 'relative', borderRadius: tokens.radius.tile, overflow: 'hidden',
          opacity: visible ? 1 : 0, animationDelay: '0.23s',
        }}
      >
        <ImageSlice x={m.COL1_X} y={m.ROW2_Y} canvasW={m.CANVAS_W} canvasH={m.CANVAS_H} alt="Eye makeup detail" />
      </div>

      {/* Middle-center */}
      <div
        className={`mosaic-tile ${visible ? 'tile-reveal' : ''}`}
        style={{
          gridColumn: 2, gridRow: 2,
          position: 'relative', borderRadius: tokens.radius.tile, overflow: 'hidden',
          opacity: visible ? 1 : 0, animationDelay: '0.31s',
        }}
      >
        <ImageSlice x={m.COL2_X} y={m.ROW2_Y} canvasW={m.CANVAS_W} canvasH={m.CANVAS_H} alt="Face closeup" />
      </div>

      {/* Right — flower, spans row 1-2 */}
      <div
        className={visible ? 'tile-reveal' : ''}
        style={{
          gridColumn: 3, gridRow: '1 / 3',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'visible', opacity: visible ? 1 : 0, animationDelay: '0.45s',
        }}
      >
        <div
          className="flower-float"
          style={{ position: 'relative', width: desktop ? '140%' : '108%', height: desktop ? '140%' : '108%' }}
        >
          <Image src={FLOWER_IMAGE} alt="Decorative flower" fill sizes="18vw" style={{ objectFit: 'contain' }} />
        </div>
      </div>

      {/* Bottom-left */}
      <div
        className={`mosaic-tile ${visible ? 'tile-reveal' : ''}`}
        style={{
          gridColumn: 1, gridRow: 3,
          position: 'relative', borderRadius: tokens.radius.tile, overflow: 'hidden',
          opacity: visible ? 1 : 0, animationDelay: '0.39s',
        }}
      >
        <ImageSlice x={m.COL1_X} y={m.ROW3_Y} canvasW={m.CANVAS_W} canvasH={m.CANVAS_H} alt="Hair detail" />
      </div>

      {/* Bottom-center */}
      <div
        className={`mosaic-tile ${visible ? 'tile-reveal' : ''}`}
        style={{
          gridColumn: 2, gridRow: 3,
          position: 'relative', borderRadius: tokens.radius.tile, overflow: 'hidden',
          opacity: visible ? 1 : 0, animationDelay: '0.47s',
        }}
      >
        <ImageSlice x={m.COL2_X} y={m.ROW3_Y} canvasW={m.CANVAS_W} canvasH={m.CANVAS_H} alt="Lips detail" />
      </div>

      {/* Bottom-right */}
      <div
        className={`mosaic-tile ${visible ? 'tile-reveal' : ''}`}
        style={{
          gridColumn: 3, gridRow: 3,
          position: 'relative', borderRadius: tokens.radius.tile, overflow: 'hidden',
          opacity: visible ? 1 : 0, animationDelay: '0.55s',
        }}
      >
        <ImageSlice x={m.COL3_X} y={m.ROW3_Y} canvasW={m.CANVAS_W} canvasH={m.CANVAS_H} alt="Skin closeup" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   GALLERY SUB-COMPONENTS
───────────────────────────────────────── */
function GalleryTextCard({
  visible, delay, minHeight = '200px', className = '', description,
}: {
  visible: boolean; delay: string; minHeight?: string; className?: string; description: string;
}) {
  return (
    <div
      className={className}
      style={{
        border:         `1px solid ${tokens.color.gold}`,
        borderRadius:   tokens.radius.gallery,
        padding:        'clamp(1.25rem, 3vw, 2rem)',
        background:     'rgba(184,134,11,0.08)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        flex:           1,
        minHeight,
        opacity:        visible ? 1 : 0,
        animationDelay: delay,
      }}
    >
      <div style={{
        width:        '2.5rem', height: '3px',
        background:   tokens.color.gold, borderRadius: '9999px',
        marginBottom: '1.25rem',
      }} />
      <p style={{
        fontSize:   'clamp(0.875rem, 1.4vw, 1.05rem)',
        fontWeight: 400,
        lineHeight: 1.75,
        margin:     0,
        color:      tokens.color.whiteMuted,
        textAlign:  'center',
      }}>
        {description}
      </p>
    </div>
  );
}

function GalleryFeaturedImage({
  src, height, sizes, visible, delay, className = '',
}: {
  src: string; height: string; sizes: string;
  visible: boolean; delay: string; className?: string;
}) {
  return (
    <div
      className={`mobile-gallery-img ${className}`}
      style={{
        position:       'relative',
        borderRadius:   tokens.radius.gallery,
        overflow:       'hidden',
        height,
        opacity:        visible ? 1 : 0,
        animationDelay: delay,
      }}
    >
      <Image src={src} alt="Beauty treatment" fill sizes={sizes} style={{ objectFit: 'cover' }} />
      <div style={{
        position:   'absolute', bottom: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
      }} />
      <div style={{
        position:      'absolute', top: '1rem', left: '1rem',
        background:    tokens.color.gold,
        color:         tokens.color.white,
        fontSize:      '0.7rem',
        fontWeight:    700,
        letterSpacing: '0.12em',
        padding:       '0.3rem 0.875rem',
        borderRadius:  '9999px',
        textTransform: 'uppercase',
      }}>
        Featured
      </div>
      <div style={{
        position:  'absolute', bottom: '1rem', left: '1rem', right: '1rem',
        display:   'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        <div style={{
          width:        '1.5rem', height: '2px',
          background:   tokens.color.gold, borderRadius: '9999px', flexShrink: 0,
        }} />
        <span style={{
          color:         tokens.color.white,
          fontSize:      '0.875rem',
          fontWeight:    500,
          letterSpacing: '0.05em',
        }}>
          Premium Beauty Service
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function AboutPage() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [loaded,       setLoaded]       = useState(false);
  const [activeReview, setActiveReview] = useState(0);

  // ── CHANGE 1: showAllStaff state ──
  const [showAllStaff, setShowAllStaff] = useState(false);

  // ── DB data state ──
  const [navData,    setNavData]    = useState<NavData>(NAV_DEFAULTS);
  const [footerData, setFooterData] = useState<FooterData>(FOOTER_DEFAULTS);
  const [aboutData,  setAboutData]  = useState<AboutData>(ABOUT_DEFAULTS);

  const isMobile        = useIsMobile(1024);
  const isMobileGallery = useIsMobile(768);
  const isMobileHero    = useIsMobile(901);

  const { ref: heroRef,    inView: heroVisible    } = useInView(0.1);
  const { ref: teamRef,    inView: teamVisible    } = useInView(0.1);
  const { ref: galleryRef, inView: galleryVisible } = useInView(0.1);
  const { ref: reviewRef,  inView: reviewVisible  } = useInView(0.1);
  const { ref: footerRef,  inView: footerVisible  } = useInView(0.1);

  // ── Load DB data ──
  useEffect(() => {
    fetch('/api/site-data')
      .then(r => r.json())
      .then(data => {
        if (data?.nav) {
          setNavData({
            logo_text:        data.nav.logo_text        || NAV_DEFAULTS.logo_text,
            contact_btn_text: data.nav.contact_btn_text || NAV_DEFAULTS.contact_btn_text,
            contact_btn_link: data.nav.contact_btn_link || NAV_DEFAULTS.contact_btn_link,
            nav_items: Array.isArray(data.nav.nav_items) && data.nav.nav_items.length > 0
              ? data.nav.nav_items
              : NAV_DEFAULTS.nav_items,
          });
        }
        if (data?.footer) {
          setFooterData({
            brand_name:      data.footer.brand_name      || FOOTER_DEFAULTS.brand_name,
            brand_tagline:   data.footer.brand_tagline   || FOOTER_DEFAULTS.brand_tagline,
            contact_phone:   data.footer.contact_phone   || FOOTER_DEFAULTS.contact_phone,
            contact_email:   data.footer.contact_email   || FOOTER_DEFAULTS.contact_email,
            contact_address: data.footer.contact_address || FOOTER_DEFAULTS.contact_address,
            copyright_text:  data.footer.copyright_text  || FOOTER_DEFAULTS.copyright_text,
            locations: Array.isArray(data.footer.locations) && data.footer.locations.length > 0
              ? data.footer.locations
              : FOOTER_DEFAULTS.locations,
            quick_links: Array.isArray(data.footer.quick_links) && data.footer.quick_links.length > 0
              ? data.footer.quick_links
              : FOOTER_DEFAULTS.quick_links,
            social_whatsapp:  data.footer.social_whatsapp  || '',
            social_facebook:  data.footer.social_facebook  || '',
            social_instagram: data.footer.social_instagram || '',
          });
        }
        if (data?.about) {
          setAboutData({
            hero_eyebrow:          data.about.hero_eyebrow          || ABOUT_DEFAULTS.hero_eyebrow,
            hero_heading:          data.about.hero_heading          || ABOUT_DEFAULTS.hero_heading,
            hero_body:             data.about.hero_body             || ABOUT_DEFAULTS.hero_body,
            team_section_title:    data.about.team_section_title    || ABOUT_DEFAULTS.team_section_title,
            staff: Array.isArray(data.about.staff) && data.about.staff.length > 0
              ? data.about.staff
              : ABOUT_DEFAULTS.staff,
            gallery_section_title: data.about.gallery_section_title || ABOUT_DEFAULTS.gallery_section_title,
            gallery_description:   data.about.gallery_description   || ABOUT_DEFAULTS.gallery_description,
            review_section_title:  data.about.review_section_title  || ABOUT_DEFAULTS.review_section_title,
            reviews: Array.isArray(data.about.reviews) && data.about.reviews.length > 0
              ? data.about.reviews
              : ABOUT_DEFAULTS.reviews,
          });
        }
      })
      .catch(() => {
        // Silent fail — defaults use wenawa
      });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const Divider = () => (
    <div style={{
      height:     '1px',
      background: tokens.color.whiteBorder,
      margin:     '0 clamp(2rem, 10vw, 10.875rem)',
    }} />
  );

  return (
    <>
      <style>{globalCss}</style>

      <main style={{
        minHeight:  '100vh',
        fontFamily: tokens.font.family,
        color:      tokens.color.white,
        position:   'relative',
        overflow:   'hidden',
        background: 'transparent',
      }}>
        <SmokeBackground />

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ══════════ NAVBAR ══════════ */}
          <nav
            className={loaded ? 'nav-animate' : ''}
            style={{ ...S.nav, opacity: loaded ? undefined : 0 }}
          >
            <div style={S.navInner}>
              {/* Logo */}
              <div style={S.logoWrap}>
                <LogoIcon className="logo-float" />
                <span style={S.logoText}>{navData.logo_text}</span>
              </div>

              {/* Desktop nav links */}
              {!isMobile && (
                <div style={S.navLinks}>
                  {navData.nav_items.map((item, i) => (
                    <a
                      key={item.href + i}
                      href={item.href}
                      className="nav-link-wrap"
                      style={item.href === '/about' ? S.navLinkActive : S.navLink}
                      onMouseEnter={e => {
                        if (item.href !== '/about')
                          (e.currentTarget as HTMLElement).style.color = tokens.color.gold;
                      }}
                      onMouseLeave={e => {
                        if (item.href !== '/about')
                          (e.currentTarget as HTMLElement).style.color = tokens.color.white;
                      }}
                    >
                      {item.href === '/about' ? `[ ${item.label} ]` : item.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Desktop contact btn */}
              {!isMobile && (
                <a href={navData.contact_btn_link} className="contact-btn-wrap" style={S.contactBtn}>
                  {navData.contact_btn_text}
                </a>
              )}

              {/* Mobile hamburger */}
              {isMobile && (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                  style={{
                    background: 'none', border: 'none',
                    color:      tokens.color.white, cursor: 'pointer',
                    padding:    '0.5rem', display: 'flex',
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
                      )}
                  </svg>
                </button>
              )}
            </div>

            {/* Mobile menu */}
            {isMobile && menuOpen && (
              <div style={{ ...S.mobileMenu, animation: 'fadeInDown 0.3s ease both' }}>
                {navData.nav_items.map((item, i) => (
                  <a
                    key={item.href + i}
                    href={item.href}
                    style={item.href === '/about' ? S.mobileNavLinkActive : S.mobileNavLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.href === '/about' ? `[ ${item.label} ]` : item.label}
                  </a>
                ))}
                <a
                  href={navData.contact_btn_link}
                  style={S.mobileContact}
                  onClick={() => setMenuOpen(false)}
                >
                  {navData.contact_btn_text}
                </a>
              </div>
            )}
          </nav>

          {/* ══════════ HERO — OUR STORY ══════════ */}
          <section
            ref={heroRef}
            className="hero-grid"
            style={{
              display:             'grid',
              gridTemplateColumns: '1fr 1fr',
              gap:                 'clamp(2rem, 5vw, 4rem)',
              padding:             'clamp(3rem, 8vh, 6rem) clamp(1.5rem, 5vw, 5rem)',
              alignItems:          'center',
              minHeight:           '80vh',
            }}
          >
            {/* LEFT — mosaic */}
            <div
              className={heroVisible ? 'reveal-left' : ''}
              style={{ opacity: heroVisible ? 1 : 0, animationDelay: '0.2s' }}
            >
              {!isMobileHero
                ? <StoryMosaic visible={heroVisible} desktop={true}  />
                : <StoryMosaic visible={heroVisible} desktop={false} />
              }
            </div>

            {/* RIGHT — text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vh, 1.75rem)' }}>
              <p
                className={heroVisible ? 'reveal-right' : ''}
                style={{
                  color:          tokens.color.gold,
                  fontSize:       tokens.font.sectionEyebrow,
                  fontWeight:     600,
                  margin:         0,
                  opacity:        heroVisible ? 1 : 0,
                  animationDelay: '0.3s',
                }}
              >
                {aboutData.hero_eyebrow}
              </p>
              <h1
                className={heroVisible ? 'reveal-right' : ''}
                style={{
                  fontSize:       tokens.font.sectionTitle,
                  fontWeight:     600,
                  lineHeight:     1.2,
                  margin:         0,
                  opacity:        heroVisible ? 1 : 0,
                  animationDelay: '0.45s',
                }}
              >
                {aboutData.hero_heading}
              </h1>
              <p
                className={heroVisible ? 'reveal-right' : ''}
                style={{
                  fontSize:       tokens.font.body,
                  fontWeight:     400,
                  lineHeight:     1.7,
                  color:          tokens.color.whiteMuted,
                  margin:         0,
                  maxWidth:       '480px',
                  opacity:        heroVisible ? 1 : 0,
                  animationDelay: '0.6s',
                }}
              >
                {aboutData.hero_body}
              </p>
            </div>
          </section>

          <Divider />

          {/* ══════════ MEET THE VISIONARIES ══════════ */}
          <section ref={teamRef} style={{ padding: 'clamp(3rem, 8vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
            <h2
              className={teamVisible ? 'reveal-up' : ''}
              style={{
                color:          tokens.color.gold,
                fontSize:       tokens.font.sectionTitle,
                fontWeight:     500,
                textAlign:      'center',
                marginBottom:   'clamp(2rem, 5vh, 3.5rem)',
                opacity:        teamVisible ? 1 : 0,
                animationDelay: '0.1s',
              }}
            >
              {aboutData.team_section_title}
            </h2>

            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 560px), 1fr))',
              gap:                 '2rem',
            }}>
              {/* ── CHANGE 2: slice to first 2 unless showAllStaff is true ── */}
              {(showAllStaff ? aboutData.staff : aboutData.staff.slice(0, 2)).map((member, idx) => (
                <div
                  key={member.name + idx}
                  className={`staff-card ${teamVisible ? (idx % 2 === 0 ? 'reveal-left' : 'reveal-right') : ''}`}
                  style={{
                    display:        'flex',
                    borderRadius:   tokens.radius.card,
                    overflow:       'hidden',
                    background:     tokens.color.cardBg,
                    transition:     'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                    opacity:        teamVisible ? 1 : 0,
                    animationDelay: `${0.2 + idx * 0.15}s`,
                  }}
                >
                  <div style={{ width: '42%', flexShrink: 0, position: 'relative', minHeight: '480px' }}>
                    <Image
                      src={STAFF_IMAGES[idx] || STAFF_IMAGES[0]}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{
                    padding:       'clamp(1.25rem, 3vw, 2rem)',
                    display:       'flex',
                    flexDirection: 'column',
                    gap:           '0.75rem',
                    flex:          1,
                  }}>
                    <h3 style={{ color: tokens.color.gold, fontSize: tokens.font.cardName, fontWeight: 500, margin: 0 }}>
                      {member.name}
                    </h3>
                    <p style={{ fontSize: tokens.font.body, fontWeight: 300, color: tokens.color.whiteMuted, margin: 0 }}>
                      {member.role}
                    </p>
                    <p style={{ fontSize: tokens.font.body, fontWeight: 300, lineHeight: 1.7, color: tokens.color.whiteMuted, margin: 0 }}>
                      {member.bio}
                    </p>
                    <div style={{ height: '1px', background: tokens.color.whiteBorder }} />
                    <p style={{ fontSize: '0.8rem', color: tokens.color.whiteDim, margin: 0, fontWeight: 300 }}>
                      <span style={{ fontWeight: 500 }}>Specialties:</span> {member.specialties}
                    </p>
                    <div style={{ height: '1px', background: tokens.color.whiteBorder }} />
                    <p style={{ fontSize: tokens.font.body, margin: 0, fontWeight: 300 }}>
                      Experience:{' '}
                      <span style={{ color: tokens.color.gold, fontSize: '1.25rem', fontWeight: 700 }}>
                        {member.experience}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── CHANGE 3: Conditional VIEW ALL button ── */}
            {!showAllStaff && aboutData.staff.length > 2 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(2rem, 4vh, 3rem)' }}>
                <button
                  onClick={() => setShowAllStaff(true)}
                  style={{
                    display:     'inline-block',
                    border:      `1px solid ${tokens.color.white}`,
                    borderRadius: '2rem',
                    padding:     '0.625rem 3rem',
                    color:       tokens.color.white,
                    fontSize:    '1.125rem',
                    fontWeight:  300,
                    background:  'transparent',
                    cursor:      'pointer',
                    transition:  'all 0.3s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background  = tokens.color.gold;
                    el.style.borderColor = tokens.color.gold;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background  = 'transparent';
                    el.style.borderColor = tokens.color.white;
                  }}
                >
                  VIEW ALL
                </button>
              </div>
            )}
          </section>

          <Divider />

          {/* ══════════ GALLERY ══════════ */}
          <section ref={galleryRef} style={{ padding: 'clamp(3rem, 8vh, 5rem) clamp(1.5rem, 5vw, 5rem)' }}>
            <h2
              className={galleryVisible ? 'reveal-up' : ''}
              style={{
                color:          tokens.color.gold,
                fontSize:       tokens.font.sectionTitle,
                fontWeight:     500,
                textAlign:      'center',
                marginBottom:   'clamp(2rem, 5vh, 3.5rem)',
                opacity:        galleryVisible ? 1 : 0,
                animationDelay: '0.1s',
              }}
            >
              {aboutData.gallery_section_title}
            </h2>

            {/* ── Desktop Gallery ── */}
            {!isMobileGallery && (
              <div style={{
                display:             'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap:                 '1.25rem',
                alignItems:          'stretch',
              }}>
                {/* Col 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <GalleryTextCard
                    visible={galleryVisible} delay="0.2s" minHeight="220px"
                    className={galleryVisible ? 'reveal-left' : ''}
                    description={aboutData.gallery_description}
                  />
                  <GalleryFeaturedImage
                    src={GALLERY.img5} height="380px" sizes="33vw"
                    visible={galleryVisible} delay="0.32s"
                    className={galleryVisible ? 'reveal-up' : ''}
                  />
                </div>

                {/* Col 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div
                    className={`gallery-img ${galleryVisible ? 'reveal-up' : ''}`}
                    style={{
                      position:       'relative',
                      borderRadius:   tokens.radius.gallery,
                      overflow:       'hidden',
                      height:         '195px',
                      transition:     'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                      opacity:        galleryVisible ? 1 : 0,
                      animationDelay: '0.25s',
                    }}
                  >
                    <Image src={GALLERY.img2} alt="Hair tools" fill sizes="33vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div
                    className={`gallery-img ${galleryVisible ? 'reveal-up' : ''}`}
                    style={{
                      position:       'relative',
                      borderRadius:   tokens.radius.gallery,
                      overflow:       'hidden',
                      height:         '230px',
                      transition:     'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                      opacity:        galleryVisible ? 1 : 0,
                      animationDelay: '0.35s',
                    }}
                  >
                    <Image src={GALLERY.img3} alt="Hair styling" fill sizes="33vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{
                    position: 'relative', borderRadius: tokens.radius.gallery,
                    overflow: 'hidden', flex: 1, minHeight: '180px',
                  }}>
                    <Image src={GALLERY.img4} alt="Salon interior" fill sizes="33vw" style={{ objectFit: 'cover' }} />
                    <div style={{
                      position:       'absolute', inset: 0,
                      background:     'rgba(0,0,0,0.45)',
                      display:        'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <a
                        href="/gallery"
                        style={{
                          background:     tokens.color.goldAlpha,
                          borderRadius:   tokens.radius.card,
                          padding:        '0.875rem 2.5rem',
                          fontSize:       'clamp(0.9rem, 1.8vw, 1.4rem)',
                          fontWeight:     700,
                          color:          'rgba(255,255,255,0.9)',
                          textDecoration: 'none',
                          transition:     'background 0.3s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = tokens.color.gold; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = tokens.color.goldAlpha; }}
                      >
                        OUR GALLERY
                      </a>
                    </div>
                  </div>
                </div>

                {/* Col 3 */}
                <div
                  className={`gallery-img ${galleryVisible ? 'reveal-up' : ''}`}
                  style={{
                    position:       'relative',
                    borderRadius:   tokens.radius.gallery,
                    overflow:       'hidden',
                    minHeight:      '640px',
                    transition:     'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                    opacity:        galleryVisible ? 1 : 0,
                    animationDelay: '0.3s',
                  }}
                >
                  <Image src={GALLERY.img1} alt="Barber styling" fill sizes="33vw" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            )}

            {/* ── Mobile Gallery ── */}
            {isMobileGallery && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <GalleryTextCard
                  visible={galleryVisible} delay="0.1s" minHeight="auto"
                  className={galleryVisible ? 'reveal-up' : ''}
                  description={aboutData.gallery_description}
                />
                <GalleryFeaturedImage
                  src={GALLERY.img5} height="340px" sizes="100vw"
                  visible={galleryVisible} delay="0.2s"
                  className={galleryVisible ? 'reveal-up' : ''}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div
                    className={`mobile-gallery-img ${galleryVisible ? 'reveal-up' : ''}`}
                    style={{
                      position:       'relative', borderRadius: tokens.radius.gallery,
                      overflow:       'hidden', height: '190px',
                      opacity:        galleryVisible ? 1 : 0, animationDelay: '0.3s',
                    }}
                  >
                    <Image src={GALLERY.img1} alt="Barber styling" fill sizes="50vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div
                    className={`mobile-gallery-img ${galleryVisible ? 'reveal-up' : ''}`}
                    style={{
                      position:       'relative', borderRadius: tokens.radius.gallery,
                      overflow:       'hidden', height: '190px',
                      opacity:        galleryVisible ? 1 : 0, animationDelay: '0.38s',
                    }}
                  >
                    <Image src={GALLERY.img2} alt="Hair tools" fill sizes="50vw" style={{ objectFit: 'cover' }} />
                  </div>
                </div>
                <div
                  className={`mobile-gallery-img ${galleryVisible ? 'reveal-up' : ''}`}
                  style={{
                    position:       'relative', borderRadius: tokens.radius.gallery,
                    overflow:       'hidden', height: '210px',
                    opacity:        galleryVisible ? 1 : 0, animationDelay: '0.46s',
                  }}
                >
                  <Image src={GALLERY.img3} alt="Hair styling" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(184,134,11,0.2))' }} />
                </div>
                <div
                  className={`mobile-gallery-img ${galleryVisible ? 'reveal-up' : ''}`}
                  style={{
                    position:       'relative', borderRadius: tokens.radius.gallery,
                    overflow:       'hidden', height: '200px',
                    opacity:        galleryVisible ? 1 : 0, animationDelay: '0.54s',
                  }}
                >
                  <Image src={GALLERY.img4} alt="Salon interior" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 100%)' }} />
                  <div style={{
                    position:      'absolute', inset: 0,
                    display:       'flex', flexDirection: 'column',
                    alignItems:    'center', justifyContent: 'center',
                    gap:           '0.875rem', padding: '1.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <div style={{ width: '2rem', height: '1px', background: tokens.color.gold }} />
                      <span style={{ color: tokens.color.whiteMuted, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        See all our work
                      </span>
                      <div style={{ width: '2rem', height: '1px', background: tokens.color.gold }} />
                    </div>
                    <a
                      href="#"
                      style={{
                        background:     tokens.color.gold,
                        borderRadius:   '9999px',
                        padding:        '0.75rem 2.25rem',
                        fontSize:       '0.9375rem',
                        fontWeight:     700,
                        color:          tokens.color.white,
                        textDecoration: 'none',
                        letterSpacing:  '0.08em',
                        transition:     'transform 0.25s, box-shadow 0.25s',
                        boxShadow:      '0 4px 20px rgba(184,134,11,0.4)',
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = 'scale(1.05)';
                        el.style.boxShadow = '0 6px 28px rgba(184,134,11,0.6)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = 'scale(1)';
                        el.style.boxShadow = '0 4px 20px rgba(184,134,11,0.4)';
                      }}
                    >
                      OUR GALLERY
                    </a>
                  </div>
                </div>
              </div>
            )}
          </section>

          <Divider />

          {/* ══════════ REVIEWS ══════════ */}
          <section
            ref={reviewRef}
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding:  'clamp(4rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
              <Image src={REVIEW_BG} alt="Reviews background" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.70)' }} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2
                className={reviewVisible ? 'reveal-up' : ''}
                style={{
                  color:          tokens.color.gold,
                  fontSize:       tokens.font.sectionTitle,
                  fontWeight:     500,
                  textAlign:      'center',
                  marginBottom:   'clamp(2rem, 5vh, 3.5rem)',
                  opacity:        reviewVisible ? 1 : 0,
                  animationDelay: '0.1s',
                }}
              >
                {aboutData.review_section_title}
              </h2>
              <div
                className={reviewVisible ? 'reveal-up' : ''}
                style={{
                  maxWidth:       '800px',
                  margin:         '0 auto',
                  textAlign:      'center',
                  opacity:        reviewVisible ? 1 : 0,
                  animationDelay: '0.25s',
                }}
              >
                <p style={{
                  fontSize:   'clamp(1rem, 2.2vw, 1.3rem)',
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color:      tokens.color.white,
                  margin:     '0 0 1.5rem',
                }}>
                  {aboutData.reviews[activeReview]?.quote}
                </p>
                <p style={{ color: tokens.color.gold, fontWeight: 600, fontSize: '1rem', margin: 0 }}>
                  — {aboutData.reviews[activeReview]?.author}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
                {aboutData.reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveReview(i)}
                    aria-label={`Review ${i + 1}`}
                    className="review-dot"
                    style={{
                      width:        '2rem',
                      height:       '2rem',
                      borderRadius: tokens.radius.dot,
                      background:   i === activeReview
                        ? 'rgba(255,255,255,0.90)'
                        : 'rgba(255,255,255,0.30)',
                      border:  'none',
                      cursor:  'pointer',
                    }}
                  />
                ))}
              </div>
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

              {/* ── Brand ── */}
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
                  {footerData.brand_name}
                </h2>
                <p style={{
                  color:      tokens.color.whiteMuted,
                  fontSize:   tokens.font.tagline,
                  lineHeight: 1.6,
                  margin:     0,
                  maxWidth:   '260px',
                }}>
                  {footerData.brand_tagline}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  {[
                    { label: 'WhatsApp',  Icon: IconWhatsApp,  href: footerData.social_whatsapp  || '#' },
                    { label: 'Facebook',  Icon: IconFacebook,  href: footerData.social_facebook  || '#' },
                    { label: 'Instagram', Icon: IconInstagram, href: footerData.social_instagram || '#' },
                  ].map(({ label, Icon, href }, i) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
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

              {/* ── Quick Links ── */}
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
                  color:          tokens.color.gold,
                  fontSize:       tokens.font.label,
                  fontWeight:     600,
                  letterSpacing:  '0.15em',
                  textTransform:  'uppercase',
                  margin:         0,
                }}>
                  Quick Links
                </p>
                {footerData.quick_links.map((link, i) => (
                  <a
                    key={link.label + i}
                    href={link.href}
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
                    {link.label}
                  </a>
                ))}
              </div>

              {/* ── Locations ── */}
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
                  textTransform: 'uppercase',
                  margin:        0,
                }}>
                  Our Locations
                </p>
                {footerData.locations.map((loc, i) => (
                  <div
                    key={loc + i}
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
                    }}>
                      {loc}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Contact ── */}
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
                  textTransform: 'uppercase',
                  margin:        0,
                }}>
                  Contact Us
                </p>
                {[
                  { Icon: IconPhone,    text: footerData.contact_phone   },
                  { Icon: IconMail,     text: footerData.contact_email   },
                  { Icon: IconLocation, text: footerData.contact_address },
                ].map(({ Icon, text }, i) => (
                  <div
                    key={text + i}
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
                {footerData.copyright_text}
              </p>
            </div>
          </footer>

        </div>
      </main>
    </>
  );
}