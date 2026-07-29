'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/* ─────────────────────────────────────────
   DESIGN TOKENS (SAYO LUXURY THEME)
───────────────────────────────────────── */
const tokens = {
  color: {
    gold:        '#B8860B',
    goldAlpha:   'rgba(184,134,11,0.69)',
    goldLight:   'rgba(184,134,11,0.15)',
    goldBorder:  'rgba(184,134,11,0.4)',
    bgDark:      '#0a0a0c',
    bgCard:      '#141418',
    bgCardHover: '#1c1c22',
    bgInput:     '#0e0e12',
    white:       '#ffffff',
    whiteMuted:  'rgba(255,255,255,0.80)',
    whiteDim:    'rgba(255,255,255,0.60)',
    whiteFaint:  'rgba(255,255,255,0.30)',
    whiteBorder: 'rgba(255,255,255,0.12)',
    danger:      '#e53e3e',
    success:     '#38a169',
  },
  font: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
} as const;

/* ─────────────────────────────────────────
   🔐 ADMIN LOGIN CREDENTIALS
   (Change these to your own secure values)
───────────────────────────────────────── */
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'sayo@2025',
};

const AUTH_SESSION_KEY = 'sayo_admin_auth_session';

/* ─────────────────────────────────────────
   TYPES & DEFAULT DATA
───────────────────────────────────────── */
export type NavItem = {
  label: string;
  href: string;
};

export type QuickLink = {
  label: string;
  href: string;
};

export type HomeData = {
  logoText: string;
  navItems: NavItem[];
  contactButtonText: string;
  contactButtonLink: string;
  heroEyebrow: string;
  heroHeading: string;
  heroBody: string;
  heroCtaText: string;
  heroCtaLink: string;
};

export type GeneralData = {
  brandName: string;
  brandTagline: string;
  quickLinks: QuickLink[];
  locations: string[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  copyrightText: string;
  socialLinks: {
    whatsapp: string;
    facebook: string;
    instagram: string;
  };
};

export type GenderOption = {
  key: string;
  label: string;
};

export type CategoryItem = {
  key: string;
  label: string;
  image: string;
};

export type PriceItem = {
  name: string;
  price1: string;
  price2?: string;
};

export type ServicesData = {
  heroTitle: string;
  heroSubtitle: string;
  sectionIntro: string;
  genderOptions: GenderOption[];
  categories: CategoryItem[];
  priceList: {
    her: Record<string, PriceItem[]>;
    his: Record<string, PriceItem[]>;
  };
};

export type ReviewItem = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  service: string;
  comment: string;
  location: string;
};

export type ReviewsData = {
  heroEyebrow: string;
  heroTitleStart: string;
  heroTitleGold: string;
  heroSubtitle: string;
  reviews: ReviewItem[];
};

/* ── ABOUT PAGE TYPES ── */
export type StaffMember = {
  id: number;
  name: string;
  role: string;
  experience: string;
  image: string;
  bio: string;
  specialties: string;
};

export type AboutReview = {
  quote: string;
  author: string;
};

export type GalleryImages = {
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5: string;
};

export type AboutData = {
  heroEyebrow: string;
  heroHeading: string;
  heroBody: string;
  teamSectionTitle: string;
  gallerySectionTitle: string;
  galleryDescription: string;
  reviewSectionTitle: string;
  gallery: GalleryImages;
  staff: StaffMember[];
  reviews: AboutReview[];
};

export type SayoSiteData = {
  home: HomeData;
  general: GeneralData;
  services: ServicesData;
  reviews: ReviewsData;
  about: AboutData;
};

const DEFAULT_ABOUT_DATA: AboutData = {
  heroEyebrow: 'OUR STORY',
  heroHeading: 'We are experience in making you more beautiful',
  heroBody: 'We will make your skin better and also more glowing skin. And we provide to treatment spa and face with best service our employees,',
  teamSectionTitle: 'Meet the Visionaries',
  gallerySectionTitle: 'Transformations & Artistry',
  galleryDescription: 'Explore our latest work, behind-the-scenes moments, and client transformations. From timeless Sri Lankan bridal looks to sleek modern cuts — see how we bring beauty to life.',
  reviewSectionTitle: 'What Our Clients Say',
  gallery: {
    img1: '/Rectangle 32.jpg',
    img2: '/Rectangle 33.jpg',
    img3: '/Rectangle 34.jpg',
    img4: '/Rectangle 36.jpg',
    img5: '/Rectangle 35.jpg',
  },
  staff: [
    {
      id: 1,
      name: 'Hiruni Perera',
      role: 'Lead Stylist & Founder',
      experience: '12+ Years',
      image: '/staff-hiruni.jpg',
      bio: 'Train-certified in London and Singapore, Hiruni founded the salon with a vision to revolutionize modern hair styling in Sri Lanka. Known for signature balayage techniques and tailored consultations, she ensures every client leaves with a look that flatters their unique features.',
      specialties: 'Precision Haircuts, Balayage & Highlights, Advanced Hair Treatments',
    },
    {
      id: 2,
      name: 'Aruna Ratnayake',
      role: 'Grooming Specialist',
      experience: '10+ Years',
      image: '/staff-aruna.jpg',
      bio: "Bringing a sharp eye for detail and modern barbering techniques, Aruna specializes in tailored men's styling and beard architecture. From crisp fade cuts and traditional hot-towel shaves to complete pre-wedding grooming sessions for grooms and groomsmen.",
      specialties: "Precision Beard Sculpting, Classic & Modern Men's Haircuts, Groom's Styling Package",
    },
  ],
  reviews: [
    {
      quote: '"Choosing SAYO for my Kandyan bridal dressing was the best decision I made. The artist listened to every detail, and my saree draping and makeup stayed flawless through the hot humidity from morning to night."',
      author: 'Nimesha D.',
    },
    {
      quote: '"I\'ve tried many salons across Colombo, but SAYO stands apart. The balayage Hiruni did for me was absolutely stunning — I\'ve never had so many compliments on my hair!"',
      author: 'Sanduni R.',
    },
    {
      quote: '"Aruna\'s attention to detail with my beard and fade was exceptional. Worth every rupee. I\'ll never go anywhere else for my grooming."',
      author: 'Kasun P.',
    },
    {
      quote: '"From the moment you walk in, you feel looked after. The team is professional, warm, and genuinely talented. My go-to salon for every occasion."',
      author: 'Dilani W.',
    },
  ],
};

