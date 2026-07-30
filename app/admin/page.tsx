'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
   ✅ HARDCODED CREDENTIALS (No API needed)
   Works perfectly on Netlify static hosting
───────────────────────────────────────── */
const ADMIN_USERNAME  = 'admin';
const ADMIN_PASSWORD  = 'sayo@2025';
const AUTH_SESSION_KEY = 'sayo_admin_auth_session';
const LOCAL_STORAGE_KEY = 'sayo_site_data_local';

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
export type NavItem      = { label: string; href: string };
export type QuickLink    = { label: string; href: string };
export type GenderOption = { key: string; label: string };
export type CategoryItem = { key: string; label: string; image: string };
export type PriceItem    = { name: string; price1: string; price2?: string };
export type ReviewItem   = {
  id: number; name: string; avatar: string; rating: number;
  date: string; service: string; comment: string; location: string;
};
export type StaffMember  = {
  id: number; name: string; role: string; experience: string;
  image: string; bio: string; specialties: string;
};
export type AboutReview   = { quote: string; author: string };
export type GalleryImages = {
  img1: string; img2: string; img3: string; img4: string; img5: string;
};
export type HomeData = {
  logoText: string; navItems: NavItem[];
  contactButtonText: string; contactButtonLink: string;
  heroEyebrow: string; heroHeading: string; heroBody: string;
  heroCtaText: string; heroCtaLink: string;
};
export type GeneralData = {
  brandName: string; brandTagline: string; quickLinks: QuickLink[];
  locations: string[]; contactPhone: string; contactEmail: string;
  contactAddress: string; copyrightText: string;
  socialLinks: { whatsapp: string; facebook: string; instagram: string };
};
export type ServicesData = {
  heroTitle: string; heroSubtitle: string; sectionIntro: string;
  genderOptions: GenderOption[]; categories: CategoryItem[];
  priceList: {
    her: Record<string, PriceItem[]>;
    his: Record<string, PriceItem[]>;
  };
};
export type ReviewsData = {
  heroEyebrow: string; heroTitleStart: string; heroTitleGold: string;
  heroSubtitle: string; reviews: ReviewItem[];
};
export type AboutData = {
  heroEyebrow: string; heroHeading: string; heroBody: string;
  teamSectionTitle: string; gallerySectionTitle: string;
  galleryDescription: string; reviewSectionTitle: string;
  gallery: GalleryImages; staff: StaffMember[]; reviews: AboutReview[];
};
export type SayoSiteData = {
  home: HomeData; general: GeneralData; services: ServicesData;
  reviews: ReviewsData; about: AboutData;
};

/* ─────────────────────────────────────────
   DEFAULT DATA
───────────────────────────────────────── */
const DEFAULT_ABOUT_DATA: AboutData = {
  heroEyebrow: 'OUR STORY',
  heroHeading: 'We are experience in making you more beautiful',
  heroBody: 'We will make your skin better and also more glowing skin. And we provide to treatment spa and face with best service our employees,',
  teamSectionTitle: 'Meet the Visionaries',
  gallerySectionTitle: 'Transformations & Artistry',
  galleryDescription: 'Explore our latest work, behind-the-scenes moments, and client transformations.',
  reviewSectionTitle: 'What Our Clients Say',
  gallery: {
    img1: '/Rectangle 32.jpg', img2: '/Rectangle 33.jpg',
    img3: '/Rectangle 34.jpg', img4: '/Rectangle 36.jpg',
    img5: '/Rectangle 35.jpg',
  },
  staff: [
    {
      id: 1, name: 'Hiruni Perera', role: 'Lead Stylist & Founder',
      experience: '12+ Years', image: '/staff-hiruni.jpg',
      bio: 'Train-certified in London and Singapore, Hiruni founded the salon with a vision to revolutionize modern hair styling in Sri Lanka.',
      specialties: 'Precision Haircuts, Balayage & Highlights, Advanced Hair Treatments',
    },
    {
      id: 2, name: 'Aruna Ratnayake', role: 'Grooming Specialist',
      experience: '10+ Years', image: '/staff-aruna.jpg',
      bio: "Bringing a sharp eye for detail and modern barbering techniques, Aruna specializes in tailored men's styling and beard architecture.",
      specialties: "Precision Beard Sculpting, Classic & Modern Men's Haircuts, Groom's Styling Package",
    },
  ],
  reviews: [
    { quote: '"Choosing SAYO for my Kandyan bridal dressing was the best decision I made."', author: 'Nimesha D.' },
    { quote: '"I\'ve tried many salons across Colombo, but SAYO stands apart."', author: 'Sanduni R.' },
    { quote: '"Aruna\'s attention to detail with my beard and fade was exceptional."', author: 'Kasun P.' },
    { quote: '"From the moment you walk in, you feel looked after."', author: 'Dilani W.' },
  ],
};