const DEFAULT_SITE_DATA: SayoSiteData = {
  home: {
    logoText: 'SAYO',
    navItems: [
      { label: 'HOME',       href: '/' },
      { label: 'OUR STORY',  href: '/about' },
      { label: 'SERVICES',   href: '/services' },
      { label: 'PRODUCTS',   href: '/products' },
      { label: 'REVIEWS',    href: '/reviews' },
    ],
    contactButtonText: 'CONTACT US',
    contactButtonLink: '/contact',
    heroEyebrow: 'Experienced hair stylists',
    heroHeading: 'Enjoy Professional Beauty Services!',
    heroBody: 'Providing expert skin care advice & beauty services using natural products to cater for any skin.',
    heroCtaText: 'Reserve Experience',
    heroCtaLink: '/contact',
  },
  general: {
    brandName: 'SAYO',
    brandTagline: 'We are experienced in making you more beautiful',
    quickLinks: [
      { label: 'Home',      href: '/' },
      { label: 'Our Story', href: '/about' },
      { label: 'Services',  href: '/services' },
      { label: 'Products',  href: '/products' },
      { label: 'Reviews',   href: '/reviews' },
    ],
    locations: ['Colombo', 'Negombo', 'Kiribathgoda'],
    contactPhone: '+94 77 233 6233',
    contactEmail: 'hello@sayobeauty.com',
    contactAddress: '123 Galle Road, Colombo, Sri Lanka',
    copyrightText: '© 2025 SAYO Beauty. All rights reserved.',
    socialLinks: {
      whatsapp:  'https://wa.me/94772336233',
      facebook:  'https://facebook.com/sayobeauty',
      instagram: 'https://instagram.com/sayobeauty',
    },
  },
  services: {
    heroTitle: 'Tailored Treatments for Your Unique Glow',
    heroSubtitle: 'Experience a symphony of precision and luxury.\nOur services are tailored to the individual, utilizing the world\'s most exclusive botanical formulas and advanced styling techniques.',
    sectionIntro: 'Select a category below to explore our tailored treatments, pricing, and specialized artists.',
    genderOptions: [
      { key: 'her', label: 'Her Sanctuary' },
      { key: 'his', label: 'His Retreat' },
    ],
    categories: [
      { key: 'WAX',    label: 'WAX',    image: 'https://placehold.co/487x582?text=Wax'    },
      { key: 'HAIR',   label: 'HAIR',   image: 'https://placehold.co/487x582?text=Hair'   },
      { key: 'SKIN',   label: 'SKIN',   image: 'https://placehold.co/487x582?text=Skin'   },
      { key: 'NAIL',   label: 'NAIL',   image: 'https://placehold.co/487x582?text=Nail'   },
      { key: 'BODY',   label: 'BODY',   image: 'https://placehold.co/487x582?text=Body'   },
      { key: 'BRIDAL', label: 'BRIDAL', image: 'https://placehold.co/487x582?text=Bridal' },
    ],
    priceList: {
      her: {
        WAX: [
          { name: 'Full Arms Wax',     price1: '2,500.00' },
          { name: 'Full Legs Wax',     price1: '3,500.00' },
          { name: 'Underarm Wax',      price1: '1,200.00' },
          { name: 'Eyebrow Threading', price1: '800.00' },
          { name: 'Full Body Wax',     price1: '7,500.00', price2: '6,800.00' },
        ],
        HAIR: [
          { name: 'Cut & Re-Style (Advance)', price1: '4,200.00', price2: '3,600.00' },
          { name: 'Fringe Cut',               price1: '1,500.00' },
          { name: 'Trim',                     price1: '1,500.00' },
          { name: 'Blow Dry - Short',         price1: '2,500.00', price2: '2,200.00' },
          { name: 'Hair Wash & Blast Dry',    price1: '2,100.00', price2: '1,800.00' },
        ],
        SKIN: [
          { name: 'Classic Facial',    price1: '3,000.00' },
          { name: 'Gold Facial',       price1: '6,500.00' },
          { name: 'Skin Brightening',  price1: '5,200.00' },
          { name: 'Acne Treatment',    price1: '4,800.00' },
          { name: 'Anti-Aging Facial', price1: '7,200.00', price2: '6,500.00' },
        ],
        NAIL: [
          { name: 'Classic Manicure',   price1: '1,800.00' },
          { name: 'Gel Manicure',       price1: '3,200.00' },
          { name: 'Classic Pedicure',   price1: '2,200.00' },
          { name: 'Gel Pedicure',       price1: '3,800.00' },
          { name: 'Nail Art (Per Set)', price1: '1,500.00' },
        ],
        BODY: [
          { name: 'Full Body Massage',    price1: '5,500.00' },
          { name: 'Body Scrub',           price1: '4,200.00' },
          { name: 'Body Wrap',            price1: '6,000.00' },
          { name: 'Aromatherapy Massage', price1: '6,800.00', price2: '5,900.00' },
          { name: 'Hot Stone Massage',    price1: '7,500.00' },
        ],
        BRIDAL: [
          { name: 'Bridal Package - Full', price1: '45,000.00' },
          { name: 'Bridal Hair & Makeup',  price1: '18,000.00' },
          { name: 'Pre-Bridal Package',    price1: '22,000.00' },
          { name: 'Trial Makeup',          price1: '6,500.00' },
          { name: 'Bridal Draping',        price1: '5,000.00' },
        ],
      },
      his: {
        WAX: [
          { name: 'Half Arms Wax', price1: '2,000.00' },
          { name: 'Chest Wax',     price1: '3,200.00' },
          { name: 'Back Wax',      price1: '3,600.00' },
          { name: 'Full Legs Wax', price1: '4,000.00' },
          { name: 'Beard Shaping', price1: '1,000.00' },
        ],
        HAIR: [
          { name: 'Haircut - Classic', price1: '1,800.00' },
          { name: 'Beard Trim',        price1: '900.00' },
          { name: 'Hair Wash',         price1: '700.00' },
          { name: 'Head Massage',      price1: '1,500.00', price2: '1,200.00' },
          { name: 'Hair Color',        price1: '3,500.00' },
        ],
        SKIN: [
          { name: 'Deep Cleansing Facial', price1: '3,500.00' },
          { name: 'Skin Polishing',        price1: '4,000.00' },
          { name: 'Beard Care Facial',     price1: '3,200.00' },
          { name: 'Whitening Facial',      price1: '4,800.00' },
          { name: 'Detox Facial',          price1: '5,500.00', price2: '4,900.00' },
        ],
        NAIL: [
          { name: 'Basic Manicure',   price1: '1,200.00' },
          { name: 'Basic Pedicure',   price1: '1,500.00' },
          { name: 'Nail Trim & Buff', price1: '800.00' },
          { name: 'Callus Removal',   price1: '1,000.00' },
          { name: 'Hand Spa',         price1: '2,200.00' },
        ],
        BODY: [
          { name: 'Deep Tissue Massage',     price1: '6,000.00' },
          { name: 'Body Scrub',              price1: '4,000.00' },
          { name: 'Sports Massage',          price1: '6,500.00' },
          { name: 'Back Massage',            price1: '3,500.00' },
          { name: 'Head & Shoulder Massage', price1: '2,800.00' },
        ],
        BRIDAL: [
          { name: 'Groom Package',       price1: '25,000.00' },
          { name: 'Groom Hair & Makeup', price1: '10,000.00' },
          { name: 'Pre-Groom Package',   price1: '14,000.00' },
          { name: 'Groom Facial',        price1: '4,500.00' },
          { name: 'Groom Grooming',      price1: '3,500.00' },
        ],
      },
    },
  },
  reviews: {
    heroEyebrow: 'Client Stories',
    heroTitleStart: 'What Our Clients',
    heroTitleGold: 'Say About Us',
    heroSubtitle: 'Real experiences from real clients. Discover why SAYO is Sri Lanka\'s most trusted luxury beauty destination.',
    reviews: [
      { id: 1, name: 'Anika Perera',          avatar: 'AP', rating: 5, date: '2024-12-15', service: 'Bridal Package',         comment: 'Absolutely stunning experience! The team made me feel like royalty on my wedding day.', location: 'Colombo'      },
      { id: 2, name: 'Dilshan Fernando',       avatar: 'DF', rating: 5, date: '2024-12-08', service: 'Hair & Grooming',        comment: 'Came in for a haircut and beard trim. The stylist really listened to what I wanted.',  location: 'Negombo'      },
      { id: 3, name: 'Shalini Jayawardena',    avatar: 'SJ', rating: 5, date: '2024-11-29', service: 'Gold Facial',            comment: 'My skin has never felt this smooth! The gold facial treatment was pure indulgence.',    location: 'Colombo'      },
      { id: 4, name: 'Rohan Wickramasinghe',   avatar: 'RW', rating: 4, date: '2024-11-20', service: 'Deep Tissue Massage',    comment: 'Great massage therapy session. The therapist was skilled and addressed all problem areas.', location: 'Kiribathgoda' },
      { id: 5, name: 'Priya Kumari',           avatar: 'PK', rating: 5, date: '2024-11-10', service: 'Gel Manicure & Pedicure',comment: 'The nail art they created was exactly what I had in mind! Super talented nail technicians.', location: 'Colombo'      },
    ],
  },
  about: DEFAULT_ABOUT_DATA,
};

/* ─────────────────────────────────────────
   SAFE MERGE HELPER
───────────────────────────────────────── */
function mergeSiteData(saved: any): SayoSiteData {
  const safe = saved && typeof saved === 'object' ? saved : {};

  return {
    home: {
      ...DEFAULT_SITE_DATA.home,
      ...(safe.home || {}),
      navItems: Array.isArray(safe.home?.navItems) && safe.home.navItems.length > 0
        ? safe.home.navItems
        : DEFAULT_SITE_DATA.home.navItems,
    },
    general: {
      ...DEFAULT_SITE_DATA.general,
      ...(safe.general || {}),
      quickLinks: Array.isArray(safe.general?.quickLinks) && safe.general.quickLinks.length > 0
        ? safe.general.quickLinks
        : DEFAULT_SITE_DATA.general.quickLinks,
      locations: Array.isArray(safe.general?.locations) && safe.general.locations.length > 0
        ? safe.general.locations
        : DEFAULT_SITE_DATA.general.locations,
      socialLinks: {
        ...DEFAULT_SITE_DATA.general.socialLinks,
        ...(safe.general?.socialLinks || {}),
      },
    },
    services: {
      ...DEFAULT_SITE_DATA.services,
      ...(safe.services || {}),
      genderOptions: Array.isArray(safe.services?.genderOptions) && safe.services.genderOptions.length > 0
        ? safe.services.genderOptions
        : DEFAULT_SITE_DATA.services.genderOptions,
      categories: Array.isArray(safe.services?.categories) && safe.services.categories.length > 0
        ? safe.services.categories
        : DEFAULT_SITE_DATA.services.categories,
      priceList: {
        her: { ...DEFAULT_SITE_DATA.services.priceList.her, ...(safe.services?.priceList?.her || {}) },
        his: { ...DEFAULT_SITE_DATA.services.priceList.his, ...(safe.services?.priceList?.his || {}) },
      },
    },
    reviews: {
      ...DEFAULT_SITE_DATA.reviews,
      ...(safe.reviews || {}),
      reviews: Array.isArray(safe.reviews?.reviews) && safe.reviews.reviews.length > 0
        ? safe.reviews.reviews
        : DEFAULT_SITE_DATA.reviews.reviews,
    },
    about: {
      ...DEFAULT_ABOUT_DATA,
      ...(safe.about || {}),
      gallery: { ...DEFAULT_ABOUT_DATA.gallery, ...(safe.about?.gallery || {}) },
      staff: Array.isArray(safe.about?.staff) && safe.about.staff.length > 0
        ? safe.about.staff
        : DEFAULT_ABOUT_DATA.staff,
      reviews: Array.isArray(safe.about?.reviews) && safe.about.reviews.length > 0
        ? safe.about.reviews
        : DEFAULT_ABOUT_DATA.reviews,
    },
  };
}

/* ─────────────────────────────────────────
   ICONS / UI HELPERS
───────────────────────────────────────── */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? '#B8860B' : 'none'} stroke="#B8860B" strokeWidth="1.8">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const GENDER_ICON_MAP: Record<string, string> = { her: '🌸', his: '🤵' };

/* ─────────────────────────────────────────
   COMMON STYLES
───────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: tokens.color.bgInput,
  border: `1px solid ${tokens.color.whiteBorder}`,
  color: tokens.color.white,
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

const smallIconBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  color: '#fff',
  border: `1px solid ${tokens.color.whiteBorder}`,
  borderRadius: '0.4rem',
  padding: '0.3rem 0.5rem',
  fontSize: '0.75rem',
};

const sectionCard: React.CSSProperties = {
  background: tokens.color.bgCard,
  border: `1px solid ${tokens.color.whiteBorder}`,
  borderRadius: '1.25rem',
  padding: '2rem',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: tokens.color.gold,
  marginBottom: '0.4rem',
  marginTop: 0,
};

const sectionDesc: React.CSSProperties = {
  color: tokens.color.whiteDim,
  fontSize: '0.85rem',
  marginBottom: '1.5rem',
  marginTop: 0,
};

const fieldLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: tokens.color.whiteMuted,
  marginBottom: '0.4rem',
};

/* ─────────────────────────────────────────
   🖼️ SAYO LOGO ICON COMPONENT
   (Uses /public/sayologo.png — no background box)
───────────────────────────────────────── */
function AdminLogoIcon({ size = 42 }: { size?: number }) {
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Image
        src="/sayologo.png"
        alt="SAYO Logo"
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        priority
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   🔐 LOGIN SCREEN COMPONENT
───────────────────────────────────────── */
function AdminLoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      triggerShake();
      return;
    }

    setLoading(true);

    // Simulate a tiny delay for a nicer UX (feels like real auth check)
    setTimeout(() => {
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        try {
          sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        } catch (err) {
          console.warn('Could not persist session.', err);
        }
        setLoading(false);
        onLoginSuccess();
      } else {
        setLoading(false);
        setError('Invalid username or password. Please try again.');
        triggerShake();
      }
    }, 500);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: tokens.color.bgDark,
      backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(184,134,11,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(184,134,11,0.06) 0%, transparent 50%)',
      color: tokens.color.white,
      fontFamily: tokens.font.family,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <style>{`
        @keyframes shakeAnim {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes fadeUpLogin {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-shake { animation: shakeAnim 0.5s ease; }
        .login-card { animation: fadeUpLogin 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        .login-input:focus { border-color: #B8860B !important; }
      `}</style>

      <div
        className={`login-card ${shake ? 'login-shake' : ''}`}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: tokens.color.bgCard,
          border: `1px solid ${tokens.color.goldBorder}`,
          borderRadius: '1.5rem',
          padding: 'clamp(2rem, 5vw, 2.75rem)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(184,134,11,0.05)',
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <AdminLogoIcon size={80} />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.35rem', letterSpacing: '0.05em' }}>
            SAYO BEAUTY
          </h1>
          <p style={{ fontSize: '0.85rem', color: tokens.color.gold, margin: 0, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Admin Portal Access
          </p>
        </div>

        <p style={{ textAlign: 'center', color: tokens.color.whiteDim, fontSize: '0.85rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
          🔒 This is a restricted area. Please sign in with your administrator credentials to continue.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={fieldLabel}>Username</label>
            <input
              type="text"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              style={inputStyle}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div>
            <label style={fieldLabel}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{ ...inputStyle, paddingRight: '3rem' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: tokens.color.whiteFaint,
                  cursor: 'pointer', fontSize: '0.75rem', padding: '0.4rem 0.6rem',
                }}
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: 'rgba(229,62,62,0.12)',
              border: '1px solid rgba(229,62,62,0.4)',
              color: '#fc8181',
              padding: '0.7rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(184,134,11,0.5)' : 'linear-gradient(135deg, #B8860B 0%, #d4a017 100%)',
              border: 'none',
              color: '#fff',
              padding: '0.85rem 1.5rem',
              borderRadius: '0.6rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.4rem',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(184,134,11,0.4)',
              transition: 'all 0.2s',
              letterSpacing: '0.03em',
            }}
          >
            {loading ? '🔄 Verifying...' : '🔐 Sign In to Admin Portal'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: tokens.color.whiteFaint, fontSize: '0.72rem', marginTop: '1.75rem', marginBottom: 0 }}>
          Unauthorized access is strictly prohibited &amp; monitored.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN ADMIN PORTAL COMPONENT