const DEFAULT_SITE_DATA: SayoSiteData = {
  home: {
    logoText: 'SAYO',
    navItems: [
      { label: 'HOME', href: '/' },
      { label: 'OUR STORY', href: '/about' },
      { label: 'SERVICES', href: '/services' },
      { label: 'PRODUCTS', href: '/products' },
      { label: 'REVIEWS', href: '/reviews' },
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
      { label: 'Home', href: '/' },
      { label: 'Our Story', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Products', href: '/products' },
      { label: 'Reviews', href: '/reviews' },
    ],
    locations: ['Colombo', 'Negombo', 'Kiribathgoda'],
    contactPhone: '+94 77 233 6233',
    contactEmail: 'hello@sayobeauty.com',
    contactAddress: '123 Galle Road, Colombo, Sri Lanka',
    copyrightText: '© 2025 SAYO Beauty. All rights reserved.',
    socialLinks: {
      whatsapp: 'https://wa.me/94772336233',
      facebook: 'https://facebook.com/sayobeauty',
      instagram: 'https://instagram.com/sayobeauty',
    },
  },
  services: {
    heroTitle: 'Tailored Treatments for Your Unique Glow',
    heroSubtitle: 'Experience a symphony of precision and luxury.\nOur services are tailored to the individual.',
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
        WAX:    [{ name: 'Full Arms Wax', price1: '2,500.00' }, { name: 'Full Legs Wax', price1: '3,500.00' }, { name: 'Underarm Wax', price1: '1,200.00' }, { name: 'Eyebrow Threading', price1: '800.00' }, { name: 'Full Body Wax', price1: '7,500.00', price2: '6,800.00' }],
        HAIR:   [{ name: 'Cut & Re-Style (Advance)', price1: '4,200.00', price2: '3,600.00' }, { name: 'Fringe Cut', price1: '1,500.00' }, { name: 'Trim', price1: '1,500.00' }, { name: 'Blow Dry - Short', price1: '2,500.00', price2: '2,200.00' }, { name: 'Hair Wash & Blast Dry', price1: '2,100.00', price2: '1,800.00' }],
        SKIN:   [{ name: 'Classic Facial', price1: '3,000.00' }, { name: 'Gold Facial', price1: '6,500.00' }, { name: 'Skin Brightening', price1: '5,200.00' }, { name: 'Acne Treatment', price1: '4,800.00' }, { name: 'Anti-Aging Facial', price1: '7,200.00', price2: '6,500.00' }],
        NAIL:   [{ name: 'Classic Manicure', price1: '1,800.00' }, { name: 'Gel Manicure', price1: '3,200.00' }, { name: 'Classic Pedicure', price1: '2,200.00' }, { name: 'Gel Pedicure', price1: '3,800.00' }, { name: 'Nail Art (Per Set)', price1: '1,500.00' }],
        BODY:   [{ name: 'Full Body Massage', price1: '5,500.00' }, { name: 'Body Scrub', price1: '4,200.00' }, { name: 'Body Wrap', price1: '6,000.00' }, { name: 'Aromatherapy Massage', price1: '6,800.00', price2: '5,900.00' }, { name: 'Hot Stone Massage', price1: '7,500.00' }],
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
  },
  reviews: {
    heroEyebrow: 'Client Stories',
    heroTitleStart: 'What Our Clients',
    heroTitleGold: 'Say About Us',
    heroSubtitle: "Real experiences from real clients. Discover why SAYO is Sri Lanka's most trusted luxury beauty destination.",
    reviews: [
      { id: 1, name: 'Anika Perera',        avatar: 'AP', rating: 5, date: '2024-12-15', service: 'Bridal Package',          comment: 'Absolutely stunning experience! The team made me feel like royalty on my wedding day.',     location: 'Colombo'      },
      { id: 2, name: 'Dilshan Fernando',     avatar: 'DF', rating: 5, date: '2024-12-08', service: 'Hair & Grooming',         comment: 'Came in for a haircut and beard trim. The stylist really listened to what I wanted.',     location: 'Negombo'      },
      { id: 3, name: 'Shalini Jayawardena',  avatar: 'SJ', rating: 5, date: '2024-11-29', service: 'Gold Facial',             comment: 'My skin has never felt this smooth! The gold facial treatment was pure indulgence.',      location: 'Colombo'      },
      { id: 4, name: 'Rohan Wickramasinghe', avatar: 'RW', rating: 4, date: '2024-11-20', service: 'Deep Tissue Massage',     comment: 'Great massage therapy session. The therapist was skilled and addressed all problem areas.', location: 'Kiribathgoda' },
      { id: 5, name: 'Priya Kumari',         avatar: 'PK', rating: 5, date: '2024-11-10', service: 'Gel Manicure & Pedicure', comment: 'The nail art they created was exactly what I had in mind! Super talented nail technicians.', location: 'Colombo'      },
    ],
  },
  about: DEFAULT_ABOUT_DATA,
};

/* ─────────────────────────────────────────
   MERGE HELPER
───────────────────────────────────────── */
function mergeSiteData(saved: any): SayoSiteData {
  const safe = saved && typeof saved === 'object' ? saved : {};
  return {
    home: {
      ...DEFAULT_SITE_DATA.home, ...(safe.home || {}),
      navItems: Array.isArray(safe.home?.navItems) && safe.home.navItems.length > 0
        ? safe.home.navItems : DEFAULT_SITE_DATA.home.navItems,
    },
    general: {
      ...DEFAULT_SITE_DATA.general, ...(safe.general || {}),
      quickLinks: Array.isArray(safe.general?.quickLinks) && safe.general.quickLinks.length > 0
        ? safe.general.quickLinks : DEFAULT_SITE_DATA.general.quickLinks,
      locations: Array.isArray(safe.general?.locations) && safe.general.locations.length > 0
        ? safe.general.locations : DEFAULT_SITE_DATA.general.locations,
      socialLinks: { ...DEFAULT_SITE_DATA.general.socialLinks, ...(safe.general?.socialLinks || {}) },
    },
    services: {
      ...DEFAULT_SITE_DATA.services, ...(safe.services || {}),
      genderOptions: Array.isArray(safe.services?.genderOptions) && safe.services.genderOptions.length > 0
        ? safe.services.genderOptions : DEFAULT_SITE_DATA.services.genderOptions,
      categories: Array.isArray(safe.services?.categories) && safe.services.categories.length > 0
        ? safe.services.categories : DEFAULT_SITE_DATA.services.categories,
      priceList: {
        her: { ...DEFAULT_SITE_DATA.services.priceList.her, ...(safe.services?.priceList?.her || {}) },
        his: { ...DEFAULT_SITE_DATA.services.priceList.his, ...(safe.services?.priceList?.his || {}) },
      },
    },
    reviews: {
      ...DEFAULT_SITE_DATA.reviews, ...(safe.reviews || {}),
      reviews: Array.isArray(safe.reviews?.reviews) && safe.reviews.reviews.length > 0
        ? safe.reviews.reviews : DEFAULT_SITE_DATA.reviews.reviews,
    },
    about: {
      ...DEFAULT_ABOUT_DATA, ...(safe.about || {}),
      gallery: { ...DEFAULT_ABOUT_DATA.gallery, ...(safe.about?.gallery || {}) },
      staff: Array.isArray(safe.about?.staff) && safe.about.staff.length > 0
        ? safe.about.staff : DEFAULT_ABOUT_DATA.staff,
      reviews: Array.isArray(safe.about?.reviews) && safe.about.reviews.length > 0
        ? safe.about.reviews : DEFAULT_ABOUT_DATA.reviews,
    },
  };
}

/* ─────────────────────────────────────────
   LOCAL STORAGE HELPERS
───────────────────────────────────────── */
function saveToLocalStorage(data: SayoSiteData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

function loadFromLocalStorage(): SayoSiteData | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return mergeSiteData(JSON.parse(raw));
  } catch (e) {
    console.warn('LocalStorage load failed:', e);
  }
  return null;
}

function clearLocalStorage(): void {
  try { localStorage.removeItem(LOCAL_STORAGE_KEY); } catch {}
}

/* ─────────────────────────────────────────
   IMAGE PREVIEW COMPONENT
───────────────────────────────────────── */
function ImagePreview({
  src, onSrcChange, size = 72, label,
}: {
  src: string; onSrcChange?: (newSrc: string) => void; size?: number; label?: string;
}) {
  const [error, setError]     = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => { setError(false); }, [src]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result && onSrcChange) onSrcChange(result);
    };
    reader.readAsDataURL(file);
  }, [onSrcChange]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const hasImage = src && src.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
      {label && (
        <span style={{ fontSize: '0.65rem', color: tokens.color.whiteFaint, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          width: `${size}px`, height: `${size}px`,
          borderRadius: '0.6rem',
          border: dragging ? `2px dashed ${tokens.color.gold}` : hasImage && !error ? `2px solid ${tokens.color.goldBorder}` : `2px dashed rgba(255,255,255,0.15)`,
          background: dragging ? 'rgba(184,134,11,0.1)' : 'rgba(0,0,0,0.4)',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative',
          cursor: onSrcChange ? 'pointer' : 'default',
          transition: 'border-color 0.2s, background 0.2s',
        }}
      >
        {hasImage && !error ? (
          <img src={src} alt="preview" onError={() => setError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', padding: '0.4rem' }}>
            <div style={{ fontSize: error ? '1.25rem' : '1.5rem', marginBottom: '0.2rem' }}>
              {error ? '⚠️' : onSrcChange ? '📷' : '🖼️'}
            </div>
            <div style={{ fontSize: '0.55rem', color: tokens.color.whiteFaint, lineHeight: 1.3 }}>
              {error ? 'Not found' : onSrcChange ? 'Drop image' : 'No image'}
            </div>
          </div>
        )}
        {onSrcChange && hasImage && !error && (
          <label
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, cursor: 'pointer', transition: 'opacity 0.2s', fontSize: '0.65rem', color: '#fff', fontWeight: 600, flexDirection: 'column', gap: '0.2rem' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
          >
            <span style={{ fontSize: '1.1rem' }}>📷</span>Replace
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </label>
        )}
        {onSrcChange && (!hasImage || error) && (
          <label style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </label>
        )}
      </div>
      {hasImage && (
        <span style={{
          fontSize: '0.6rem', fontWeight: 600, padding: '0.1rem 0.4rem', borderRadius: '999px',
          background: error ? 'rgba(229,62,62,0.2)' : 'rgba(56,161,105,0.2)',
          color: error ? '#fc8181' : '#68d391',
          border: `1px solid ${error ? 'rgba(229,62,62,0.4)' : 'rgba(56,161,105,0.4)'}`,
        }}>
          {error ? '✗ broken' : '✓ ok'}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   LIVE PREVIEW PANEL
───────────────────────────────────────── */
function LivePreviewPanel({
  open, onClose, data, activeTab,
}: {
  open: boolean; onClose: () => void; data: SayoSiteData; activeTab: string;
}) {
  const gold = tokens.color.gold;

  const PreviewNav = () => (
    <div style={{ background: 'rgba(40,40,40,0.95)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <span style={{ color: gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.12em' }}>{data.home.logoText}</span>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        {data.home.navItems.slice(0, 4).map((n) => (
          <span key={n.label} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.55rem', fontWeight: 500 }}>{n.label}</span>
        ))}
      </div>
      <span style={{ background: gold, color: '#fff', fontSize: '0.55rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>
        {data.home.contactButtonText}
      </span>
    </div>
  );

  const PreviewFooter = () => (
    <div style={{ background: '#1a1a1a', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '1rem' }}>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 100px' }}>
          <div style={{ color: gold, fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{data.general.brandName}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem', lineHeight: 1.5 }}>{data.general.brandTagline}</div>
        </div>
        <div style={{ flex: '1 1 80px' }}>
          <div style={{ color: gold, fontSize: '0.55rem', fontWeight: 700, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Links</div>
          {data.general.quickLinks.slice(0, 4).map((l) => (
            <div key={l.label} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem', marginBottom: '0.15rem' }}>{l.label}</div>
          ))}
        </div>
        <div style={{ flex: '1 1 80px' }}>
          <div style={{ color: gold, fontSize: '0.55rem', fontWeight: 700, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contact</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem', marginBottom: '0.15rem' }}>{data.general.contactPhone}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem', marginBottom: '0.15rem' }}>{data.general.contactEmail}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem' }}>{data.general.contactAddress}</div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.75rem', paddingTop: '0.5rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.5rem', textAlign: 'center' }}>
        {data.general.copyrightText}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return (
        <div>
          <PreviewNav />
          <div style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #282828 100%)', padding: '2rem 1rem', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(40,40,40,0.3))', zIndex: 1 }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ color: gold, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ display: 'inline-block', width: '20px', height: '1px', background: gold }} />{data.home.heroEyebrow}
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.2, margin: '0 0 0.6rem', maxWidth: '80%' }}>{data.home.heroHeading}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem', lineHeight: 1.6, margin: '0 0 0.8rem', maxWidth: '75%' }}>{data.home.heroBody}</p>
              <span style={{ background: gold, color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.35rem 0.8rem', borderRadius: '1rem', display: 'inline-block' }}>
                {data.home.heroCtaText} →
              </span>
            </div>
          </div>
          <PreviewFooter />
        </div>
      );
      case 'about': return (
        <div>
          <PreviewNav />
          <div style={{ background: 'linear-gradient(135deg, #0d0d12 0%, #1a1a22 100%)', padding: '1.5rem 1rem' }}>
            <div style={{ color: gold, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.15em', marginBottom: '0.5rem' }}>{data.about.heroEyebrow}</div>
            <h2 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.3, margin: '0 0 0.6rem' }}>{data.about.heroHeading}</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem', lineHeight: 1.6, margin: 0 }}>{data.about.heroBody}</p>
          </div>
          <div style={{ padding: '0.75rem 1rem', background: '#0a0a0c', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: gold, fontSize: '0.65rem', fontWeight: 600, marginBottom: '0.5rem', textAlign: 'center' }}>{data.about.gallerySectionTitle}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.3rem' }}>
              {(['img1','img2','img3','img4','img5'] as const).map((key) => (
                <div key={key} style={{ aspectRatio: '1', borderRadius: '0.3rem', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {data.about.gallery[key]
                    ? <img src={data.about.gallery[key]} alt={key} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>🖼️</div>
                  }
                </div>
              ))}
            </div>
          </div>
          <PreviewFooter />
        </div>
      );
      case 'services': return (
        <div>
          <PreviewNav />
          <div style={{ padding: '1.5rem 1rem', background: 'linear-gradient(135deg, #0d0d12 0%, #141418 100%)' }}>
            <h2 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.4rem', textAlign: 'center' }}>{data.services.heroTitle}</h2>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.75rem' }}>
              {data.services.categories.map((c) => (
                <span key={c.key} style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: '0.55rem', padding: '0.2rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)' }}>{c.label}</span>
              ))}
            </div>
          </div>
          <PreviewFooter />
        </div>
      );
      case 'reviews': return (
        <div>
          <PreviewNav />
          <div style={{ padding: '1.5rem 1rem', background: 'linear-gradient(135deg, #0d0d12 0%, #141418 100%)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, margin: '0.5rem 0 0.3rem' }}>
                {data.reviews.heroTitleStart} <span style={{ color: gold }}>{data.reviews.heroTitleGold}</span>
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.reviews.reviews.slice(0, 2).map((r) => (
                <div key={r.id} style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(184,134,11,0.2)', border: `1px solid ${gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: gold, fontSize: '0.5rem', fontWeight: 700 }}>{r.avatar}</div>
                    <div style={{ color: '#fff', fontSize: '0.58rem', fontWeight: 600 }}>{r.name}</div>
                    <span style={{ marginLeft: 'auto', background: 'rgba(184,134,11,0.12)', color: gold, fontSize: '0.5rem', padding: '0.1rem 0.35rem', borderRadius: '999px' }}>{r.service}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.56rem', lineHeight: 1.5, margin: 0 }}>&ldquo;{r.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
          <PreviewFooter />
        </div>
      );
      case 'general': return (
        <div>
          <PreviewNav />
          <div style={{ padding: '1.5rem 1rem', background: '#0d0d12' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', textAlign: 'center' }}>
              General & footer settings apply site-wide.
            </div>
          </div>
          <PreviewFooter />
        </div>
      );
      default: return null;
    }
  };

  const TAB_LABELS: Record<string, string> = {
    home: '🏠 Home Page', about: '📖 Our Story',
    services: '💇‍♀️ Services', reviews: '⭐ Reviews', general: '📍 General',
  };

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} />}
      <div style={{
        position: 'fixed', top: 0, right: 0, zIndex: 201,
        width: '380px', maxWidth: '95vw', height: '100vh',
        background: '#0e0e14',
        borderLeft: `1px solid ${tokens.color.goldBorder}`,
        boxShadow: '-20px 0 60px rgba(0,0,0,0.7)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'rgba(184,134,11,0.12)', borderBottom: `1px solid ${tokens.color.goldBorder}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: tokens.color.gold, letterSpacing: '0.04em' }}>👁️ Live Preview</div>
            <div style={{ fontSize: '0.7rem', color: tokens.color.whiteDim, marginTop: '0.1rem' }}>{TAB_LABELS[activeTab]} · Updates as you edit</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${tokens.color.whiteBorder}`, color: '#fff', width: '30px', height: '30px', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', color: '#fff', fontFamily: tokens.font.family }}>{renderContent()}</div>
        <div style={{ padding: '0.6rem 1rem', borderTop: `1px solid rgba(255,255,255,0.06)`, background: '#0a0a0c', flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: '0.65rem', color: tokens.color.whiteFaint, textAlign: 'center' }}>
            ℹ️ Scaled preview — actual site may differ slightly
          </p>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   COMMON STYLES
───────────────────────────────────────── */
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? '#B8860B' : 'none'} stroke="#B8860B" strokeWidth="1.8">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const GENDER_ICON_MAP: Record<string, string> = { her: '🌸', his: '🤵' };

const inputStyle: React.CSSProperties = {
  width: '100%', background: tokens.color.bgInput,
  border: `1px solid ${tokens.color.whiteBorder}`,
  color: tokens.color.white,
  padding: '0.75rem 1rem', borderRadius: '0.5rem',
  fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.2s', boxSizing: 'border-box',
};
const smallIconBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)', color: '#fff',
  border: `1px solid ${tokens.color.whiteBorder}`,
  borderRadius: '0.4rem', padding: '0.3rem 0.5rem', fontSize: '0.75rem',
};
const sectionCard: React.CSSProperties = {
  background: tokens.color.bgCard,
  border: `1px solid ${tokens.color.whiteBorder}`,
  borderRadius: '1.25rem', padding: '2rem',
};
const sectionTitle: React.CSSProperties = {
  fontSize: '1.25rem', fontWeight: 600, color: tokens.color.gold,
  marginBottom: '0.4rem', marginTop: 0,
};
const sectionDesc: React.CSSProperties = {
  color: tokens.color.whiteDim, fontSize: '0.85rem',
  marginBottom: '1.5rem', marginTop: 0,
};
const fieldLabel: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 600,
  color: tokens.color.whiteMuted, marginBottom: '0.4rem',
};

function AdminLogoIcon({ size = 42 }: { size?: number }) {
  return (
    <div style={{ width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Image src="/sayologo.png" alt="SAYO Logo" width={size} height={size} style={{ width: '100%', height: '100%', objectFit: 'contain' }} priority />
    </div>
  );
}

/* ─────────────────────────────────────────
   ✅ LOGIN SCREEN — CLIENT SIDE ONLY
   No API calls, works on Netlify perfectly
───────────────────────────────────────── */
function AdminLoginScreen({ onLoginSuccess }: { onLoginSuccess: (username: string) => void }) {
  const [username,     setUsername]     = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [shake,        setShake]        = useState(false);
  const [loading,      setLoading]      = useState(false);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  // ✅ CLIENT-SIDE AUTH — No API, No network, Works everywhere
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      triggerShake();
      return;
    }

    setLoading(true);

    // Small UX delay to feel like verification is happening
    await new Promise(resolve => setTimeout(resolve, 700));

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        sessionStorage.setItem('admin_username', username.trim());
      } catch {}
      setLoading(false);
      onLoginSuccess(username.trim());
    } else {
      setLoading(false);
      setError('Invalid username or password. Please try again.');
      triggerShake();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: tokens.color.bgDark,
      backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(184,134,11,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(184,134,11,0.06) 0%, transparent 50%)',
      color: tokens.color.white, fontFamily: tokens.font.family,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <style>{`
        @keyframes shakeAnim { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes fadeUpLogin { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .login-shake { animation: shakeAnim 0.5s ease }
        .login-card  { animation: fadeUpLogin 0.6s cubic-bezier(0.16,1,0.3,1) both }
        .login-input:focus { border-color: #B8860B !important; box-shadow: 0 0 0 3px rgba(184,134,11,0.15) !important; outline: none !important }
      `}</style>

      <div
        className={`login-card ${shake ? 'login-shake' : ''}`}
        style={{
          width: '100%', maxWidth: '420px',
          background: tokens.color.bgCard,
          border: `1px solid ${tokens.color.goldBorder}`,
          borderRadius: '1.5rem',
          padding: 'clamp(2rem, 5vw, 2.75rem)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.6)',
        }}
      >
        {/* Logo */}
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
              type="text" className="login-input"
              value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              style={inputStyle} autoComplete="username" autoFocus disabled={loading}
            />
          </div>

          <div>
            <label style={fieldLabel}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'} className="login-input"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                style={{ ...inputStyle, paddingRight: '3rem' }}
                autoComplete="current-password" disabled={loading}
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: tokens.color.whiteFaint, cursor: 'pointer', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
              >
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.4)', color: '#fc8181', padding: '0.7rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              background: loading ? 'rgba(184,134,11,0.5)' : 'linear-gradient(135deg, #B8860B 0%, #d4a017 100%)',
              border: 'none', color: '#fff',
              padding: '0.85rem 1.5rem', borderRadius: '0.6rem',
              fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.4rem',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(184,134,11,0.4)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Verifying...
              </>
            ) : '🔐 Sign In to Admin Portal'}
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
   MAIN ADMIN PORTAL
───────────────────────────────────────── */
export default function SayoAdminPage() {
  const [authChecked,     setAuthChecked]     = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername,   setAdminUsername]   = useState('');
  const [isSaving,        setIsSaving]        = useState(false);
  const [isLoadingData,   setIsLoadingData]   = useState(false);
  const [data,            setData]            = useState<SayoSiteData>(DEFAULT_SITE_DATA);
  const [activeTab,       setActiveTab]       = useState<'home' | 'about' | 'services' | 'reviews' | 'general'>('home');
  const [toastMessage,    setToastMessage]    = useState<string | null>(null);
  const [previewOpen,     setPreviewOpen]     = useState(false);
  const [dataSource,      setDataSource]      = useState<'localStorage' | 'defaults'>('defaults');

  // Services sub-state
  const [serviceGender,   setServiceGender]   = useState<'her' | 'his'>('her');
  const [serviceCategory, setServiceCategory] = useState<string>('WAX');

  // Reviews sub-state
  const [reviewFilter,    setReviewFilter]    = useState<string>('All');
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [newReviewModal,  setNewReviewModal]  = useState<boolean>(false);
  const [reviewForm,      setReviewForm]      = useState<Omit<ReviewItem, 'id'>>({
    name: '', avatar: '', rating: 5,
    date: new Date().toISOString().split('T')[0],
    service: 'Facial Treatment', comment: '', location: 'Colombo',
  });

  // About sub-state
  const [aboutSection,          setAboutSection]          = useState<'hero' | 'team' | 'gallery' | 'reviews'>('hero');
  const [editingStaffId,        setEditingStaffId]        = useState<number | null>(null);
  const [staffModal,            setStaffModal]            = useState<boolean>(false);
  const [staffForm,             setStaffForm]             = useState<Omit<StaffMember, 'id'>>({ name: '', role: '', experience: '', image: '', bio: '', specialties: '' });
  const [editingAboutReviewIdx, setEditingAboutReviewIdx] = useState<number | null>(null);
  const [aboutReviewModal,      setAboutReviewModal]      = useState<boolean>(false);
  const [aboutReviewForm,       setAboutReviewForm]       = useState<AboutReview>({ quote: '', author: '' });

  /* ── Session check on mount ── */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(AUTH_SESSION_KEY) === 'true') {
        setIsAuthenticated(true);
        setAdminUsername(sessionStorage.getItem('admin_username') || 'admin');
      }
    } catch {}
    setAuthChecked(true);
  }, []);

  /* ── Load data from localStorage after auth ── */
  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoadingData(true);
    try {
      const localData = loadFromLocalStorage();
      if (localData) {
        setData(localData);
        setDataSource('localStorage');
      } else {
        setData(DEFAULT_SITE_DATA);
        setDataSource('defaults');
      }
    } catch {
      setData(DEFAULT_SITE_DATA);
      setDataSource('defaults');
    }
    setIsLoadingData(false);
  }, [isAuthenticated]);

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      sessionStorage.removeItem('admin_username');
    } catch {}
    setIsAuthenticated(false);
    setAdminUsername('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  /* ── Save to localStorage only ── */
  const handleSaveAll = () => {
    setIsSaving(true);
    try {
      saveToLocalStorage(data);
      setDataSource('localStorage');
      setTimeout(() => {
        setIsSaving(false);
        showToast('✅ All changes saved to browser storage!');
      }, 500);
    } catch {
      setIsSaving(false);
      showToast('❌ Failed to save. Storage may be full.');
    }
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset ALL pages to default SAYO data? This will also clear saved data.')) return;
    clearLocalStorage();
    setData(DEFAULT_SITE_DATA);
    setDataSource('defaults');
    showToast('🔄 Reset to default data!');
  };

  /* ── Nav helpers ── */
  const updateNavItem = (idx: number, field: keyof NavItem, value: string) => {
    const u = [...data.home.navItems]; u[idx] = { ...u[idx], [field]: value };
    setData({ ...data, home: { ...data.home, navItems: u } });
  };
  const addNavItem    = () => setData({ ...data, home: { ...data.home, navItems: [...data.home.navItems, { label: 'NEW LINK', href: '/' }] } });
  const removeNavItem = (idx: number) => setData({ ...data, home: { ...data.home, navItems: data.home.navItems.filter((_, i) => i !== idx) } });
  const moveNavItem   = (idx: number, dir: -1 | 1) => {
    const u = [...data.home.navItems]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]];
    setData({ ...data, home: { ...data.home, navItems: u } });
  };

  /* ── Quick Link helpers ── */
  const updateQuickLink = (idx: number, field: keyof QuickLink, value: string) => {
    const u = [...data.general.quickLinks]; u[idx] = { ...u[idx], [field]: value };
    setData({ ...data, general: { ...data.general, quickLinks: u } });
  };
  const addQuickLink    = () => setData({ ...data, general: { ...data.general, quickLinks: [...data.general.quickLinks, { label: 'New Link', href: '/' }] } });
  const removeQuickLink = (idx: number) => setData({ ...data, general: { ...data.general, quickLinks: data.general.quickLinks.filter((_, i) => i !== idx) } });
  const moveQuickLink   = (idx: number, dir: -1 | 1) => {
    const u = [...data.general.quickLinks]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]];
    setData({ ...data, general: { ...data.general, quickLinks: u } });
  };

  /* ── Gender helpers ── */
  const updateGenderLabel = (key: string, label: string) => {
    const opts = data.services.genderOptions || DEFAULT_SITE_DATA.services.genderOptions;
    setData({ ...data, services: { ...data.services, genderOptions: opts.map((g) => g.key === key ? { ...g, label } : g) } });
  };

  /* ── Category helpers ── */
  const updateCategory = (idx: number, field: 'label' | 'image', value: string) => {
    const u = [...data.services.categories]; u[idx] = { ...u[idx], [field]: value };
    setData({ ...data, services: { ...data.services, categories: u } });
  };
  const addCategory = () => {
    const k = `CAT_${Date.now()}`;
    setData({ ...data, services: { ...data.services, categories: [...data.services.categories, { key: k, label: 'New Category', image: 'https://placehold.co/487x582?text=New' }], priceList: { her: { ...data.services.priceList.her, [k]: [] }, his: { ...data.services.priceList.his, [k]: [] } } } });
    showToast('✅ New category added!');
  };
  const removeCategory = (idx: number) => {
    const k = data.services.categories[idx].key;
    if (!window.confirm(`Delete category "${data.services.categories[idx].label}"?`)) return;
    const cats = data.services.categories.filter((_, i) => i !== idx);
    const her  = { ...data.services.priceList.her }; delete her[k];
    const his  = { ...data.services.priceList.his }; delete his[k];
    setData({ ...data, services: { ...data.services, categories: cats, priceList: { her, his } } });
    if (serviceCategory === k && cats.length > 0) setServiceCategory(cats[0].key);
    showToast('🗑️ Category removed!');
  };
  const moveCategory = (idx: number, dir: -1 | 1) => {
    const u = [...data.services.categories]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]];
    setData({ ...data, services: { ...data.services, categories: u } });
  };

  /* ── Staff helpers ── */
  const openAddStaff  = () => { setEditingStaffId(null); setStaffForm({ name: '', role: '', experience: '', image: '', bio: '', specialties: '' }); setStaffModal(true); };
  const openEditStaff = (m: StaffMember) => { setEditingStaffId(m.id); setStaffForm({ name: m.name, role: m.role, experience: m.experience, image: m.image, bio: m.bio, specialties: m.specialties }); setStaffModal(true); };
  const saveStaff = () => {
    if (!staffForm.name.trim()) { alert('Name is required.'); return; }
    if (editingStaffId !== null) {
      setData({ ...data, about: { ...data.about, staff: data.about.staff.map((s) => s.id === editingStaffId ? { ...staffForm, id: editingStaffId } : s) } });
      showToast('✏️ Staff member updated!');
    } else {
      const nextId = Math.max(0, ...data.about.staff.map((s) => s.id)) + 1;
      setData({ ...data, about: { ...data.about, staff: [...data.about.staff, { ...staffForm, id: nextId }] } });
      showToast('👤 New staff member added!');
    }
    setStaffModal(false);
  };
  const deleteStaff = (id: number) => { if (!window.confirm('Delete this staff member?')) return; setData({ ...data, about: { ...data.about, staff: data.about.staff.filter((s) => s.id !== id) } }); showToast('🗑️ Staff member removed!'); };
  const moveStaff   = (idx: number, dir: -1 | 1) => {
    const u = [...data.about.staff]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]];
    setData({ ...data, about: { ...data.about, staff: u } });
  };

  /* ── About review helpers ── */
  const openAddAboutReview  = () => { setEditingAboutReviewIdx(null); setAboutReviewForm({ quote: '', author: '' }); setAboutReviewModal(true); };
  const openEditAboutReview = (idx: number) => { setEditingAboutReviewIdx(idx); setAboutReviewForm({ ...data.about.reviews[idx] }); setAboutReviewModal(true); };
  const saveAboutReview = () => {
    if (!aboutReviewForm.quote.trim() || !aboutReviewForm.author.trim()) { alert('Quote and Author are required.'); return; }
    if (editingAboutReviewIdx !== null) {
      setData({ ...data, about: { ...data.about, reviews: data.about.reviews.map((r, i) => i === editingAboutReviewIdx ? aboutReviewForm : r) } });
      showToast('✏️ Review updated!');
    } else {
      setData({ ...data, about: { ...data.about, reviews: [...data.about.reviews, aboutReviewForm] } });
      showToast('💬 Review added!');
    }
    setAboutReviewModal(false);
  };
  const deleteAboutReview = (idx: number) => { if (!window.confirm('Delete this review?')) return; setData({ ...data, about: { ...data.about, reviews: data.about.reviews.filter((_, i) => i !== idx) } }); showToast('🗑️ Review removed!'); };

  const safeGenderOptions = data.services?.genderOptions?.length ? data.services.genderOptions : DEFAULT_SITE_DATA.services.genderOptions;
  const safeCategories    = data.services?.categories?.length    ? data.services.categories    : DEFAULT_SITE_DATA.services.categories;

  const TABS = [
    { key: 'home',     label: '🏠 HOME PAGE',           count: null },
    { key: 'about',    label: '📖 OUR STORY',           count: data.about.staff.length },
    { key: 'services', label: '💇‍♀️ SERVICES & PRICES',  count: null },
    { key: 'reviews',  label: '⭐ CLIENT REVIEWS',       count: data.reviews.reviews.length },
    { key: 'general',  label: '📍 GENERAL & LOCATIONS', count: data.general.locations.length },
  ];

  const ABOUT_SECTIONS = [
    { key: 'hero',    label: '🌟 Hero Section' },
    { key: 'team',    label: '👤 Team Members' },
    { key: 'gallery', label: '🖼️ Gallery' },
    { key: 'reviews', label: '💬 Reviews Carousel' },
  ];

  /* ── Auth check loading ── */
  if (!authChecked) return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.color.bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: tokens.font.family }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '40px', height: '40px', border: `3px solid ${tokens.color.goldBorder}`, borderTopColor: tokens.color.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  /* ── Not authenticated ── */
  if (!isAuthenticated) return (
    <AdminLoginScreen onLoginSuccess={(username) => { setIsAuthenticated(true); setAdminUsername(username); }} />
  );

  /* ── Authenticated Dashboard ── */
  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.color.bgDark, color: tokens.color.white, fontFamily: tokens.font.family, paddingBottom: '4rem' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* TOAST */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '1.5rem', right: previewOpen ? '400px' : '1.5rem', zIndex: 9999, background: '#B8860B', color: '#fff', padding: '0.9rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', transition: 'right 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
          {toastMessage}
        </div>
      )}

      {/* LIVE PREVIEW */}
      <LivePreviewPanel open={previewOpen} onClose={() => setPreviewOpen(false)} data={data} activeTab={activeTab} />

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(14,14,18,0.88)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${tokens.color.whiteBorder}`, padding: '0.85rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AdminLogoIcon size={48} />
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, letterSpacing: '0.08em' }}>
              SAYO BEAUTY <span style={{ color: tokens.color.gold, fontWeight: 500 }}>ADMIN PORTAL</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: tokens.color.whiteDim, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {adminUsername ? `Logged in as: ${adminUsername}` : 'Content Manager'}
              <span style={{ color: dataSource === 'localStorage' ? '#68d391' : tokens.color.whiteFaint, fontWeight: 600 }}>
                · {dataSource === 'localStorage' ? '🟢 Saved Data' : '⚪ Default Data'}
              </span>
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setPreviewOpen(!previewOpen)} style={{ background: previewOpen ? 'rgba(184,134,11,0.25)' : 'rgba(255,255,255,0.05)', border: `1px solid ${previewOpen ? tokens.color.gold : tokens.color.whiteBorder}`, color: previewOpen ? tokens.color.gold : tokens.color.whiteMuted, padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
            👁️ {previewOpen ? 'Hide Preview' : 'Live Preview'}
          </button>
          <button onClick={handleResetDefaults} style={{ background: 'transparent', border: `1px solid ${tokens.color.whiteBorder}`, color: tokens.color.whiteMuted, padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer' }}>
            🔄 Reset
          </button>
          <button onClick={handleSaveAll} disabled={isSaving} style={{ background: isSaving ? 'rgba(184,134,11,0.5)' : 'linear-gradient(135deg, #B8860B 0%, #d4a017 100%)', border: 'none', color: '#fff', padding: '0.6rem 1.4rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer', boxShadow: isSaving ? 'none' : '0 4px 14px rgba(184,134,11,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? (
              <><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Saving...</>
            ) : '💾 Save All Changes'}
          </button>
          <button onClick={handleLogout} style={{ background: 'rgba(229,62,62,0.15)', border: '1px solid rgba(229,62,62,0.4)', color: '#fc8181', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Loading bar */}
      {isLoadingData && (
        <div style={{ background: 'rgba(184,134,11,0.1)', borderBottom: `1px solid ${tokens.color.goldBorder}`, padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: tokens.color.gold, fontSize: '0.82rem' }}>
          <span style={{ display: 'inline-block', width: '14px', height: '14px', border: `2px solid ${tokens.color.goldBorder}`, borderTopColor: tokens.color.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Loading saved data...
        </div>
      )}

      {/* TABS */}
      <nav style={{ background: '#121216', borderBottom: `1px solid ${tokens.color.whiteBorder}`, padding: '0 2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{ background: isActive ? 'rgba(184,134,11,0.18)' : 'transparent', border: 'none', borderBottom: isActive ? `3px solid ${tokens.color.gold}` : '3px solid transparent', color: isActive ? '#fff' : tokens.color.whiteDim, padding: '1rem 1.25rem', fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {tab.label}
              {tab.count !== null && (
                <span style={{ background: isActive ? tokens.color.gold : 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.7rem', padding: '0.12rem 0.5rem', borderRadius: '999px' }}>{tab.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '1240px', margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* ══ HOME TAB ══ */}
        {activeTab === 'home' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Navigation Bar</h2>
              <p style={sectionDesc}>Controls the logo text, nav links, and the Contact Us button.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                {[
                  { label: 'Logo Text', key: 'logoText' },
                  { label: 'Contact Button Text', key: 'contactButtonText' },
                  { label: 'Contact Button Link', key: 'contactButtonLink' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={fieldLabel}>{label}</label>
                    <input type="text" value={(data.home as any)[key]} onChange={(e) => setData({ ...data, home: { ...data.home, [key]: e.target.value } })} style={inputStyle} />
                  </div>
                ))}
              </div>

              {/* Nav items table */}
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', border: `1px solid ${tokens.color.whiteBorder}`, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '0.9rem 1.25rem', background: 'rgba(184,134,11,0.15)', borderBottom: `1px solid ${tokens.color.whiteBorder}`, fontWeight: 600, fontSize: '0.8rem', color: tokens.color.gold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div>Label</div><div>Link (Href)</div><div style={{ textAlign: 'center' }}>Action</div>
                </div>
                {data.home.navItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <input type="text" value={item.label} onChange={(e) => updateNavItem(idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    <input type="text" value={item.href}  onChange={(e) => updateNavItem(idx, 'href',  e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                      <button onClick={() => moveNavItem(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                      <button onClick={() => moveNavItem(idx,  1)} disabled={idx === data.home.navItems.length - 1} style={{ ...smallIconBtn, opacity: idx === data.home.navItems.length - 1 ? 0.3 : 1, cursor: idx === data.home.navItems.length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                      <button onClick={() => removeNavItem(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <button onClick={addNavItem} style={{ background: 'rgba(184,134,11,0.2)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>+ Add Nav Link</button>
                </div>
              </div>
            </section>

            <section style={sectionCard}>
              <h2 style={sectionTitle}>Hero Banner</h2>
              <p style={sectionDesc}>Update the main headline, tagline, and CTA button on the landing page.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Eyebrow Text', key: 'heroEyebrow', textarea: false },
                  { label: 'Main Heading', key: 'heroHeading', textarea: false },
                  { label: 'Body Description', key: 'heroBody', textarea: true },
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
                  <div><label style={fieldLabel}>CTA Button Text</label><input type="text" value={data.home.heroCtaText} onChange={(e) => setData({ ...data, home: { ...data.home, heroCtaText: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={fieldLabel}>CTA Button URL</label><input type="text"  value={data.home.heroCtaLink} onChange={(e) => setData({ ...data, home: { ...data.home, heroCtaLink: e.target.value } })} style={inputStyle} /></div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ══ ABOUT TAB ══ */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Sub-section pills */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {ABOUT_SECTIONS.map((s) => {
                const isActive = aboutSection === s.key;
                return (
                  <button key={s.key} onClick={() => setAboutSection(s.key as any)} style={{ background: isActive ? tokens.color.gold : 'rgba(255,255,255,0.05)', border: isActive ? `1px solid ${tokens.color.gold}` : `1px solid ${tokens.color.whiteBorder}`, color: '#fff', padding: '0.55rem 1.25rem', borderRadius: '999px', fontWeight: isActive ? 600 : 500, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {s.label}
                  </button>
                );
              })}
            </div>

            {aboutSection === 'hero' && (
              <section style={sectionCard}>
                <h2 style={sectionTitle}>Hero Section</h2>
                <p style={sectionDesc}>Edit the eyebrow, heading, and body paragraph on the About page.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div><label style={fieldLabel}>Eyebrow Text</label><input type="text" value={data.about.heroEyebrow} onChange={(e) => setData({ ...data, about: { ...data.about, heroEyebrow: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={fieldLabel}>Main Heading</label><input type="text" value={data.about.heroHeading} onChange={(e) => setData({ ...data, about: { ...data.about, heroHeading: e.target.value } })} style={inputStyle} /></div>
                  <div><label style={fieldLabel}>Body Paragraph</label><textarea rows={4} value={data.about.heroBody} onChange={(e) => setData({ ...data, about: { ...data.about, heroBody: e.target.value } })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                </div>
                {/* Mini preview */}
                <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #18181e 0%, #0d0d12 100%)', border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1rem', padding: '2rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '1rem', right: '1.25rem', background: 'rgba(184,134,11,0.2)', color: tokens.color.gold, fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '0.375rem' }}>PREVIEW</span>
                  <p style={{ color: tokens.color.gold, fontSize: '1.4rem', fontWeight: 600, margin: '0 0 0.75rem' }}>{data.about.heroEyebrow}</p>
                  <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 600, color: '#fff', lineHeight: 1.2, margin: '0 0 1rem', maxWidth: '560px' }}>{data.about.heroHeading}</h3>
                  <p style={{ color: tokens.color.whiteMuted, fontSize: '0.95rem', lineHeight: 1.7, margin: 0, maxWidth: '480px' }}>{data.about.heroBody}</p>
                </div>
              </section>
            )}

            {aboutSection === 'team' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section style={sectionCard}>
                  <h2 style={sectionTitle}>Team Section Title</h2>
                  <input type="text" value={data.about.teamSectionTitle} onChange={(e) => setData({ ...data, about: { ...data.about, teamSectionTitle: e.target.value } })} style={inputStyle} />
                </section>
                <section style={sectionCard}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                      <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Staff Members ({data.about.staff.length})</h2>
                      <p style={{ ...sectionDesc, marginBottom: 0, marginTop: '0.2rem' }}>Add, edit, or reorder team members.</p>
                    </div>
                    <button onClick={openAddStaff} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>+ Add Staff Member</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {data.about.staff.map((member, idx) => (
                      <div key={member.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tokens.color.whiteBorder}`, borderRadius: '1rem', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                        <ImagePreview src={member.image} size={56} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: tokens.color.gold }}>{member.name}</h3>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(184,134,11,0.15)', color: tokens.color.gold, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>{member.experience}</span>
                          </div>
                          <p style={{ margin: '0 0 0.35rem', fontSize: '0.82rem', color: tokens.color.whiteDim }}>{member.role}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: tokens.color.whiteFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '560px' }}>{member.bio}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flexShrink: 0 }}>
                          <button onClick={() => moveStaff(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                          <button onClick={() => moveStaff(idx,  1)} disabled={idx === data.about.staff.length - 1} style={{ ...smallIconBtn, opacity: idx === data.about.staff.length - 1 ? 0.3 : 1, cursor: idx === data.about.staff.length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                          <button onClick={() => openEditStaff(member)} style={{ ...smallIconBtn, cursor: 'pointer' }}>✏️</button>
                          <button onClick={() => deleteStaff(member.id)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️</button>
                        </div>
                      </div>
                    ))}
                    {data.about.staff.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: tokens.color.whiteFaint }}>No staff members yet.</div>}
                  </div>
                </section>
              </div>
            )}

            {aboutSection === 'gallery' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section style={sectionCard}>
                  <h2 style={sectionTitle}>Gallery Headings</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div><label style={fieldLabel}>Gallery Section Title</label><input type="text" value={data.about.gallerySectionTitle} onChange={(e) => setData({ ...data, about: { ...data.about, gallerySectionTitle: e.target.value } })} style={inputStyle} /></div>
                    <div><label style={fieldLabel}>Gallery Description</label><textarea rows={3} value={data.about.galleryDescription} onChange={(e) => setData({ ...data, about: { ...data.about, galleryDescription: e.target.value } })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                  </div>
                </section>
                <section style={sectionCard}>
                  <h2 style={sectionTitle}>Gallery Images</h2>
                  <p style={sectionDesc}>Update the 5 gallery images. Drag & drop or click to upload.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(['img1','img2','img3','img4','img5'] as const).map((key, i) => (
                      <div key={key} style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: '1rem', alignItems: 'center' }}>
                        <ImagePreview src={data.about.gallery[key]} onSrcChange={(newSrc) => setData({ ...data, about: { ...data.about, gallery: { ...data.about.gallery, [key]: newSrc } } })} size={80} label={`Image ${i + 1}`} />
                        <div>
                          <label style={fieldLabel}>Image {i + 1} Path / URL</label>
                          <input type="text" value={data.about.gallery[key]} onChange={(e) => setData({ ...data, about: { ...data.about, gallery: { ...data.about.gallery, [key]: e.target.value } } })} style={inputStyle} placeholder={`/Rectangle 3${i + 2}.jpg`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {aboutSection === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section style={sectionCard}>
                  <h2 style={sectionTitle}>Reviews Section Title</h2>
                  <input type="text" value={data.about.reviewSectionTitle} onChange={(e) => setData({ ...data, about: { ...data.about, reviewSectionTitle: e.target.value } })} style={inputStyle} />
                </section>
                <section style={sectionCard}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Carousel Reviews ({data.about.reviews.length})</h2>
                    <button onClick={openAddAboutReview} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>+ Add Review</button>
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
                    {data.about.reviews.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: tokens.color.whiteFaint }}>No reviews yet.</div>}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* ══ SERVICES TAB ══ */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Services Page Headline</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                <div><label style={fieldLabel}>Hero Title</label><input type="text" value={data.services.heroTitle} onChange={(e) => setData({ ...data, services: { ...data.services, heroTitle: e.target.value } })} style={inputStyle} /></div>
                <div><label style={fieldLabel}>Section Intro</label><input type="text" value={data.services.sectionIntro} onChange={(e) => setData({ ...data, services: { ...data.services, sectionIntro: e.target.value } })} style={inputStyle} /></div>
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <label style={fieldLabel}>Hero Subtitle</label>
                <textarea rows={3} value={data.services.heroSubtitle} onChange={(e) => setData({ ...data, services: { ...data.services, heroSubtitle: e.target.value } })} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </section>

            <section style={sectionCard}>
              <h2 style={sectionTitle}>Gender Tab Labels</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {safeGenderOptions.map((g) => (
                  <div key={g.key}>
                    <label style={fieldLabel}>{GENDER_ICON_MAP[g.key] || '👤'} Label for "{g.key}"</label>
                    <input type="text" value={g.label} onChange={(e) => updateGenderLabel(g.key, e.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
            </section>

            <section style={sectionCard}>
              <h2 style={sectionTitle}>Category Manager ({safeCategories.length})</h2>
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', border: `1px solid ${tokens.color.whiteBorder}`, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '88px 90px 1fr 1fr 140px', padding: '0.9rem 1.25rem', background: 'rgba(184,134,11,0.15)', borderBottom: `1px solid ${tokens.color.whiteBorder}`, fontWeight: 600, fontSize: '0.8rem', color: tokens.color.gold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <div>Preview</div><div>Key</div><div>Label</div><div>Image URL</div><div style={{ textAlign: 'center' }}>Action</div>
                </div>
                {safeCategories.map((cat, idx) => (
                  <div key={cat.key} style={{ display: 'grid', gridTemplateColumns: '88px 90px 1fr 1fr 140px', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <ImagePreview src={cat.image} onSrcChange={(newSrc) => updateCategory(idx, 'image', newSrc)} size={60} />
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
                  <button onClick={addCategory} style={{ background: 'rgba(184,134,11,0.2)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>+ Add Category</button>
                </div>
              </div>
            </section>

            <section style={sectionCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: tokens.color.gold, margin: 0 }}>Price List Manager</h3>
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
                  <div>Service Name</div><div>Primary Price</div><div>Promo Price</div><div style={{ textAlign: 'center' }}>Del</div>
                </div>
                {(data.services.priceList[serviceGender][serviceCategory] || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 140px 60px', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <input type="text" value={item.name}       onChange={(e) => { const n = { ...data.services.priceList }; n[serviceGender][serviceCategory][idx].name   = e.target.value; setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    <input type="text" value={item.price1}     onChange={(e) => { const n = { ...data.services.priceList }; n[serviceGender][serviceCategory][idx].price1 = e.target.value; setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    <input type="text" value={item.price2||''} onChange={(e) => { const n = { ...data.services.priceList }; n[serviceGender][serviceCategory][idx].price2 = e.target.value; setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} placeholder="Optional" />
                    <div style={{ textAlign: 'center' }}>
                      <button onClick={() => { const n = { ...data.services.priceList }; n[serviceGender][serviceCategory] = n[serviceGender][serviceCategory].filter((_, i) => i !== idx); setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.35rem 0.6rem', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <button onClick={() => { const n = { ...data.services.priceList }; const cur = n[serviceGender][serviceCategory] || []; n[serviceGender][serviceCategory] = [...cur, { name: 'New Service', price1: '3,000.00' }]; setData({ ...data, services: { ...data.services, priceList: n } }); }} style={{ background: 'rgba(184,134,11,0.2)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                    + Add Service to {safeCategories.find((c) => c.key === serviceCategory)?.label}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ══ REVIEWS TAB ══ */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Reviews Page Header</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                {[
                  { label: 'Eyebrow Text', key: 'heroEyebrow' },
                  { label: 'Title Start', key: 'heroTitleStart' },
                  { label: 'Title Gold Part', key: 'heroTitleGold' },
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: tokens.color.gold, margin: 0 }}>
                  Client Reviews ({data.reviews.reviews.length})
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)} style={{ background: tokens.color.bgInput, border: `1px solid ${tokens.color.whiteBorder}`, color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                    <option value="All">All Locations</option>
                    {data.general.locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                  <button onClick={() => { setEditingReviewId(null); setReviewForm({ name: '', avatar: '', rating: 5, date: new Date().toISOString().split('T')[0], service: 'Facial Treatment', comment: '', location: 'Colombo' }); setNewReviewModal(true); }} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>+ Add Review</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {data.reviews.reviews.filter((r) => reviewFilter === 'All' || r.location === reviewFilter).map((rev) => (
                  <div key={rev.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tokens.color.whiteBorder}`, borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(184,134,11,0.25)', border: '1px solid #B8860B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#B8860B' }}>{rev.avatar}</div>
                          <div><h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{rev.name}</h4><span style={{ fontSize: '0.72rem', color: tokens.color.whiteFaint }}>{rev.date}</span></div>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map((s) => <StarIcon key={s} filled={s <= rev.rating} />)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(184,134,11,0.15)', color: tokens.color.gold, padding: '0.15rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>{rev.service}</span>
                        <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', color: tokens.color.whiteDim, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>📍 {rev.location}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: tokens.color.whiteDim, lineHeight: 1.6, margin: 0 }}>&ldquo;{rev.comment}&rdquo;</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem' }}>
                      <button onClick={() => { setEditingReviewId(rev.id); setReviewForm({ name: rev.name, avatar: rev.avatar, rating: rev.rating, date: rev.date, service: rev.service, comment: rev.comment, location: rev.location }); setNewReviewModal(true); }} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>✏️ Edit</button>
                      <button onClick={() => { if (window.confirm(`Delete review by "${rev.name}"?`)) setData({ ...data, reviews: { ...data.reviews, reviews: data.reviews.reviews.filter((item) => item.id !== rev.id) } }); }} style={{ background: 'rgba(229,62,62,0.15)', color: '#fc8181', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ══ GENERAL TAB ══ */}
        {activeTab === 'general' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Brand &amp; Footer Info</h2>
              <p style={sectionDesc}>Appears on all page footers site-wide.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Brand Name', key: 'brandName' },
                  { label: 'Brand Tagline', key: 'brandTagline' },
                  { label: 'Contact Phone', key: 'contactPhone' },
                  { label: 'Contact Email', key: 'contactEmail' },
                  { label: 'Contact Address', key: 'contactAddress' },
                  { label: 'Copyright Text', key: 'copyrightText' },
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
                <h2 style={sectionTitle}>Quick Links ({data.general.quickLinks.length})</h2>
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
                <h2 style={sectionTitle}>Locations ({data.general.locations.length})</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.general.locations.map((loc, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" value={loc} onChange={(e) => { const u = [...data.general.locations]; u[idx] = e.target.value; setData({ ...data, general: { ...data.general, locations: u } }); }} style={inputStyle} />
                      <button onClick={() => { const u = data.general.locations.filter((_, i) => i !== idx); setData({ ...data, general: { ...data.general, locations: u } }); }} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: 'none', padding: '0 0.8rem', borderRadius: '0.5rem', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, general: { ...data.general, locations: [...data.general.locations, 'New Location'] } })} style={{ background: 'rgba(184,134,11,0.18)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', marginTop: '0.4rem' }}>+ Add Location</button>
                </div>
              </section>

              <section style={sectionCard}>
                <h2 style={sectionTitle}>Social Media Links</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                  {[
                    { label: 'WhatsApp URL', key: 'whatsapp' },
                    { label: 'Facebook URL', key: 'facebook' },
                    { label: 'Instagram URL', key: 'instagram' },
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

      {/* ══ MODAL: CLIENT REVIEW ══ */}
      {newReviewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: tokens.color.bgCard, border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1.25rem', padding: '2rem', width: '100%', maxWidth: '520px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: tokens.color.gold, marginBottom: '1.5rem', marginTop: 0 }}>{editingReviewId ? '✏️ Edit Review' : '+ Add Review'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Client Name</label>
                  <input type="text" value={reviewForm.name} onChange={(e) => { const v = e.target.value; const p = v.trim().split(' '); const ini = p.length > 1 ? (p[0][0] + p[1][0]).toUpperCase() : v.slice(0, 2).toUpperCase(); setReviewForm({ ...reviewForm, name: v, avatar: ini }); }} placeholder="e.g. Anika Perera" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Initials</label>
                  <input type="text" value={reviewForm.avatar} onChange={(e) => setReviewForm({ ...reviewForm, avatar: e.target.value.toUpperCase() })} style={inputStyle} maxLength={3} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Service</label>
                  <input type="text" value={reviewForm.service} onChange={(e) => setReviewForm({ ...reviewForm, service: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Location</label>
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
                  <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Date</label>
                  <input type="date" value={reviewForm.date} onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Comment</label>
                <textarea rows={4} value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="What did the client say?" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => setNewReviewModal(false)} style={{ background: 'transparent', border: `1px solid ${tokens.color.whiteBorder}`, color: tokens.color.whiteDim, padding: '0.6rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer' }}>Cancel</button>
                <button
                  onClick={() => {
                    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) { alert('Name and Comment are required.'); return; }
                    if (editingReviewId) {
                      setData({ ...data, reviews: { ...data.reviews, reviews: data.reviews.reviews.map((r) => r.id === editingReviewId ? { ...reviewForm, id: editingReviewId } : r) } });
                      showToast('✏️ Review updated!');
                    } else {
                      const nextId = Math.max(0, ...data.reviews.reviews.map((r) => r.id)) + 1;
                      setData({ ...data, reviews: { ...data.reviews, reviews: [{ ...reviewForm, id: nextId }, ...data.reviews.reviews] } });
                      showToast('⭐ Review added!');
                    }
                    setNewReviewModal(false);
                  }}
                  style={{ background: 'linear-gradient(135deg, #B8860B 0%, #d4a017 100%)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  {editingReviewId ? 'Save Changes' : 'Add Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL: STAFF ══ */}
      {staffModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}>
          <div style={{ background: tokens.color.bgCard, border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1.25rem', padding: '2rem', width: '100%', maxWidth: '580px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)', margin: 'auto' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: tokens.color.gold, marginBottom: '1.5rem', marginTop: 0 }}>{editingStaffId !== null ? '✏️ Edit Staff Member' : '👤 Add Staff Member'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(255,255,255,0.03)', border: `1px solid ${tokens.color.whiteBorder}`, borderRadius: '0.75rem', padding: '1rem' }}>
                <ImagePreview src={staffForm.image} onSrcChange={(newSrc) => setStaffForm({ ...staffForm, image: newSrc })} size={72} label="Photo" />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 0.3rem', fontSize: '0.8rem', fontWeight: 600, color: tokens.color.whiteMuted }}>Profile Photo</p>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: tokens.color.whiteFaint, lineHeight: 1.5 }}>Click or drag & drop to upload. Or paste a URL below.</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Full Name *</label><input type="text" value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} style={inputStyle} /></div>
                <div><label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Role / Title</label><input type="text" value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })} style={inputStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Experience</label><input type="text" value={staffForm.experience} onChange={(e) => setStaffForm({ ...staffForm, experience: e.target.value })} style={inputStyle} /></div>
                <div><label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Image Path / URL</label><input type="text" value={staffForm.image} onChange={(e) => setStaffForm({ ...staffForm, image: e.target.value })} style={inputStyle} /></div>
              </div>
              <div><label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Bio</label><textarea rows={4} value={staffForm.bio} onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Specialties (comma separated)</label><input type="text" value={staffForm.specialties} onChange={(e) => setStaffForm({ ...staffForm, specialties: e.target.value })} style={inputStyle} /></div>
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

      {/* ══ MODAL: ABOUT REVIEW ══ */}
      {aboutReviewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: tokens.color.bgCard, border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1.25rem', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: tokens.color.gold, marginBottom: '1.5rem', marginTop: 0 }}>{editingAboutReviewIdx !== null ? '✏️ Edit Carousel Review' : '💬 Add Carousel Review'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Quote *</label>
                <textarea rows={4} value={aboutReviewForm.quote} onChange={(e) => setAboutReviewForm({ ...aboutReviewForm, quote: e.target.value })} placeholder={`"Include quote in quotation marks..."`} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: tokens.color.whiteMuted, marginBottom: '0.3rem' }}>Author *</label>
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