───────────────────────────────────────── */
export default function SayoAdminPage() {
  /* ── 🔐 AUTH STATE ── */
  const [authChecked,     setAuthChecked]     = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [data, setData]               = useState<SayoSiteData>(DEFAULT_SITE_DATA);
  const [activeTab, setActiveTab]     = useState<'home' | 'about' | 'services' | 'reviews' | 'general'>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Services Tab Sub-state
  const [serviceGender,   setServiceGender]   = useState<'her' | 'his'>('her');
  const [serviceCategory, setServiceCategory] = useState<string>('WAX');

  // Reviews Tab Sub-state
  const [reviewFilter,      setReviewFilter]      = useState<string>('All');
  const [editingReviewId,   setEditingReviewId]   = useState<number | null>(null);
  const [newReviewModal,    setNewReviewModal]    = useState<boolean>(false);
  const [reviewForm,        setReviewForm]        = useState<Omit<ReviewItem, 'id'>>({
    name: '', avatar: '', rating: 5,
    date: new Date().toISOString().split('T')[0],
    service: 'Facial Treatment', comment: '', location: 'Colombo',
  });

  // About Tab Sub-state
  const [aboutSection,      setAboutSection]      = useState<'hero' | 'team' | 'gallery' | 'reviews'>('hero');
  const [editingStaffId,    setEditingStaffId]    = useState<number | null>(null);
  const [staffModal,        setStaffModal]        = useState<boolean>(false);
  const [staffForm,         setStaffForm]         = useState<Omit<StaffMember, 'id'>>({
    name: '', role: '', experience: '', image: '', bio: '', specialties: '',
  });
  const [editingAboutReviewIdx, setEditingAboutReviewIdx] = useState<number | null>(null);
  const [aboutReviewModal,      setAboutReviewModal]      = useState<boolean>(false);
  const [aboutReviewForm,       setAboutReviewForm]       = useState<AboutReview>({ quote: '', author: '' });

  /* ── 🔐 Check existing session on mount ── */
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(AUTH_SESSION_KEY);
      if (session === 'true') {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.warn('Could not read session storage.', err);
    }
    setAuthChecked(true);
  }, []);

  // Load from localStorage on mount (site data)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sayo_site_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(mergeSiteData(parsed));
      }
    } catch (err) {
      console.warn('Could not read from localStorage, using defaults.', err);
      setData(DEFAULT_SITE_DATA);
    }
  }, []);

  /* ── 🔐 Logout handler ── */
  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to log out of the admin portal?')) return;
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch (err) {}
    setIsAuthenticated(false);
  };

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Save to LocalStorage
  const handleSaveAll = () => {
    try {
      localStorage.setItem('sayo_site_data', JSON.stringify(data));
      showToast('✅ All changes successfully saved locally!');
    } catch (err) {
      showToast('❌ Error saving to localStorage');
    }
  };

  // Reset to Default
  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset ALL pages to SAYO Beauty default data?')) {
      setData(DEFAULT_SITE_DATA);
      try { localStorage.removeItem('sayo_site_data'); } catch (err) {}
      showToast('🔄 Reset to SAYO default data!');
    }
  };

  /* ── Nav Items helpers ── */
  const updateNavItem = (idx: number, field: keyof NavItem, value: string) => {
    const updated = [...data.home.navItems];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, home: { ...data.home, navItems: updated } });
  };
  const addNavItem = () => {
    setData({ ...data, home: { ...data.home, navItems: [...data.home.navItems, { label: 'NEW LINK', href: '/' }] } });
  };
  const removeNavItem = (idx: number) => {
    const updated = data.home.navItems.filter((_, i) => i !== idx);
    setData({ ...data, home: { ...data.home, navItems: updated } });
  };
  const moveNavItem = (idx: number, dir: -1 | 1) => {
    const updated = [...data.home.navItems];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= updated.length) return;
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setData({ ...data, home: { ...data.home, navItems: updated } });
  };

  /* ── Quick Links helpers ── */
  const updateQuickLink = (idx: number, field: keyof QuickLink, value: string) => {
    const updated = [...data.general.quickLinks];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, general: { ...data.general, quickLinks: updated } });
  };
  const addQuickLink = () => {
    setData({ ...data, general: { ...data.general, quickLinks: [...data.general.quickLinks, { label: 'New Link', href: '/' }] } });
  };
  const removeQuickLink = (idx: number) => {
    const updated = data.general.quickLinks.filter((_, i) => i !== idx);
    setData({ ...data, general: { ...data.general, quickLinks: updated } });
  };
  const moveQuickLink = (idx: number, dir: -1 | 1) => {
    const updated = [...data.general.quickLinks];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= updated.length) return;
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setData({ ...data, general: { ...data.general, quickLinks: updated } });
  };

  /* ── Gender Options helpers ── */
  const updateGenderLabel = (key: string, label: string) => {
    const currentOptions = data.services.genderOptions || DEFAULT_SITE_DATA.services.genderOptions;
    const updated = currentOptions.map((g) => g.key === key ? { ...g, label } : g);
    setData({ ...data, services: { ...data.services, genderOptions: updated } });
  };

  /* ── Category helpers ── */
  const updateCategory = (idx: number, field: 'label' | 'image', value: string) => {
    const updated = [...data.services.categories];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, services: { ...data.services, categories: updated } });
  };
  const addCategory = () => {
    const newKey = `CAT_${Date.now()}`;
    const newCategories = [...data.services.categories, { key: newKey, label: 'New Category', image: 'https://placehold.co/487x582?text=New' }];
    const newPriceList = {
      her: { ...data.services.priceList.her, [newKey]: [] },
      his: { ...data.services.priceList.his, [newKey]: [] },
    };
    setData({ ...data, services: { ...data.services, categories: newCategories, priceList: newPriceList } });
    showToast('✅ New category added!');
  };
  const removeCategory = (idx: number) => {
    const catKey = data.services.categories[idx].key;
    if (!window.confirm(`Delete category "${data.services.categories[idx].label}"? This will also remove all its price list items.`)) return;
    const updatedCategories = data.services.categories.filter((_, i) => i !== idx);
    const newHer = { ...data.services.priceList.her };
    const newHis = { ...data.services.priceList.his };
    delete newHer[catKey];
    delete newHis[catKey];
    setData({ ...data, services: { ...data.services, categories: updatedCategories, priceList: { her: newHer, his: newHis } } });
    if (serviceCategory === catKey && updatedCategories.length > 0) setServiceCategory(updatedCategories[0].key);
    showToast('🗑️ Category removed!');
  };
  const moveCategory = (idx: number, dir: -1 | 1) => {
    const updated = [...data.services.categories];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= updated.length) return;
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setData({ ...data, services: { ...data.services, categories: updated } });
  };

  /* ── About: Staff helpers ── */
  const openAddStaff = () => {
    setEditingStaffId(null);
    setStaffForm({ name: '', role: '', experience: '', image: '', bio: '', specialties: '' });
    setStaffModal(true);
  };
  const openEditStaff = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setStaffForm({ name: member.name, role: member.role, experience: member.experience, image: member.image, bio: member.bio, specialties: member.specialties });
    setStaffModal(true);
  };
  const saveStaff = () => {
    if (!staffForm.name.trim()) { alert('Name is required.'); return; }
    if (editingStaffId !== null) {
      const updated = data.about.staff.map((s) => s.id === editingStaffId ? { ...staffForm, id: editingStaffId } : s);
      setData({ ...data, about: { ...data.about, staff: updated } });
      showToast('✏️ Staff member updated!');
    } else {
      const nextId = Math.max(0, ...data.about.staff.map((s) => s.id)) + 1;
      setData({ ...data, about: { ...data.about, staff: [...data.about.staff, { ...staffForm, id: nextId }] } });
      showToast('👤 New staff member added!');
    }
    setStaffModal(false);
  };
  const deleteStaff = (id: number) => {
    if (!window.confirm('Delete this staff member?')) return;
    const updated = data.about.staff.filter((s) => s.id !== id);
    setData({ ...data, about: { ...data.about, staff: updated } });
    showToast('🗑️ Staff member removed!');
  };
  const moveStaff = (idx: number, dir: -1 | 1) => {
    const updated = [...data.about.staff];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= updated.length) return;
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setData({ ...data, about: { ...data.about, staff: updated } });
  };

  /* ── About: Reviews helpers ── */
  const openAddAboutReview = () => {
    setEditingAboutReviewIdx(null);
    setAboutReviewForm({ quote: '', author: '' });
    setAboutReviewModal(true);
  };
  const openEditAboutReview = (idx: number) => {
    setEditingAboutReviewIdx(idx);
    setAboutReviewForm({ ...data.about.reviews[idx] });
    setAboutReviewModal(true);
  };
  const saveAboutReview = () => {
    if (!aboutReviewForm.quote.trim() || !aboutReviewForm.author.trim()) { alert('Quote and Author are required.'); return; }
    if (editingAboutReviewIdx !== null) {
      const updated = data.about.reviews.map((r, i) => i === editingAboutReviewIdx ? aboutReviewForm : r);
      setData({ ...data, about: { ...data.about, reviews: updated } });
      showToast('✏️ Review updated!');
    } else {
      setData({ ...data, about: { ...data.about, reviews: [...data.about.reviews, aboutReviewForm] } });
      showToast('💬 Review added!');
    }
    setAboutReviewModal(false);
  };
  const deleteAboutReview = (idx: number) => {
    if (!window.confirm('Delete this review?')) return;
    const updated = data.about.reviews.filter((_, i) => i !== idx);
    setData({ ...data, about: { ...data.about, reviews: updated } });
    showToast('🗑️ Review removed!');
  };

  /* ── Safe fallbacks ── */
  const safeGenderOptions = data.services?.genderOptions?.length ? data.services.genderOptions : DEFAULT_SITE_DATA.services.genderOptions;
  const safeCategories    = data.services?.categories?.length    ? data.services.categories    : DEFAULT_SITE_DATA.services.categories;

  /* ── Tabs config ── */
  const TABS = [
    { key: 'home',     label: '🏠 HOME PAGE',           count: null },
    { key: 'about',    label: '📖 OUR STORY',           count: data.about.staff.length },
    { key: 'services', label: '💇‍♀️ SERVICES & PRICES',    count: null },
    { key: 'reviews',  label: '⭐ CLIENT REVIEWS',       count: data.reviews.reviews.length },
    { key: 'general',  label: '📍 GENERAL & LOCATIONS', count: data.general.locations.length },
  ];

  /* ── About sub-sections ── */
  const ABOUT_SECTIONS = [
    { key: 'hero',    label: '🌟 Hero Section' },
    { key: 'team',    label: '👤 Team Members' },
    { key: 'gallery', label: '🖼️ Gallery' },
    { key: 'reviews', label: '💬 Reviews Carousel' },
  ];

  /* ═══════════════════════════════════════════
     🔐 AUTH GATES
     1) Still checking session → show nothing/loading
     2) Not authenticated      → show login screen
     3) Authenticated          → show full admin portal
  ═══════════════════════════════════════════ */
  if (!authChecked) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: tokens.color.bgDark,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: tokens.color.whiteDim, fontFamily: tokens.font.family, fontSize: '0.9rem',
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.color.bgDark, color: tokens.color.white, fontFamily: tokens.font.family, paddingBottom: '4rem' }}>

      {/* ── TOAST ── */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          background: '#B8860B', color: '#ffffff', padding: '0.9rem 1.5rem',
          borderRadius: '0.75rem', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          {toastMessage}
        </div>
      )}

      {/* ── TOP HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(14,14,18,0.88)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${tokens.color.whiteBorder}`,
        padding: '0.85rem 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AdminLogoIcon size={48} />
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, letterSpacing: '0.08em' }}>
              SAYO BEAUTY <span style={{ color: tokens.color.gold, fontWeight: 500 }}>ADMIN PORTAL</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: tokens.color.whiteDim, margin: 0 }}>
              Manage Home, Our Story, Services, Reviews &amp; Locations
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handleResetDefaults} style={{ background: 'transparent', border: `1px solid ${tokens.color.whiteBorder}`, color: tokens.color.whiteMuted, padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
            🔄 Reset Defaults
          </button>
          <button onClick={handleSaveAll} style={{ background: 'linear-gradient(135deg, #B8860B 0%, #d4a017 100%)', border: 'none', color: '#fff', padding: '0.6rem 1.4rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(184,134,11,0.4)' }}>
            💾 Save All Changes
          </button>
          <button onClick={handleLogout} style={{ background: 'rgba(229,62,62,0.15)', border: '1px solid rgba(229,62,62,0.4)', color: '#fc8181', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* ── TAB SWITCHER ── */}
      <nav style={{ background: '#121216', borderBottom: `1px solid ${tokens.color.whiteBorder}`, padding: '0 2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{
              background: isActive ? 'rgba(184,134,11,0.18)' : 'transparent',
              border: 'none',
              borderBottom: isActive ? `3px solid ${tokens.color.gold}` : '3px solid transparent',
              color: isActive ? '#fff' : tokens.color.whiteDim,
              padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: isActive ? 600 : 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>
              {tab.label}
              {tab.count !== null && (
                <span style={{ background: isActive ? tokens.color.gold : 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.7rem', padding: '0.12rem 0.5rem', borderRadius: '999px' }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: '1240px', margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* ════════════════════════════════════════
            TAB 1: HOME PAGE EDITOR
        ════════════════════════════════════════ */}
        {activeTab === 'home' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

            {/* Navigation Bar Editor */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Home Page — Navigation Bar</h2>
              <p style={sectionDesc}>Controls the logo text, nav menu links, and the Contact Us button shown in the header.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                {[
                  { label: 'Logo Text (Next to Icon)', key: 'logoText' },
                  { label: 'Contact Button Text',      key: 'contactButtonText' },
                  { label: 'Contact Button Link',      key: 'contactButtonLink' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={fieldLabel}>{label}</label>
                    <input type="text" value={(data.home as any)[key]} onChange={(e) => setData({ ...data, home: { ...data.home, [key]: e.target.value } })} style={inputStyle} />
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', border: `1px solid ${tokens.color.whiteBorder}`, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '0.9rem 1.25rem', background: 'rgba(184,134,11,0.15)', borderBottom: `1px solid ${tokens.color.whiteBorder}`, fontWeight: 600, fontSize: '0.8rem', color: tokens.color.gold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div>Label</div><div>Link (Href)</div><div style={{ textAlign: 'center' }}>Action</div>
                </div>
                {data.home.navItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <input type="text" value={item.label} onChange={(e) => updateNavItem(idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    <input type="text" value={item.href}  onChange={(e) => updateNavItem(idx, 'href',  e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                      <button onClick={() => moveNavItem(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }} title="Move Up">↑</button>
                      <button onClick={() => moveNavItem(idx,  1)} disabled={idx === data.home.navItems.length - 1} style={{ ...smallIconBtn, opacity: idx === data.home.navItems.length - 1 ? 0.3 : 1, cursor: idx === data.home.navItems.length - 1 ? 'not-allowed' : 'pointer' }} title="Move Down">↓</button>
                      <button onClick={() => removeNavItem(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }} title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <button onClick={addNavItem} style={{ background: 'rgba(184,134,11,0.2)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>+ Add Nav Link</button>
                </div>
              </div>
            </section>

            {/* Hero Editor */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Home Page — Hero Banner Settings</h2>
              <p style={sectionDesc}>Update the main headline, tagline, and call-to-action button displayed on the SAYO Beauty landing page.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Eyebrow Text (Small Top Subtitle)', key: 'heroEyebrow', textarea: false },
                  { label: 'Hero Main Heading',                 key: 'heroHeading', textarea: false },
                  { label: 'Hero Body Description',             key: 'heroBody',    textarea: true  },
                ].map(({ label, key, textarea }) => (
                  <div key={key}>
                    <label style={fieldLabel}>{label}</label>
                    {textarea
                      ? <textarea rows={3} value={(data.home as any)[key]} onChange={(e) => setData({ ...data, home: { ...data.home, [key]: e.target.value } })} style={{ ...inputStyle, resize: 'vertical' }} />
                      : <input type="text" value={(data.home as any)[key]} onChange={(e) => setData({ ...data, home: { ...data.home, [key]: e.target.value } })} style={inputStyle} />
                    }
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={fieldLabel}>CTA Button Text</label>
                    <input type="text" value={data.home.heroCtaText} onChange={(e) => setData({ ...data, home: { ...data.home, heroCtaText: e.target.value } })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={fieldLabel}>CTA Button URL</label>
                    <input type="text" value={data.home.heroCtaLink} onChange={(e) => setData({ ...data, home: { ...data.home, heroCtaLink: e.target.value } })} style={inputStyle} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 2: ABOUT PAGE EDITOR
        ════════════════════════════════════════ */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Sub-section pills */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {ABOUT_SECTIONS.map((s) => {
                const isActive = aboutSection === s.key;
                return (
                  <button key={s.key} onClick={() => setAboutSection(s.key as any)} style={{
                    background: isActive ? tokens.color.gold : 'rgba(255,255,255,0.05)',
                    border: isActive ? `1px solid ${tokens.color.gold}` : `1px solid ${tokens.color.whiteBorder}`,
                    color: '#fff', padding: '0.55rem 1.25rem', borderRadius: '999px',
                    fontWeight: isActive ? 600 : 500, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* ── HERO SECTION ── */}
            {aboutSection === 'hero' && (
              <section style={sectionCard}>
                <h2 style={sectionTitle}>Our Story — Hero Section</h2>
                <p style={sectionDesc}>Edit the eyebrow label, main heading, and the body paragraph shown on the About page hero area.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={fieldLabel}>Eyebrow Text (Gold label above heading)</label>
                    <input type="text" value={data.about.heroEyebrow} onChange={(e) => setData({ ...data, about: { ...data.about, heroEyebrow: e.target.value } })} style={inputStyle} placeholder="e.g. OUR STORY" />
                  </div>
                  <div>
                    <label style={fieldLabel}>Main Heading</label>
                    <input type="text" value={data.about.heroHeading} onChange={(e) => setData({ ...data, about: { ...data.about, heroHeading: e.target.value } })} style={inputStyle} placeholder="e.g. We are experience in making you more beautiful" />
                  </div>
                  <div>
                    <label style={fieldLabel}>Body Paragraph</label>
                    <textarea rows={4} value={data.about.heroBody} onChange={(e) => setData({ ...data, about: { ...data.about, heroBody: e.target.value } })} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Short description paragraph shown below the heading..." />
                  </div>
                </div>

                {/* Live Preview */}
                <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #18181e 0%, #0d0d12 100%)', border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1rem', padding: '2rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '1rem', right: '1.25rem', background: 'rgba(184,134,11,0.2)', color: tokens.color.gold, fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '0.375rem', letterSpacing: '0.1em' }}>LIVE PREVIEW</span>
                  <p style={{ color: tokens.color.gold, fontSize: '1.4rem', fontWeight: 600, margin: '0 0 0.75rem' }}>{data.about.heroEyebrow}</p>
                  <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 600, color: '#fff', lineHeight: 1.2, margin: '0 0 1rem', maxWidth: '560px' }}>{data.about.heroHeading}</h3>
                  <p style={{ color: tokens.color.whiteMuted, fontSize: '0.95rem', lineHeight: 1.7, margin: 0, maxWidth: '480px' }}>{data.about.heroBody}</p>
                </div>
              </section>
            )}

            {/* ── TEAM SECTION ── */}
            {aboutSection === 'team' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section style={sectionCard}>
                  <h2 style={sectionTitle}>Team Section Title</h2>
                  <p style={sectionDesc}>The gold heading shown above the staff cards on the About page.</p>
                  <input type="text" value={data.about.teamSectionTitle} onChange={(e) => setData({ ...data, about: { ...data.about, teamSectionTitle: e.target.value } })} style={inputStyle} placeholder="e.g. Meet the Visionaries" />
                </section>

                <section style={sectionCard}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Staff Members ({data.about.staff.length})</h2>
                      <p style={{ ...sectionDesc, marginBottom: 0, marginTop: '0.2rem' }}>Add, edit, or reorder the team members shown on the About page.</p>
                    </div>
                    <button onClick={openAddStaff} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                      + Add Staff Member
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.about.staff.map((member, idx) => (
                      <div key={member.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tokens.color.whiteBorder}`, borderRadius: '1rem', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                        {/* Avatar placeholder */}
                        <div style={{ width: '56px', height: '56px', borderRadius: '0.75rem', background: 'rgba(184,134,11,0.2)', border: `1px solid ${tokens.color.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.4rem', color: tokens.color.gold, fontWeight: 700 }}>
                          {member.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: tokens.color.gold }}>{member.name}</h3>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(184,134,11,0.15)', color: tokens.color.gold, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>{member.experience}</span>
                          </div>
                          <p style={{ margin: '0 0 0.35rem', fontSize: '0.82rem', color: tokens.color.whiteDim }}>{member.role}</p>
                          <p style={{ margin: '0 0 0.35rem', fontSize: '0.82rem', color: tokens.color.whiteFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '560px' }}>{member.bio}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: tokens.color.whiteFaint }}><span style={{ color: tokens.color.whiteDim, fontWeight: 500 }}>Specialties:</span> {member.specialties}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flexShrink: 0 }}>
                          <button onClick={() => moveStaff(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                          <button onClick={() => moveStaff(idx,  1)} disabled={idx === data.about.staff.length - 1} style={{ ...smallIconBtn, opacity: idx === data.about.staff.length - 1 ? 0.3 : 1, cursor: idx === data.about.staff.length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                          <button onClick={() => openEditStaff(member)} style={{ ...smallIconBtn, cursor: 'pointer' }}>✏️</button>
                          <button onClick={() => deleteStaff(member.id)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️</button>
                        </div>
                      </div>
                    ))}
                    {data.about.staff.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: tokens.color.whiteFaint, fontSize: '0.9rem' }}>
                        No staff members yet. Click "+ Add Staff Member" to get started.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* ── GALLERY SECTION ── */}
            {aboutSection === 'gallery' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section style={sectionCard}>
                  <h2 style={sectionTitle}>Gallery Section — Headings & Description</h2>
                  <p style={sectionDesc}>Edit the title and descriptive text shown above the gallery on the About page.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={fieldLabel}>Gallery Section Title</label>
                      <input type="text" value={data.about.gallerySectionTitle} onChange={(e) => setData({ ...data, about: { ...data.about, gallerySectionTitle: e.target.value } })} style={inputStyle} placeholder="e.g. Transformations & Artistry" />
                    </div>
                    <div>
                      <label style={fieldLabel}>Gallery Description Text</label>
                      <textarea rows={3} value={data.about.galleryDescription} onChange={(e) => setData({ ...data, about: { ...data.about, galleryDescription: e.target.value } })} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                  </div>
                </section>

                <section style={sectionCard}>
                  <h2 style={sectionTitle}>Gallery — Image Paths</h2>
                  <p style={sectionDesc}>Update the 5 gallery image paths. Use public folder paths (e.g. <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.82rem' }}>/Rectangle 32.jpg</code>) or full URLs.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(['img1', 'img2', 'img3', 'img4', 'img5'] as const).map((key, i) => (
                      <div key={key} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(184,134,11,0.1)', border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '0.5rem', padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: tokens.color.gold }}>
                          Image {i + 1}
                          <div style={{ fontSize: '0.65rem', color: tokens.color.whiteFaint, fontWeight: 400, marginTop: '0.2rem' }}>
                            {key === 'img5' ? 'Featured' : key === 'img4' ? 'CTA overlay' : `Grid ${i + 1}`}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={data.about.gallery[key]}
                          onChange={(e) => setData({ ...data, about: { ...data.about, gallery: { ...data.about.gallery, [key]: e.target.value } } })}
                          style={inputStyle}
                          placeholder={`/Rectangle 3${i + 2}.jpg`}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ── REVIEWS CAROUSEL SECTION ── */}
            {aboutSection === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section style={sectionCard}>
                  <h2 style={sectionTitle}>Reviews Section Title</h2>
                  <p style={sectionDesc}>The heading shown above the review carousel on the About page.</p>
                  <input type="text" value={data.about.reviewSectionTitle} onChange={(e) => setData({ ...data, about: { ...data.about, reviewSectionTitle: e.target.value } })} style={inputStyle} placeholder="e.g. What Our Clients Say" />
                </section>

                <section style={sectionCard}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Review Carousel Items ({data.about.reviews.length})</h2>
                      <p style={{ ...sectionDesc, marginBottom: 0, marginTop: '0.2rem' }}>These quotes rotate in the carousel on the About page (with dot navigation).</p>
                    </div>
                    <button onClick={openAddAboutReview} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                      + Add Review
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.about.reviews.map((rev, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tokens.color.whiteBorder}`, borderRadius: '1rem', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: tokens.color.whiteMuted, lineHeight: 1.6, fontStyle: 'italic' }}>{rev.quote}</p>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: tokens.color.gold, fontWeight: 600 }}>— {rev.author}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flexShrink: 0 }}>
                          <button onClick={() => openEditAboutReview(idx)} style={{ ...smallIconBtn, cursor: 'pointer' }}>✏️</button>
                          <button onClick={() => deleteAboutReview(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️</button>
                        </div>
                      </div>
                    ))}
                    {data.about.reviews.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: tokens.color.whiteFaint, fontSize: '0.9rem' }}>
                        No reviews yet. Click "+ Add Review" to add one.
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 3: SERVICES & PRICE LIST EDITOR
        ════════════════════════════════════════ */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <section style={sectionCard}>
              <h2 style={sectionTitle}>Services Page — Headline &amp; Intro</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                <div>
                  <label style={fieldLabel}>Main Hero Title</label>
                  <input type="text" value={data.services.heroTitle} onChange={(e) => setData({ ...data, services: { ...data.services, heroTitle: e.target.value } })} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>Section Intro Text</label>
                  <input type="text" value={data.services.sectionIntro} onChange={(e) => setData({ ...data, services: { ...data.services, sectionIntro: e.target.value } })} style={inputStyle} />
                </div>
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <label style={fieldLabel}>Hero Subtitle Description (use \n for line break)</label>
                <textarea rows={3} value={data.services.heroSubtitle} onChange={(e) => setData({ ...data, services: { ...data.services, heroSubtitle: e.target.value } })} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </section>

            <section style={sectionCard}>
              <h2 style={sectionTitle}>Gender Sanctuary Labels</h2>
              <p style={sectionDesc}>Edit the display names for the "Her Sanctuary" / "His Retreat" toggle buttons on the Services page.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {safeGenderOptions.map((g) => (
                  <div key={g.key}>
                    <label style={fieldLabel}>{GENDER_ICON_MAP[g.key] || '👤'} Label for &quot;{g.key}&quot; Tab</label>
                    <input type="text" value={g.label} onChange={(e) => updateGenderLabel(g.key, e.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCard}>
              <h2 style={sectionTitle}>Category Manager ({safeCategories.length})</h2>
              <p style={sectionDesc}>Manage the treatment categories shown in the tabs &amp; gallery on the Services page.</p>
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', border: `1px solid ${tokens.color.whiteBorder}`, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr 140px', padding: '0.9rem 1.25rem', background: 'rgba(184,134,11,0.15)', borderBottom: `1px solid ${tokens.color.whiteBorder}`, fontWeight: 600, fontSize: '0.8rem', color: tokens.color.gold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div>Key</div><div>Category Label</div><div>Image URL</div><div style={{ textAlign: 'center' }}>Action</div>
                </div>
                {safeCategories.map((cat, idx) => (
                  <div key={cat.key} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr 140px', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.72rem', color: tokens.color.whiteFaint, fontFamily: 'monospace', wordBreak: 'break-all' }}>{cat.key}</span>
                    <input type="text" value={cat.label} onChange={(e) => updateCategory(idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    <input type="text" value={cat.image} onChange={(e) => updateCategory(idx, 'image', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem', fontSize: '0.75rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                      <button onClick={() => moveCategory(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                      <button onClick={() => moveCategory(idx,  1)} disabled={idx === safeCategories.length - 1} style={{ ...smallIconBtn, opacity: idx === safeCategories.length - 1 ? 0.3 : 1, cursor: idx === safeCategories.length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                      <button onClick={() => removeCategory(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <button onClick={addCategory} style={{ background: 'rgba(184,134,11,0.2)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>+ Add New Category</button>
                </div>
              </div>
            </section>

            <section style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: tokens.color.gold, margin: 0 }}>Price List Manager</h3>
                  <p style={{ fontSize: '0.82rem', color: tokens.color.whiteDim, margin: '0.2rem 0 0' }}>Edit service names and rates for {safeGenderOptions.map((g) => g.label).join(' & ')}</p>
                </div>
                <div style={{ display: 'flex', background: '#08080a', padding: '0.3rem', borderRadius: '0.75rem', border: `1px solid ${tokens.color.whiteBorder}` }}>
                  {safeGenderOptions.map((g) => (
                    <button key={g.key} onClick={() => setServiceGender(g.key as 'her' | 'his')} style={{ background: serviceGender === g.key ? tokens.color.gold : 'transparent', color: '#fff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {GENDER_ICON_MAP[g.key] || '👤'} {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.75rem' }}>
                {safeCategories.map((cat) => {
                  const isCatActive = serviceCategory === cat.key;
                  const count = data.services.priceList[serviceGender][cat.key]?.length || 0;
                  return (
                    <button key={cat.key} onClick={() => setServiceCategory(cat.key)} style={{ background: isCatActive ? tokens.color.gold : 'rgba(255,255,255,0.05)', border: isCatActive ? `1px solid ${tokens.color.gold}` : `1px solid ${tokens.color.whiteBorder}`, color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '999px', fontWeight: isCatActive ? 600 : 500, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {cat.label} <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({count})</span>
                    </button>
                  );
                })}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', border: `1px solid ${tokens.color.whiteBorder}`, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px 60px', padding: '0.9rem 1.25rem', background: 'rgba(184,134,11,0.15)', borderBottom: `1px solid ${tokens.color.whiteBorder}`, fontWeight: 600, fontSize: '0.8rem', color: tokens.color.gold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div>Service Name</div><div>Primary Price (LKR)</div><div>Promo / Price 2</div><div style={{ textAlign: 'center' }}>Del</div>
                </div>
                {(data.services.priceList[serviceGender][serviceCategory] || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px 60px', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <input type="text" value={item.name} onChange={(e) => { const n = { ...data.services.priceList }; n[serviceGender][serviceCategory][idx].name = e.target.value; setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} placeholder="Service Name" />
                    <input type="text" value={item.price1} onChange={(e) => { const n = { ...data.services.priceList }; n[serviceGender][serviceCategory][idx].price1 = e.target.value; setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} placeholder="2,500.00" />
                    <input type="text" value={item.price2 || ''} onChange={(e) => { const n = { ...data.services.priceList }; n[serviceGender][serviceCategory][idx].price2 = e.target.value; setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} placeholder="Optional" />
                    <div style={{ textAlign: 'center' }}>
                      <button onClick={() => { const n = { ...data.services.priceList }; n[serviceGender][serviceCategory] = n[serviceGender][serviceCategory].filter((_, i) => i !== idx); setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.35rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <button onClick={() => { const n = { ...data.services.priceList }; const cur = n[serviceGender][serviceCategory] || []; n[serviceGender][serviceCategory] = [...cur, { name: 'New Luxury Service', price1: '3,000.00' }]; setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ background: 'rgba(184,134,11,0.2)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    + Add Service to {safeCategories.find((c) => c.key === serviceCategory)?.label || serviceCategory} ({safeGenderOptions.find((g) => g.key === serviceGender)?.label})
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 4: REVIEWS EDITOR
        ════════════════════════════════════════ */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Reviews Page — Header Configuration</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                {[
                  { label: 'Eyebrow Badge Text',    key: 'heroEyebrow'    },
                  { label: 'Title First Part',       key: 'heroTitleStart' },
                  { label: 'Title Highlighted Gold', key: 'heroTitleGold'  },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={fieldLabel}>{label}</label>
                    <input type="text" value={(data.reviews as any)[key]} onChange={(e) => setData({ ...data, reviews: { ...data.reviews, [key]: e.target.value } })} style={inputStyle} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <label style={fieldLabel}>Hero Subtitle</label>
                <textarea rows={2} value={data.reviews.heroSubtitle} onChange={(e) => setData({ ...data, reviews: { ...data.reviews, heroSubtitle: e.target.value } })} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </section>

            <section style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: tokens.color.gold, margin: 0 }}>Client Stories &amp; Testimonials ({data.reviews.reviews.length})</h3>
                  <p style={{ fontSize: '0.82rem', color: tokens.color.whiteDim, margin: '0.2rem 0 0' }}>Filter by location or add new real customer reviews</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)} style={{ background: tokens.color.bgInput, border: `1px solid ${tokens.color.whiteBorder}`, color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                    <option value="All">All Locations</option>
                    {data.general.locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                  <button onClick={() => { setEditingReviewId(null); setReviewForm({ name: '', avatar: '', rating: 5, date: new Date().toISOString().split('T')[0], service: 'Facial Treatment', comment: '', location: 'Colombo' }); setNewReviewModal(true); }} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                    + Add New Review
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {data.reviews.reviews.filter((r) => reviewFilter === 'All' || r.location === reviewFilter).map((rev) => (
                  <div key={rev.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tokens.color.whiteBorder}`, borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(184,134,11,0.25)', border: '1px solid #B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#B8860B' }}>{rev.avatar}</div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{rev.name}</h4>
                            <span style={{ fontSize: '0.72rem', color: tokens.color.whiteFaint }}>{rev.date}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= rev.rating} />)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(184,134,11,0.15)', color: tokens.color.gold, padding: '0.15rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>{rev.service}</span>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', color: tokens.color.whiteDim, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>📍 {rev.location}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: tokens.color.whiteDim, lineHeight: 1.6, margin: 0 }}>&ldquo;{rev.comment}&rdquo;</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                      <button onClick={() => { setEditingReviewId(rev.id); setReviewForm({ name: rev.name, avatar: rev.avatar, rating: rev.rating, date: rev.date, service: rev.service, comment: rev.comment, location: rev.location }); setNewReviewModal(true); }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>✏️ Edit</button>
                      <button onClick={() => { if (window.confirm(`Delete review by "${rev.name}"?`)) { const updated = data.reviews.reviews.filter((item) => item.id !== rev.id); setData({ ...data, reviews: { ...data.reviews, reviews: updated } }); } }} style={{ background: 'rgba(229,62,62,0.15)', color: '#fc8181', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 5: GENERAL & FOOTER EDITOR
        ════════════════════════════════════════ */}
        {activeTab === 'general' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Brand &amp; Footer Information</h2>
              <p style={sectionDesc}>This data appears on all page footers (Home, Services, Reviews, About).</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Salon Brand Name',         key: 'brandName'      },
                  { label: 'Brand Tagline',             key: 'brandTagline'   },
                  { label: 'Contact Phone Number',      key: 'contactPhone'   },
                  { label: 'Contact Email Address',     key: 'contactEmail'   },
                  { label: 'Physical Salon Address',    key: 'contactAddress' },
                  { label: 'Copyright Notice',          key: 'copyrightText'  },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={fieldLabel}>{label}</label>
                    <input type="text" value={(data.general as any)[key]} onChange={(e) => setData({ ...data, general: { ...data.general, [key]: e.target.value } })} style={inputStyle} />
                  </div>
                ))}
              </div>
            </section>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <section style={sectionCard}>
                <h2 style={sectionTitle}>Footer Quick Links ({data.general.quickLinks.length})</h2>
                <p style={sectionDesc}>Manage the footer's Quick Links section (label + destination URL).</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {data.general.quickLinks.map((link, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="text" value={link.label} onChange={(e) => updateQuickLink(idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.55rem 0.75rem' }} placeholder="Label" />
                      <input type="text" value={link.href}  onChange={(e) => updateQuickLink(idx, 'href',  e.target.value)} style={{ ...inputStyle, padding: '0.55rem 0.75rem' }} placeholder="/href" />
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button onClick={() => moveQuickLink(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                        <button onClick={() => moveQuickLink(idx,  1)} disabled={idx === data.general.quickLinks.length - 1} style={{ ...smallIconBtn, opacity: idx === data.general.quickLinks.length - 1 ? 0.3 : 1, cursor: idx === data.general.quickLinks.length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                        <button onClick={() => removeQuickLink(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: 'none', padding: '0 0.6rem', borderRadius: '0.4rem', cursor: 'pointer' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={addQuickLink} style={{ background: 'rgba(184,134,11,0.18)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', marginTop: '0.4rem' }}>+ Add Quick Link</button>
                </div>
              </section>

              <section style={sectionCard}>
                <h2 style={sectionTitle}>Salon Locations ({data.general.locations.length})</h2>
                <p style={sectionDesc}>Add or remove cities where SAYO Beauty operates in Sri Lanka.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.general.locations.map((loc, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={loc} onChange={(e) => { const updated = [...data.general.locations]; updated[idx] = e.target.value; setData({ ...data, general: { ...data.general, locations: updated } }); }} style={inputStyle} />
                      <button onClick={() => { const updated = data.general.locations.filter((_, i) => i !== idx); setData({ ...data, general: { ...data.general, locations: updated } }); }} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: 'none', padding: '0 0.8rem', borderRadius: '0.5rem', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  ))}
                  <button onClick={() => { const updated = [...data.general.locations, 'New Location']; setData({ ...data, general: { ...data.general, locations: updated } }); }} style={{ background: 'rgba(184,134,11,0.18)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', marginTop: '0.4rem' }}>+ Add Salon Location</button>
                </div>
              </section>

              <section style={sectionCard}>
                <h2 style={sectionTitle}>Social Media Links</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                  {[
                    { label: 'WhatsApp Link',          key: 'whatsapp'  },
                    { label: 'Facebook Page URL',      key: 'facebook'  },
                    { label: 'Instagram Profile URL',  key: 'instagram' },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteDim, marginBottom: '0.3rem' }}>{label}</label>
                      <input type="text" value={(data.general.socialLinks as any)[key]} onChange={(e) => setData({ ...data, general: { ...data.general, socialLinks: { ...data.general.socialLinks, [key]: e.target.value } } })} style={inputStyle} />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* ════════════════════════════════════════
          MODAL: ADD / EDIT CLIENT REVIEW (Reviews Tab)
      ════════════════════════════════════════ */}
      {newReviewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: tokens.color.bgCard, border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1.25rem', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: tokens.color.gold, marginBottom: '1.5rem', marginTop: 0 }}>
              {editingReviewId ? '✏️ Edit Client Review' : '+ Add Client Review'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Client Name</label>
                  <input type="text" value={reviewForm.name} onChange={(e) => { const nameVal = e.target.value; const parts = nameVal.trim().split(' '); const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : nameVal.slice(0, 2).toUpperCase(); setReviewForm({ ...reviewForm, name: nameVal, avatar: initials }); }} placeholder="e.g. Anika Perera" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Initials</label>
                  <input type="text" value={reviewForm.avatar} onChange={(e) => setReviewForm({ ...reviewForm, avatar: e.target.value.toUpperCase() })} style={inputStyle} maxLength={3} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Service Taken</label>
                  <input type="text" value={reviewForm.service} onChange={(e) => setReviewForm({ ...reviewForm, service: e.target.value })} placeholder="e.g. Bridal Package" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Salon Location</label>
                  <select value={reviewForm.location} onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })} style={{ ...inputStyle, padding: '0.65rem 0.8rem' }}>
                    {data.general.locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Rating</label>
                  <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} style={{ ...inputStyle, padding: '0.65rem 0.8rem' }}>
                    <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                    <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                    <option value={3}>3 Stars ⭐⭐⭐</option>
                    <option value={2}>2 Stars ⭐⭐</option>
                    <option value={1}>1 Star ⭐</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Review Date</label>
                  <input type="date" value={reviewForm.date} onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Comment / Testimonial</label>
                <textarea rows={4} value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="What did the client say about SAYO Beauty?" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => setNewReviewModal(false)} style={{ background: 'transparent', border: `1px solid ${tokens.color.whiteBorder}`, color: tokens.color.whiteDim, padding: '0.6rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => {
                  if (!reviewForm.name.trim() || !reviewForm.comment.trim()) { alert('Please fill in the Name and Comment fields.'); return; }
                  if (editingReviewId) {
                    const updated = data.reviews.reviews.map((r) => r.id === editingReviewId ? { ...reviewForm, id: editingReviewId } : r);
                    setData({ ...data, reviews: { ...data.reviews, reviews: updated } });
                    showToast('✏️ Review updated!');
                  } else {
                    const nextId = Math.max(0, ...data.reviews.reviews.map((r) => r.id)) + 1;
                    setData({ ...data, reviews: { ...data.reviews, reviews: [{ ...reviewForm, id: nextId }, ...data.reviews.reviews] } });
                    showToast('⭐ New review added!');
                  }
                  setNewReviewModal(false);
                }} style={{ background: 'linear-gradient(135deg, #B8860B 0%, #d4a017 100%)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                  {editingReviewId ? 'Save Changes' : 'Add Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL: ADD / EDIT STAFF MEMBER (About Tab)
      ════════════════════════════════════════ */}
      {staffModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ background: tokens.color.bgCard, border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1.25rem', padding: '2rem', width: '100%', maxWidth: '580px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)', margin: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: tokens.color.gold, marginBottom: '1.5rem', marginTop: 0 }}>
              {editingStaffId !== null ? '✏️ Edit Staff Member' : '👤 Add Staff Member'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Full Name *</label>
                  <input type="text" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} placeholder="e.g. Hiruni Perera" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Role / Title</label>
                  <input type="text" value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} placeholder="e.g. Lead Stylist & Founder" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Years of Experience</label>
                  <input type="text" value={staffForm.experience} onChange={(e) => setStaffForm({ ...staffForm, experience: e.target.value })} placeholder="e.g. 12+ Years" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Profile Image Path / URL</label>
                  <input type="text" value={staffForm.image} onChange={(e) => setStaffForm({ ...staffForm, image: e.target.value })} placeholder="e.g. /staff-hiruni.jpg" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Bio / Description</label>
                <textarea rows={4} value={staffForm.bio} onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })} placeholder="Short bio about this team member's background and expertise..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Specialties (comma separated)</label>
                <input type="text" value={staffForm.specialties} onChange={(e) => setStaffForm({ ...staffForm, specialties: e.target.value })} placeholder="e.g. Precision Haircuts, Balayage & Highlights" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => setStaffModal(false)} style={{ background: 'transparent', border: `1px solid ${tokens.color.whiteBorder}`, color: tokens.color.whiteDim, padding: '0.6rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
                <button onClick={saveStaff} style={{ background: 'linear-gradient(135deg, #B8860B 0%, #d4a017 100%)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                  {editingStaffId !== null ? 'Save Changes' : 'Add Staff Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL: ADD / EDIT ABOUT PAGE REVIEW
      ════════════════════════════════════════ */}
      {aboutReviewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: tokens.color.bgCard, border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1.25rem', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: tokens.color.gold, marginBottom: '1.5rem', marginTop: 0 }}>
              {editingAboutReviewIdx !== null ? '✏️ Edit Carousel Review' : '💬 Add Carousel Review'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Quote Text *</label>
                <textarea rows={4} value={aboutReviewForm.quote} onChange={(e) => setAboutReviewForm({ ...aboutReviewForm, quote: e.target.value })} placeholder={`"Include the quote in quotation marks like this..."`} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Author Name *</label>
                <input type="text" value={aboutReviewForm.author} onChange={(e) => setAboutReviewForm({ ...aboutReviewForm, author: e.target.value })} placeholder="e.g. Nimesha D." style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => setAboutReviewModal(false)} style={{ background: 'transparent', border: `1px solid ${tokens.color.whiteBorder}`, color: tokens.color.whiteDim, padding: '0.6rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
                <button onClick={saveAboutReview} style={{ background: 'linear-gradient(135deg, #B8860B 0%, #d4a017 100%)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                  {editingAboutReviewIdx !== null ? 'Save Changes' : 'Add Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}