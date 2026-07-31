'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const tokens = {
  color: {
    gold:        '#B8860B',
    goldBorder:  'rgba(184,134,11,0.4)',
    bgDark:      '#0a0a0c',
    bgCard:      '#141418',
    bgInput:     '#0e0e12',
    white:       '#ffffff',
    whiteMuted:  'rgba(255,255,255,0.80)',
    whiteDim:    'rgba(255,255,255,0.60)',
    whiteFaint:  'rgba(255,255,255,0.30)',
    whiteBorder: 'rgba(255,255,255,0.12)',
  },
  font: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
} as const;

const ADMIN_USERNAME   = 'admin';
const ADMIN_PASSWORD   = 'sayo@2025';
const AUTH_SESSION_KEY = 'sayo_admin_auth_session';

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
export type NavItem   = { label: string; href: string };
export type QuickLink = { label: string; href: string };

export type NavData = {
  logo_text:        string;
  contact_btn_text: string;
  contact_btn_link: string;
  nav_items:        NavItem[];
};

export type HomeData = {
  hero_eyebrow:  string;
  hero_heading:  string;
  hero_body:     string;
  hero_cta_text: string;
  hero_cta_link: string;
};

export type FooterData = {
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

export type StaffMember = {
  name:        string;
  role:        string;
  experience:  string;
  bio:         string;
  specialties: string;
};

export type AboutReview = { quote: string; author: string };

export type AboutData = {
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

export type PriceItem = { name: string; price1: string; price2?: string };

// ── Dynamic category types ──
export type ServiceCategory = {
  key:   string; // auto-generated from label
  label: string; // admin editable
  image: string; // image path
};

export type ServicesData = {
  hero_heading:  string;
  hero_subtitle: string;
  categories:    ServiceCategory[];
  price_list:    Record<string, Record<string, PriceItem[]>>;
};

// ── Contact page types ──
export type StatItem = { value: string; label: string };

export type BranchLocation = {
  name:    string;
  address: string;
  phone:   string;
  email:   string;
  isHead:  boolean;
  mapHref: string;
};

export type ContactData = {
  hero_eyebrow:       string;
  hero_heading:       string;
  hero_subtitle:      string;
  cta_primary_text:   string;
  cta_secondary_text: string;
  phone_number:       string;
  email_address:      string;
  stats:              StatItem[];
  map_embed_src:      string;
  map_address:        string;
  map_open_href:      string;
  social_instagram:   string;
  social_facebook:    string;
  social_whatsapp:    string;
  branches:           BranchLocation[];
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

const HOME_DEFAULTS: HomeData = {
  hero_eyebrow:  'Experienced hair stylists',
  hero_heading:  'Enjoy Professional Beauty Services!',
  hero_body:     'Providing expert skin care advice & beauty services using natural products to cater for any skin.',
  hero_cta_text: 'Reserve Experience',
  hero_cta_link: '/contact',
};

const FOOTER_DEFAULTS: FooterData = {
  brand_name:      'SAYO',
  brand_tagline:   'We are experienced in making you more beautiful',
  contact_phone:   '+94 77 233 6233',
  contact_email:   'hello@sayobeauty.com',
  contact_address: '123 Galle Road, Colombo, Sri Lanka',
  copyright_text:  '© 2025 SAYO Beauty. All rights reserved.',
  locations:       ['Colombo', 'Negombo', 'Kiribathgoda'],
  quick_links: [
    { label: 'Home',      href: '/'         },
    { label: 'Our Story', href: '/about'    },
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
  hero_body:          'We will make your skin better and also more glowing skin.',
  team_section_title: 'Meet the Visionaries',
  staff: [
    { name: 'Hiruni Perera',   role: 'Lead Stylist & Founder', experience: '12+ Years', bio: 'Train-certified in London and Singapore.', specialties: 'Precision Haircuts, Balayage & Highlights' },
    { name: 'Aruna Ratnayake', role: 'Grooming Specialist',    experience: '10+ Years', bio: 'Bringing a sharp eye for detail.',          specialties: 'Precision Beard Sculpting' },
  ],
  gallery_section_title: 'Transformations & Artistry',
  gallery_description:   'Explore our latest work, behind-the-scenes moments, and client transformations.',
  review_section_title:  'What Our Clients Say',
  reviews: [
    { quote: '"Choosing SAYO was the best decision."',           author: 'Nimesha D.' },
    { quote: '"SAYO stands apart."',                             author: 'Sanduni R.' },
    { quote: '"Exceptional attention to detail."',               author: 'Kasun P.'   },
    { quote: '"From the moment you walk in, you feel looked after."', author: 'Dilani W.'  },
  ],
};

// ── Services categories default ──
const SERVICES_CATEGORIES_DEFAULT: ServiceCategory[] = [
  { key: 'WAX',    label: 'WAX',    image: '/cat-wax.jpg'    },
  { key: 'HAIR',   label: 'HAIR',   image: '/cat-hair.jpg'   },
  { key: 'SKIN',   label: 'SKIN',   image: '/cat-skin.jpg'   },
  { key: 'NAIL',   label: 'NAIL',   image: '/cat-nail.jpg'   },
  { key: 'BODY',   label: 'BODY',   image: '/cat-body.jpg'   },
  { key: 'BRIDAL', label: 'BRIDAL', image: '/cat-bridal.jpg' },
];

const SERVICES_DEFAULTS: ServicesData = {
  hero_heading:  'Tailored Treatments for Your Unique Glow',
  hero_subtitle: "Experience a symphony of precision and luxury. Our services are tailored to the individual, utilizing the world's most exclusive botanical formulas and advanced styling techniques.",
  categories:    SERVICES_CATEGORIES_DEFAULT,
  price_list: {
    her: {
      WAX:    [{ name: 'Full Arms Wax', price1: '2,500.00' }, { name: 'Full Legs Wax', price1: '3,500.00' }, { name: 'Underarm Wax', price1: '1,200.00' }, { name: 'Eyebrow Threading', price1: '800.00' }, { name: 'Full Body Wax', price1: '7,500.00' }],
      HAIR:   [{ name: 'Cut & Re-Style', price1: '4,200.00' }, { name: 'Fringe Cut', price1: '1,500.00' }, { name: 'Trim', price1: '1,500.00' }, { name: 'Blow Dry - Short', price1: '2,500.00' }, { name: 'Hair Wash & Blast Dry', price1: '2,100.00' }],
      SKIN:   [{ name: 'Classic Facial', price1: '3,000.00' }, { name: 'Gold Facial', price1: '6,500.00' }, { name: 'Skin Brightening', price1: '5,200.00' }, { name: 'Acne Treatment', price1: '4,800.00' }, { name: 'Anti-Aging Facial', price1: '7,200.00' }],
      NAIL:   [{ name: 'Classic Manicure', price1: '1,800.00' }, { name: 'Gel Manicure', price1: '3,200.00' }, { name: 'Classic Pedicure', price1: '2,200.00' }, { name: 'Gel Pedicure', price1: '3,800.00' }, { name: 'Nail Art (Per Set)', price1: '1,500.00' }],
      BODY:   [{ name: 'Full Body Massage', price1: '5,500.00' }, { name: 'Body Scrub', price1: '4,200.00' }, { name: 'Body Wrap', price1: '6,000.00' }, { name: 'Aromatherapy Massage', price1: '6,800.00' }, { name: 'Hot Stone Massage', price1: '7,500.00' }],
      BRIDAL: [{ name: 'Bridal Package - Full', price1: '45,000.00' }, { name: 'Bridal Hair & Makeup', price1: '18,000.00' }, { name: 'Pre-Bridal Package', price1: '22,000.00' }, { name: 'Trial Makeup', price1: '6,500.00' }, { name: 'Bridal Draping', price1: '5,000.00' }],
    },
    his: {
      WAX:    [{ name: 'Half Arms Wax', price1: '2,000.00' }, { name: 'Chest Wax', price1: '3,200.00' }, { name: 'Back Wax', price1: '3,600.00' }, { name: 'Full Legs Wax', price1: '4,000.00' }, { name: 'Beard Shaping', price1: '1,000.00' }],
      HAIR:   [{ name: 'Haircut - Classic', price1: '1,800.00' }, { name: 'Beard Trim', price1: '900.00' }, { name: 'Hair Wash', price1: '700.00' }, { name: 'Head Massage', price1: '1,500.00' }, { name: 'Hair Color', price1: '3,500.00' }],
      SKIN:   [{ name: 'Deep Cleansing Facial', price1: '3,500.00' }, { name: 'Skin Polishing', price1: '4,000.00' }, { name: 'Beard Care Facial', price1: '3,200.00' }, { name: 'Whitening Facial', price1: '4,800.00' }, { name: 'Detox Facial', price1: '5,500.00' }],
      NAIL:   [{ name: 'Basic Manicure', price1: '1,200.00' }, { name: 'Basic Pedicure', price1: '1,500.00' }, { name: 'Nail Trim & Buff', price1: '800.00' }, { name: 'Callus Removal', price1: '1,000.00' }, { name: 'Hand Spa', price1: '2,200.00' }],
      BODY:   [{ name: 'Deep Tissue Massage', price1: '6,000.00' }, { name: 'Body Scrub', price1: '4,000.00' }, { name: 'Sports Massage', price1: '6,500.00' }, { name: 'Back Massage', price1: '3,500.00' }, { name: 'Head & Shoulder Massage', price1: '2,800.00' }],
      BRIDAL: [{ name: 'Groom Package', price1: '25,000.00' }, { name: 'Groom Hair & Makeup', price1: '10,000.00' }, { name: 'Pre-Groom Package', price1: '14,000.00' }, { name: 'Groom Facial', price1: '4,500.00' }, { name: 'Groom Grooming', price1: '3,500.00' }],
    },
  },
};

// ── Contact page default ──
const CONTACT_DEFAULTS: ContactData = {
  hero_eyebrow:       'Luxury Concierge Experience',
  hero_heading:       'GET IN TOUCH',
  hero_subtitle:      'Experience personalized luxury tailored specifically for your needs. Our dedicated concierge team in Colombo is here to orchestrate your journey into refined elegance.',
  cta_primary_text:   'Send an Inquiry',
  cta_secondary_text: 'Call Us Now',
  phone_number:       '0772336233',
  email_address:      'info@sayobeauty.com',
  stats: [
    { value: '3',   label: 'Locations' },
    { value: '10+', label: 'Years of Excellence' },
    { value: '5K+', label: 'Happy Clients' },
  ],
  map_embed_src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0558055526335!2d79.85803897585825!3d6.883918893115073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bc5b891a4b5%3A0xc60aa90940280873!2s45%2C%203%20Galle%20Rd%2C%20Colombo%2000500!5e0!3m2!1sen!2slk!4v1785130068196!5m2!1sen!2slk',
  map_address:   'No. 45, Galle Road, Colombo 03, Sri Lanka',
  map_open_href: 'https://maps.google.com/?q=45+Galle+Rd+Colombo+00500+Sri+Lanka',
  social_instagram: '',
  social_facebook:  '',
  social_whatsapp:  '',
  branches: [
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
  ],
};

const GENDERS = ['her', 'his'] as const;
type GenderKey = typeof GENDERS[number];

/* ─────────────────────────────────────────
   COMMON STYLES
───────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width:      '100%',
  background: tokens.color.bgInput,
  border:     `1px solid ${tokens.color.whiteBorder}`,
  color:      tokens.color.white,
  padding:    '0.75rem 1rem',
  borderRadius: '0.5rem',
  fontSize:   '0.9rem',
  outline:    'none',
  transition: 'border-color 0.2s',
  boxSizing:  'border-box',
};

const smallIconBtn: React.CSSProperties = {
  background:   'rgba(255,255,255,0.08)',
  color:        '#fff',
  border:       `1px solid ${tokens.color.whiteBorder}`,
  borderRadius: '0.4rem',
  padding:      '0.3rem 0.5rem',
  fontSize:     '0.75rem',
  cursor:       'pointer',
};

const sectionCard: React.CSSProperties = {
  background:   tokens.color.bgCard,
  border:       `1px solid ${tokens.color.whiteBorder}`,
  borderRadius: '1.25rem',
  padding:      '2rem',
};

const sectionTitle: React.CSSProperties = {
  fontSize:     '1.25rem',
  fontWeight:   600,
  color:        tokens.color.gold,
  marginBottom: '0.4rem',
  marginTop:    0,
};

const sectionDesc: React.CSSProperties = {
  color:        tokens.color.whiteDim,
  fontSize:     '0.85rem',
  marginBottom: '1.5rem',
  marginTop:    0,
};

const fieldLabel: React.CSSProperties = {
  display:      'block',
  fontSize:     '0.8rem',
  fontWeight:   600,
  color:        tokens.color.whiteMuted,
  marginBottom: '0.4rem',
};

/* ─────────────────────────────────────────
   LOGO
───────────────────────────────────────── */
function AdminLogoIcon({ size = 42 }: { size?: number }) {
  return (
    <div style={{ width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Image src="/sayologo.png" alt="SAYO Logo" width={size} height={size} style={{ width: '100%', height: '100%', objectFit: 'contain' }} priority />
    </div>
  );
}

/* ─────────────────────────────────────────
   LOGIN SCREEN
───────────────────────────────────────── */
function AdminLoginScreen({ onLoginSuccess }: { onLoginSuccess: (u: string) => void }) {
  const [username,     setUsername]     = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [shake,        setShake]        = useState(false);
  const [loading,      setLoading]      = useState(false);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      triggerShake();
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
        sessionStorage.setItem('admin_username', username.trim());
      } catch {}
      setLoading(false);
      onLoginSuccess(username.trim());
    } else {
      setLoading(false);
      setError('Invalid username or password.');
      triggerShake();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.color.bgDark, backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(184,134,11,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(184,134,11,0.06) 0%, transparent 50%)', color: tokens.color.white, fontFamily: tokens.font.family, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <style>{`
        @keyframes shakeAnim { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes fadeUpLogin { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .login-shake { animation: shakeAnim 0.5s ease }
        .login-card  { animation: fadeUpLogin 0.6s cubic-bezier(0.16,1,0.3,1) both }
        .login-input:focus { border-color:#B8860B!important; box-shadow:0 0 0 3px rgba(184,134,11,0.15)!important; outline:none!important }
      `}</style>
      <div className={`login-card${shake ? ' login-shake' : ''}`} style={{ width: '100%', maxWidth: '420px', background: tokens.color.bgCard, border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1.5rem', padding: 'clamp(2rem,5vw,2.75rem)', boxShadow: '0 25px 70px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}><AdminLogoIcon size={80} /></div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.35rem', letterSpacing: '0.05em' }}>SAYO BEAUTY</h1>
          <p style={{ fontSize: '0.85rem', color: tokens.color.gold, margin: 0, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Admin Portal Access</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={fieldLabel}>Username</label>
            <input type="text" className="login-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter admin username" style={inputStyle} autoComplete="username" autoFocus disabled={loading} />
          </div>
          <div>
            <label style={fieldLabel}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} className="login-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" style={{ ...inputStyle, paddingRight: '3rem' }} autoComplete="current-password" disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: tokens.color.whiteFaint, cursor: 'pointer', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}>
                {showPassword ? '🙈 Hide' : '👁️ Show'}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.4)', color: '#fc8181', padding: '0.7rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 500 }}>
              ⚠️ {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={{ background: loading ? 'rgba(184,134,11,0.5)' : 'linear-gradient(135deg,#B8860B 0%,#d4a017 100%)', border: 'none', color: '#fff', padding: '0.85rem 1.5rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.4rem', boxShadow: loading ? 'none' : '0 8px 24px rgba(184,134,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading
              ? (<><span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Verifying...</>)
              : '🔐 Sign In to Admin Portal'}
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
   LIVE PREVIEW PANEL
───────────────────────────────────────── */
function LivePreviewPanel({ open, onClose, navData, homeData, footerData, activeTab }: {
  open: boolean; onClose: () => void;
  navData: NavData; homeData: HomeData; footerData: FooterData;
  activeTab: string;
}) {
  const gold = tokens.color.gold;

  const PreviewNav = () => (
    <div style={{ background: 'rgba(40,40,40,0.95)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <span style={{ color: gold, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.12em' }}>{navData.logo_text}</span>
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        {navData.nav_items.slice(0, 4).map(n => (
          <span key={n.label} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.55rem', fontWeight: 500 }}>{n.label}</span>
        ))}
      </div>
      <span style={{ background: gold, color: '#fff', fontSize: '0.55rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}>{navData.contact_btn_text}</span>
    </div>
  );

  const PreviewFooter = () => (
    <div style={{ background: '#1a1a1a', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '1rem' }}>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 100px' }}>
          <div style={{ color: gold, fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{footerData.brand_name}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem', lineHeight: 1.5 }}>{footerData.brand_tagline}</div>
        </div>
        <div style={{ flex: '1 1 80px' }}>
          <div style={{ color: gold, fontSize: '0.55rem', fontWeight: 700, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick Links</div>
          {footerData.quick_links.slice(0, 4).map(l => (
            <div key={l.label} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem', marginBottom: '0.15rem' }}>{l.label}</div>
          ))}
        </div>
        <div style={{ flex: '1 1 80px' }}>
          <div style={{ color: gold, fontSize: '0.55rem', fontWeight: 700, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contact</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem', marginBottom: '0.15rem' }}>{footerData.contact_phone}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem' }}>{footerData.contact_email}</div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.75rem', paddingTop: '0.5rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.5rem', textAlign: 'center' }}>
        {footerData.copyright_text}
      </div>
    </div>
  );

  const TAB_LABELS: Record<string, string> = {
    nav: '🧭 Navigation', home: '🏠 Home Hero',
    about: '📖 Our Story', services: '💅 Services', contact: '📞 Contact Page', footer: '📍 Footer',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'nav':
        return (
          <div>
            <PreviewNav />
            <div style={{ padding: '1.5rem', background: '#0d0d12', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textAlign: 'center' }}>Navigation bar preview above ↑</div>
            <PreviewFooter />
          </div>
        );
      case 'home':
        return (
          <div>
            <PreviewNav />
            <div style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#282828 100%)', padding: '2rem 1rem', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(40,40,40,0.3))', zIndex: 1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ color: gold, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{homeData.hero_eyebrow}</div>
                <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.2, margin: '0 0 0.6rem', maxWidth: '80%' }}>{homeData.hero_heading}</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem', lineHeight: 1.6, margin: '0 0 0.8rem', maxWidth: '75%' }}>{homeData.hero_body}</p>
                <span style={{ background: gold, color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '0.35rem 0.8rem', borderRadius: '1rem', display: 'inline-block' }}>{homeData.hero_cta_text} →</span>
              </div>
            </div>
            <PreviewFooter />
          </div>
        );
      case 'services':
        return (
          <div>
            <PreviewNav />
            <div style={{ padding: '1.5rem', background: '#0d0d12', color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>
              <div style={{ color: gold, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>SERVICES PAGE PREVIEW</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '1rem 0' }}>Services page content updates on save.</div>
            </div>
            <PreviewFooter />
          </div>
        );
      case 'about':
        return (
          <div>
            <PreviewNav />
            <div style={{ padding: '1.5rem', background: '#0d0d12', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textAlign: 'center' }}>About page content updates on save.</div>
            <PreviewFooter />
          </div>
        );
      case 'contact':
        return (
          <div>
            <PreviewNav />
            <div style={{ padding: '1.5rem', background: '#0d0d12', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textAlign: 'center' }}>Contact page content updates on save.</div>
            <PreviewFooter />
          </div>
        );
      case 'footer':
        return (
          <div>
            <PreviewNav />
            <div style={{ padding: '1rem', background: '#0d0d12', color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textAlign: 'center' }}>Footer preview below ↓</div>
            <PreviewFooter />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} />}
      <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 201, width: '380px', maxWidth: '95vw', height: '100vh', background: '#0e0e14', borderLeft: `1px solid ${tokens.color.goldBorder}`, boxShadow: '-20px 0 60px rgba(0,0,0,0.7)', transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'rgba(184,134,11,0.12)', borderBottom: `1px solid ${tokens.color.goldBorder}`, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: tokens.color.gold }}>👁️ Live Preview</div>
            <div style={{ fontSize: '0.7rem', color: tokens.color.whiteDim, marginTop: '0.1rem' }}>{TAB_LABELS[activeTab]} · Updates as you edit</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: `1px solid ${tokens.color.whiteBorder}`, color: '#fff', width: '30px', height: '30px', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', color: '#fff', fontFamily: tokens.font.family }}>
          {renderContent()}
        </div>
        <div style={{ padding: '0.6rem 1rem', borderTop: 'rgba(255,255,255,0.06) 1px solid', background: '#0a0a0c', flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: '0.65rem', color: tokens.color.whiteFaint, textAlign: 'center' }}>ℹ️ Scaled preview — actual site may differ slightly</p>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   MAIN ADMIN PAGE
───────────────────────────────────────── */
export default function SayoAdminPage() {
  const [authChecked,     setAuthChecked]     = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername,   setAdminUsername]   = useState('');

  const [navData,      setNavData]      = useState<NavData>(NAV_DEFAULTS);
  const [homeData,     setHomeData]     = useState<HomeData>(HOME_DEFAULTS);
  const [footerData,   setFooterData]   = useState<FooterData>(FOOTER_DEFAULTS);
  const [aboutData,    setAboutData]    = useState<AboutData>(ABOUT_DEFAULTS);
  const [servicesData, setServicesData] = useState<ServicesData>(SERVICES_DEFAULTS);
  const [contactData,  setContactData]  = useState<ContactData>(CONTACT_DEFAULTS);

  const [activeTab,    setActiveTab]    = useState<'nav' | 'home' | 'footer' | 'about' | 'services' | 'contact'>('nav');
  const [previewOpen,  setPreviewOpen]  = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);

  const [saving,  setSaving]  = useState({ nav: false, home: false, footer: false, about: false, services: false, contact: false });
  const [saved,   setSaved]   = useState({ nav: false, home: false, footer: false, about: false, services: false, contact: false });
  const [saveErr, setSaveErr] = useState({ nav: '', home: '', footer: '', about: '', services: '', contact: '' });

  // ── Services UI state ──
  const [svcGender,   setSvcGender]   = useState<GenderKey>('her');
  const [svcCategory, setSvcCategory] = useState<string>('');

  // ── Auto-select first category when categories load ──
  useEffect(() => {
    if (servicesData.categories.length > 0 && !svcCategory) {
      setSvcCategory(servicesData.categories[0].key);
    }
  }, [servicesData.categories, svcCategory]);

  // ── Auth check ──
  useEffect(() => {
    try {
      if (sessionStorage.getItem(AUTH_SESSION_KEY) === 'true') {
        setIsAuthenticated(true);
        setAdminUsername(sessionStorage.getItem('admin_username') || 'admin');
      }
    } catch {}
    setAuthChecked(true);
  }, []);

  // ── Load DB data ──
  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoading(true);
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
        if (data?.home) {
          setHomeData({
            hero_eyebrow:  data.home.hero_eyebrow  || HOME_DEFAULTS.hero_eyebrow,
            hero_heading:  data.home.hero_heading  || HOME_DEFAULTS.hero_heading,
            hero_body:     data.home.hero_body     || HOME_DEFAULTS.hero_body,
            hero_cta_text: data.home.hero_cta_text || HOME_DEFAULTS.hero_cta_text,
            hero_cta_link: data.home.hero_cta_link || HOME_DEFAULTS.hero_cta_link,
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
        if (data?.services) {
          const cats = Array.isArray(data.services.categories) && data.services.categories.length > 0
            ? data.services.categories
            : SERVICES_DEFAULTS.categories;
          setServicesData({
            hero_heading:  data.services.hero_heading  || SERVICES_DEFAULTS.hero_heading,
            hero_subtitle: data.services.hero_subtitle || SERVICES_DEFAULTS.hero_subtitle,
            categories:    cats,
            price_list: data.services.price_list && typeof data.services.price_list === 'object'
              ? data.services.price_list as Record<string, Record<string, PriceItem[]>>
              : SERVICES_DEFAULTS.price_list,
          });
          // Auto-select first category from DB
          if (cats.length > 0) setSvcCategory(cats[0].key);
        }
        if (data?.contact) {
          setContactData({
            hero_eyebrow:       data.contact.hero_eyebrow       || CONTACT_DEFAULTS.hero_eyebrow,
            hero_heading:       data.contact.hero_heading       || CONTACT_DEFAULTS.hero_heading,
            hero_subtitle:      data.contact.hero_subtitle      || CONTACT_DEFAULTS.hero_subtitle,
            cta_primary_text:   data.contact.cta_primary_text   || CONTACT_DEFAULTS.cta_primary_text,
            cta_secondary_text: data.contact.cta_secondary_text || CONTACT_DEFAULTS.cta_secondary_text,
            phone_number:       data.contact.phone_number       || CONTACT_DEFAULTS.phone_number,
            email_address:      data.contact.email_address      || CONTACT_DEFAULTS.email_address,
            stats: Array.isArray(data.contact.stats) && data.contact.stats.length > 0
              ? data.contact.stats
              : CONTACT_DEFAULTS.stats,
            map_embed_src:    data.contact.map_embed_src    || CONTACT_DEFAULTS.map_embed_src,
            map_address:      data.contact.map_address      || CONTACT_DEFAULTS.map_address,
            map_open_href:    data.contact.map_open_href    || CONTACT_DEFAULTS.map_open_href,
            social_instagram: data.contact.social_instagram || '',
            social_facebook:  data.contact.social_facebook  || '',
            social_whatsapp:  data.contact.social_whatsapp  || '',
            branches: Array.isArray(data.contact.branches) && data.contact.branches.length > 0
              ? data.contact.branches
              : CONTACT_DEFAULTS.branches,
          });
        }
      })
      .catch(() => showToast('⚠️ Could not load DB data — showing defaults'))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const saveSection = async (section: 'nav' | 'home' | 'footer' | 'about' | 'services' | 'contact') => {
    setSaving(s => ({ ...s, [section]: true }));
    setSaveErr(s => ({ ...s, [section]: '' }));
    const bodyData =
      section === 'nav'      ? navData      :
      section === 'home'     ? homeData     :
      section === 'footer'   ? footerData   :
      section === 'about'    ? aboutData    :
      section === 'services' ? servicesData :
      contactData;
    try {
      const res = await fetch(`/api/site-data?section=${section}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(bodyData),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(s => ({ ...s, [section]: true }));
      showToast(`✅ ${section.charAt(0).toUpperCase() + section.slice(1)} saved to database!`);
      setTimeout(() => setSaved(s => ({ ...s, [section]: false })), 3000);
    } catch {
      setSaveErr(s => ({ ...s, [section]: 'Save failed. Check DB connection.' }));
      showToast(`❌ Failed to save ${section}.`);
    } finally {
      setSaving(s => ({ ...s, [section]: false }));
    }
  };

  const saveAll = async () => {
    await saveSection('nav');
    await saveSection('home');
    await saveSection('footer');
    await saveSection('about');
    await saveSection('services');
    await saveSection('contact');
  };

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
      sessionStorage.removeItem('admin_username');
    } catch {}
    setIsAuthenticated(false);
    setAdminUsername('');
  };

  /* ── Nav helpers ── */
  const updateNavItem = (idx: number, field: keyof NavItem, value: string) => {
    const u = [...navData.nav_items]; u[idx] = { ...u[idx], [field]: value };
    setNavData({ ...navData, nav_items: u });
  };
  const addNavItem    = () => setNavData({ ...navData, nav_items: [...navData.nav_items, { label: 'NEW LINK', href: '/' }] });
  const removeNavItem = (idx: number) => setNavData({ ...navData, nav_items: navData.nav_items.filter((_, i) => i !== idx) });
  const moveNavItem   = (idx: number, dir: -1 | 1) => {
    const u = [...navData.nav_items]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]]; setNavData({ ...navData, nav_items: u });
  };

  /* ── Footer helpers ── */
  const updateQuickLink = (idx: number, field: keyof QuickLink, value: string) => {
    const u = [...footerData.quick_links]; u[idx] = { ...u[idx], [field]: value };
    setFooterData({ ...footerData, quick_links: u });
  };
  const addQuickLink    = () => setFooterData({ ...footerData, quick_links: [...footerData.quick_links, { label: 'New Link', href: '/' }] });
  const removeQuickLink = (idx: number) => setFooterData({ ...footerData, quick_links: footerData.quick_links.filter((_, i) => i !== idx) });
  const moveQuickLink   = (idx: number, dir: -1 | 1) => {
    const u = [...footerData.quick_links]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]]; setFooterData({ ...footerData, quick_links: u });
  };
  const updateLocation  = (idx: number, value: string) => { const u = [...footerData.locations]; u[idx] = value; setFooterData({ ...footerData, locations: u }); };
  const addLocation     = () => setFooterData({ ...footerData, locations: [...footerData.locations, 'New Location'] });
  const removeLocation  = (idx: number) => setFooterData({ ...footerData, locations: footerData.locations.filter((_, i) => i !== idx) });

  /* ── Staff helpers ── */
  const updateStaffMember = (idx: number, field: keyof StaffMember, value: string) => {
    const u = [...aboutData.staff]; u[idx] = { ...u[idx], [field]: value };
    setAboutData({ ...aboutData, staff: u });
  };
  const addStaffMember    = () => setAboutData({ ...aboutData, staff: [...aboutData.staff, { name: 'New Staff', role: 'Role', experience: '1+ Years', bio: '', specialties: '' }] });
  const removeStaffMember = (idx: number) => setAboutData({ ...aboutData, staff: aboutData.staff.filter((_, i) => i !== idx) });
  const moveStaffMember   = (idx: number, dir: -1 | 1) => {
    const u = [...aboutData.staff]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]]; setAboutData({ ...aboutData, staff: u });
  };

  /* ── Review helpers ── */
  const updateAboutReview = (idx: number, field: keyof AboutReview, value: string) => {
    const u = [...aboutData.reviews]; u[idx] = { ...u[idx], [field]: value };
    setAboutData({ ...aboutData, reviews: u });
  };
  const addAboutReview    = () => setAboutData({ ...aboutData, reviews: [...aboutData.reviews, { quote: '', author: '' }] });
  const removeAboutReview = (idx: number) => setAboutData({ ...aboutData, reviews: aboutData.reviews.filter((_, i) => i !== idx) });
  const moveAboutReview   = (idx: number, dir: -1 | 1) => {
    const u = [...aboutData.reviews]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]]; setAboutData({ ...aboutData, reviews: u });
  };

  /* ── Category helpers ── */
  const labelToKey = (label: string) =>
    label.trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');

  const updateCategoryLabel = (idx: number, newLabel: string) => {
    const cats   = [...servicesData.categories];
    const oldKey = cats[idx].key;
    const newKey = labelToKey(newLabel);
    cats[idx]    = { ...cats[idx], label: newLabel, key: newKey };

    // Rename price_list keys
    const newPriceList: typeof servicesData.price_list = {};
    for (const g of Object.keys(servicesData.price_list)) {
      newPriceList[g] = {};
      for (const k of Object.keys(servicesData.price_list[g])) {
        const targetKey       = k === oldKey ? newKey : k;
        newPriceList[g][targetKey] = servicesData.price_list[g][k];
      }
    }

    if (svcCategory === oldKey) setSvcCategory(newKey);
    setServicesData({ ...servicesData, categories: cats, price_list: newPriceList });
  };

  const addCategory = () => {
    const newKey   = `NEW_CATEGORY_${Date.now()}`;
    const newLabel = 'NEW';
    const newCats  = [...servicesData.categories, { key: newKey, label: newLabel, image: '' }];

    const newPriceList = { ...servicesData.price_list };
    for (const g of ['her', 'his']) {
      if (!newPriceList[g]) newPriceList[g] = {};
      newPriceList[g][newKey] = [];
    }

    setServicesData({ ...servicesData, categories: newCats, price_list: newPriceList });
    setSvcCategory(newKey);
  };

  const removeCategory = (idx: number) => {
    const cats       = [...servicesData.categories];
    const removedKey = cats[idx].key;
    cats.splice(idx, 1);

    const newPriceList = { ...servicesData.price_list };
    for (const g of Object.keys(newPriceList)) {
      const gData = { ...newPriceList[g] };
      delete gData[removedKey];
      newPriceList[g] = gData;
    }

    if (svcCategory === removedKey) setSvcCategory(cats[0]?.key ?? '');
    setServicesData({ ...servicesData, categories: cats, price_list: newPriceList });
  };

  const moveCategoryItem = (idx: number, dir: -1 | 1) => {
    const cats = [...servicesData.categories];
    const n    = idx + dir;
    if (n < 0 || n >= cats.length) return;
    [cats[idx], cats[n]] = [cats[n], cats[idx]];
    setServicesData({ ...servicesData, categories: cats });
  };

  /* ── Price list helpers ── */
  const getPriceItems = (): PriceItem[] => {
    try {
      return servicesData.price_list?.[svcGender]?.[svcCategory] ?? [];
    } catch { return []; }
  };

  const updatePriceItem = (idx: number, field: keyof PriceItem, value: string) => {
    const items  = [...getPriceItems()];
    items[idx]   = { ...items[idx], [field]: value };
    setServicesData({
      ...servicesData,
      price_list: {
        ...servicesData.price_list,
        [svcGender]: { ...servicesData.price_list[svcGender], [svcCategory]: items },
      },
    });
  };

  const addPriceItem = () => {
    const items = [...getPriceItems(), { name: 'New Service', price1: '0.00' }];
    setServicesData({
      ...servicesData,
      price_list: {
        ...servicesData.price_list,
        [svcGender]: { ...servicesData.price_list[svcGender], [svcCategory]: items },
      },
    });
  };

  const removePriceItem = (idx: number) => {
    const items = getPriceItems().filter((_, i) => i !== idx);
    setServicesData({
      ...servicesData,
      price_list: {
        ...servicesData.price_list,
        [svcGender]: { ...servicesData.price_list[svcGender], [svcCategory]: items },
      },
    });
  };

  const movePriceItem = (idx: number, dir: -1 | 1) => {
    const items = [...getPriceItems()];
    const n     = idx + dir;
    if (n < 0 || n >= items.length) return;
    [items[idx], items[n]] = [items[n], items[idx]];
    setServicesData({
      ...servicesData,
      price_list: {
        ...servicesData.price_list,
        [svcGender]: { ...servicesData.price_list[svcGender], [svcCategory]: items },
      },
    });
  };

  /* ── Contact: Stats helpers ── */
  const updateStat = (idx: number, field: keyof StatItem, value: string) => {
    const u = [...contactData.stats]; u[idx] = { ...u[idx], [field]: value };
    setContactData({ ...contactData, stats: u });
  };
  const addStat    = () => setContactData({ ...contactData, stats: [...contactData.stats, { value: '0', label: 'New Stat' }] });
  const removeStat = (idx: number) => setContactData({ ...contactData, stats: contactData.stats.filter((_, i) => i !== idx) });
  const moveStat   = (idx: number, dir: -1 | 1) => {
    const u = [...contactData.stats]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]]; setContactData({ ...contactData, stats: u });
  };

  /* ── Contact: Branch helpers ── */
  const updateBranch = (idx: number, field: keyof BranchLocation, value: string | boolean) => {
    const u = [...contactData.branches];
    u[idx] = { ...u[idx], [field]: value } as BranchLocation;
    setContactData({ ...contactData, branches: u });
  };
  const addBranch    = () => setContactData({ ...contactData, branches: [...contactData.branches, { name: 'New Branch', address: '', phone: '', email: '', isHead: false, mapHref: '' }] });
  const removeBranch = (idx: number) => setContactData({ ...contactData, branches: contactData.branches.filter((_, i) => i !== idx) });
  const moveBranch   = (idx: number, dir: -1 | 1) => {
    const u = [...contactData.branches]; const n = idx + dir;
    if (n < 0 || n >= u.length) return;
    [u[idx], u[n]] = [u[n], u[idx]]; setContactData({ ...contactData, branches: u });
  };

  const TABS = [
    { key: 'nav'      as const, label: 'NAVIGATION BAR', icon: '🧭' },
    { key: 'home'     as const, label: 'HOME HERO',      icon: '🏠' },
    { key: 'about'    as const, label: 'OUR STORY',      icon: '📖' },
    { key: 'services' as const, label: 'SERVICES',       icon: '💅' },
    { key: 'contact'  as const, label: 'CONTACT PAGE',   icon: '📞' },
    { key: 'footer'   as const, label: 'FOOTER',         icon: '📍' },
  ];

  const SaveButton = ({ section }: { section: 'nav' | 'home' | 'footer' | 'about' | 'services' | 'contact' }) => (
    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <button
        onClick={() => saveSection(section)}
        disabled={saving[section]}
        style={{ background: saved[section] ? 'rgba(56,161,105,0.8)' : saving[section] ? 'rgba(184,134,11,0.5)' : 'linear-gradient(135deg,#B8860B 0%,#d4a017 100%)', border: 'none', color: '#fff', padding: '0.75rem 2rem', borderRadius: '0.6rem', fontWeight: 700, fontSize: '0.9rem', cursor: saving[section] ? 'not-allowed' : 'pointer', boxShadow: saving[section] || saved[section] ? 'none' : '0 4px 14px rgba(184,134,11,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s' }}
      >
        {saving[section]
          ? (<><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Saving to DB...</>)
          : saved[section]
            ? '✅ Saved to Database!'
            : `💾 Save ${section.charAt(0).toUpperCase() + section.slice(1)} Changes`}
      </button>
      {saveErr[section] && <span style={{ color: '#fc8181', fontSize: '0.82rem', fontWeight: 500 }}>⚠️ {saveErr[section]}</span>}
    </div>
  );

  /* ── Auth loading ── */
  if (!authChecked) return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.color.bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: tokens.font.family }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: '40px', height: '40px', border: `3px solid ${tokens.color.goldBorder}`, borderTopColor: tokens.color.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!isAuthenticated) return (
    <AdminLoginScreen onLoginSuccess={u => { setIsAuthenticated(true); setAdminUsername(u); }} />
  );

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.color.bgDark, color: tokens.color.white, fontFamily: tokens.font.family, paddingBottom: '4rem' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* ── TOAST ── */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '1.5rem', right: previewOpen ? '400px' : '1.5rem', zIndex: 9999, background: toastMessage.startsWith('❌') ? '#c53030' : '#B8860B', color: '#fff', padding: '0.9rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', transition: 'right 0.35s cubic-bezier(0.16,1,0.3,1)', maxWidth: '340px' }}>
          {toastMessage}
        </div>
      )}

      <LivePreviewPanel
        open={previewOpen} onClose={() => setPreviewOpen(false)}
        navData={navData} homeData={homeData} footerData={footerData}
        activeTab={activeTab}
      />

      {/* ── HEADER ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(14,14,18,0.88)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${tokens.color.whiteBorder}`, padding: '0.85rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AdminLogoIcon size={48} />
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, letterSpacing: '0.08em' }}>
              SAYO BEAUTY <span style={{ color: tokens.color.gold, fontWeight: 500 }}>ADMIN PORTAL</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: tokens.color.whiteDim, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {adminUsername ? `Logged in as: ${adminUsername}` : 'Content Manager'}
              <span style={{ color: '#68d391', fontWeight: 600 }}>· 🟢 MySQL DB Connected</span>
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPreviewOpen(!previewOpen)}
            style={{ background: previewOpen ? 'rgba(184,134,11,0.25)' : 'rgba(255,255,255,0.05)', border: `1px solid ${previewOpen ? tokens.color.gold : tokens.color.whiteBorder}`, color: previewOpen ? tokens.color.gold : tokens.color.whiteMuted, padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
          >
            👁️ {previewOpen ? 'Hide Preview' : 'Live Preview'}
          </button>
          <button
            onClick={saveAll}
            disabled={Object.values(saving).some(Boolean)}
            style={{ background: 'linear-gradient(135deg,#B8860B 0%,#d4a017 100%)', border: 'none', color: '#fff', padding: '0.6rem 1.4rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: Object.values(saving).some(Boolean) ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(184,134,11,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: Object.values(saving).some(Boolean) ? 0.7 : 1 }}
          >
            {Object.values(saving).some(Boolean)
              ? (<><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Saving...</>)
              : '💾 Save All to DB'}
          </button>
          <button
            onClick={handleLogout}
            style={{ background: 'rgba(229,62,62,0.15)', border: '1px solid rgba(229,62,62,0.4)', color: '#fc8181', padding: '0.55rem 1.1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* ── Loading bar ── */}
      {isLoading && (
        <div style={{ background: 'rgba(184,134,11,0.1)', borderBottom: `1px solid ${tokens.color.goldBorder}`, padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: tokens.color.gold, fontSize: '0.82rem' }}>
          <span style={{ display: 'inline-block', width: '14px', height: '14px', border: `2px solid ${tokens.color.goldBorder}`, borderTopColor: tokens.color.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          Loading data from MySQL database...
        </div>
      )}

      {/* ── TABS ── */}
      <nav style={{ background: '#121216', borderBottom: `1px solid ${tokens.color.whiteBorder}`, padding: '0 2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{ background: isActive ? 'rgba(184,134,11,0.18)' : 'transparent', border: 'none', borderBottom: isActive ? `3px solid ${tokens.color.gold}` : '3px solid transparent', color: isActive ? '#fff' : tokens.color.whiteDim, padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* ════════════════════════════════
            NAV TAB
        ════════════════════════════════ */}
        {activeTab === 'nav' && (
          <section style={sectionCard}>
            <h2 style={sectionTitle}>Navigation Bar</h2>
            <p style={sectionDesc}>Controls the logo text, nav links, and Contact Us button shown on every page.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { label: 'Logo Text',            key: 'logo_text'        },
                { label: 'Contact Button Text',  key: 'contact_btn_text' },
                { label: 'Contact Button Link',  key: 'contact_btn_link' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={fieldLabel}>{label}</label>
                  <input type="text" value={(navData as Record<string, string>)[key]} onChange={e => setNavData({ ...navData, [key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
            </div>

            <label style={{ ...fieldLabel, fontSize: '0.9rem', color: tokens.color.gold, marginBottom: '0.75rem' }}>
              Navigation Links ({navData.nav_items.length})
            </label>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', border: `1px solid ${tokens.color.whiteBorder}`, overflow: 'hidden', marginBottom: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '0.9rem 1.25rem', background: 'rgba(184,134,11,0.15)', borderBottom: `1px solid ${tokens.color.whiteBorder}`, fontWeight: 600, fontSize: '0.8rem', color: tokens.color.gold, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <div>Label</div><div>Link (Href)</div><div style={{ textAlign: 'center' }}>Actions</div>
              </div>
              {navData.nav_items.map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <input type="text" value={item.label} onChange={e => updateNavItem(idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                  <input type="text" value={item.href}  onChange={e => updateNavItem(idx, 'href',  e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                    <button onClick={() => moveNavItem(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                    <button onClick={() => moveNavItem(idx,  1)} disabled={idx === navData.nav_items.length - 1} style={{ ...smallIconBtn, opacity: idx === navData.nav_items.length - 1 ? 0.3 : 1 }}>↓</button>
                    <button onClick={() => removeNavItem(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
                  </div>
                </div>
              ))}
              <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <button onClick={addNavItem} style={{ background: 'rgba(184,134,11,0.2)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  + Add Nav Link
                </button>
              </div>
            </div>
            <SaveButton section="nav" />
          </section>
        )}

        {/* ════════════════════════════════
            HOME TAB
        ════════════════════════════════ */}
        {activeTab === 'home' && (
          <section style={sectionCard}>
            <h2 style={sectionTitle}>Home Hero Section</h2>
            <p style={sectionDesc}>Update the main headline, tagline, body text, and CTA button on the home page hero banner.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { label: 'Eyebrow Text',  key: 'hero_eyebrow' },
                { label: 'Main Heading',  key: 'hero_heading' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={fieldLabel}>{label}</label>
                  <input type="text" value={(homeData as Record<string, string>)[key]} onChange={e => setHomeData({ ...homeData, [key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={fieldLabel}>Body Description</label>
                <textarea rows={4} value={homeData.hero_body} onChange={e => setHomeData({ ...homeData, hero_body: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={fieldLabel}>CTA Button Text</label>
                  <input type="text" value={homeData.hero_cta_text} onChange={e => setHomeData({ ...homeData, hero_cta_text: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>CTA Button URL</label>
                  <input type="text" value={homeData.hero_cta_link} onChange={e => setHomeData({ ...homeData, hero_cta_link: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Inline Preview */}
            <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg,#18181e 0%,#0d0d12 100%)', border: `1px solid ${tokens.color.goldBorder}`, borderRadius: '1rem', padding: '2rem', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '1rem', right: '1.25rem', background: 'rgba(184,134,11,0.2)', color: tokens.color.gold, fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '0.375rem' }}>PREVIEW</span>
              <p style={{ color: tokens.color.gold, fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.6rem', letterSpacing: '0.1em' }}>{homeData.hero_eyebrow || '—'}</p>
              <h3 style={{ fontSize: 'clamp(1.2rem,3vw,2rem)', fontWeight: 600, color: '#fff', lineHeight: 1.2, margin: '0 0 0.75rem', maxWidth: '560px' }}>{homeData.hero_heading || '—'}</h3>
              <p style={{ color: tokens.color.whiteMuted, fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 1.25rem', maxWidth: '480px' }}>{homeData.hero_body || '—'}</p>
              <span style={{ background: tokens.color.gold, color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '1.25rem', fontSize: '0.9rem', fontWeight: 600 }}>{homeData.hero_cta_text || '—'} →</span>
            </div>
            <SaveButton section="home" />
          </section>
        )}

        {/* ════════════════════════════════
            ABOUT TAB
        ════════════════════════════════ */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Hero */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Our Story — Hero Section</h2>
              <p style={sectionDesc}>Eyebrow, heading, and body text shown at the top of the About page.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div><label style={fieldLabel}>Eyebrow Text</label><input type="text" value={aboutData.hero_eyebrow} onChange={e => setAboutData({ ...aboutData, hero_eyebrow: e.target.value })} style={inputStyle} /></div>
                <div><label style={fieldLabel}>Main Heading</label><input type="text" value={aboutData.hero_heading} onChange={e => setAboutData({ ...aboutData, hero_heading: e.target.value })} style={inputStyle} /></div>
                <div><label style={fieldLabel}>Body Paragraph</label><textarea rows={4} value={aboutData.hero_body} onChange={e => setAboutData({ ...aboutData, hero_body: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              </div>
            </section>

            {/* Team */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Team Section</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={fieldLabel}>Section Title</label>
                <input type="text" value={aboutData.team_section_title} onChange={e => setAboutData({ ...aboutData, team_section_title: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <label style={{ ...fieldLabel, fontSize: '0.9rem', color: tokens.color.gold }}>Staff Members ({aboutData.staff.length})</label>
                <button onClick={addStaffMember} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>+ Add Staff Member</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {aboutData.staff.map((member, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tokens.color.whiteBorder}`, borderRadius: '1rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ color: tokens.color.gold, fontWeight: 600, fontSize: '0.9rem' }}>Staff #{idx + 1}</span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button onClick={() => moveStaffMember(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                        <button onClick={() => moveStaffMember(idx,  1)} disabled={idx === aboutData.staff.length - 1} style={{ ...smallIconBtn, opacity: idx === aboutData.staff.length - 1 ? 0.3 : 1 }}>↓</button>
                        <button onClick={() => removeStaffMember(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div><label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Full Name</label><input type="text" value={member.name} onChange={e => updateStaffMember(idx, 'name', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} /></div>
                      <div><label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Role / Title</label><input type="text" value={member.role} onChange={e => updateStaffMember(idx, 'role', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} /></div>
                      <div><label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Experience</label><input type="text" value={member.experience} onChange={e => updateStaffMember(idx, 'experience', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} /></div>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Bio</label>
                      <textarea rows={3} value={member.bio} onChange={e => updateStaffMember(idx, 'bio', e.target.value)} style={{ ...inputStyle, resize: 'vertical', padding: '0.5rem 0.75rem' }} />
                    </div>
                    <div>
                      <label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Specialties (comma separated)</label>
                      <input type="text" value={member.specialties} onChange={e => updateStaffMember(idx, 'specialties', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    </div>
                  </div>
                ))}
                {aboutData.staff.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: tokens.color.whiteFaint }}>No staff members yet.</div>}
              </div>
            </section>

            {/* Gallery */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Gallery Section</h2>
              <p style={sectionDesc}>Only titles/text — images are managed directly in code.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div><label style={fieldLabel}>Gallery Section Title</label><input type="text" value={aboutData.gallery_section_title} onChange={e => setAboutData({ ...aboutData, gallery_section_title: e.target.value })} style={inputStyle} /></div>
                <div><label style={fieldLabel}>Gallery Description</label><textarea rows={3} value={aboutData.gallery_description} onChange={e => setAboutData({ ...aboutData, gallery_description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              </div>
            </section>

            {/* Reviews */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Client Reviews Carousel</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={fieldLabel}>Section Title</label>
                <input type="text" value={aboutData.review_section_title} onChange={e => setAboutData({ ...aboutData, review_section_title: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <label style={{ ...fieldLabel, fontSize: '0.9rem', color: tokens.color.gold }}>Reviews ({aboutData.reviews.length})</label>
                <button onClick={addAboutReview} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>+ Add Review</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {aboutData.reviews.map((rev, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${tokens.color.whiteBorder}`, borderRadius: '1rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ color: tokens.color.gold, fontWeight: 600, fontSize: '0.9rem' }}>Review #{idx + 1}</span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button onClick={() => moveAboutReview(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                        <button onClick={() => moveAboutReview(idx,  1)} disabled={idx === aboutData.reviews.length - 1} style={{ ...smallIconBtn, opacity: idx === aboutData.reviews.length - 1 ? 0.3 : 1 }}>↓</button>
                        <button onClick={() => removeAboutReview(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
                      </div>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Quote</label>
                      <textarea rows={3} value={rev.quote} onChange={e => updateAboutReview(idx, 'quote', e.target.value)} style={{ ...inputStyle, resize: 'vertical', padding: '0.5rem 0.75rem' }} />
                    </div>
                    <div>
                      <label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Author</label>
                      <input type="text" value={rev.author} onChange={e => updateAboutReview(idx, 'author', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    </div>
                  </div>
                ))}
                {aboutData.reviews.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: tokens.color.whiteFaint }}>No reviews yet.</div>}
              </div>
            </section>

            <SaveButton section="about" />
          </div>
        )}

        {/* ════════════════════════════════
            SERVICES TAB
        ════════════════════════════════ */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* ── Hero Text ── */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Services Page — Hero Text</h2>
              <p style={sectionDesc}>Main heading and subtitle shown at the top of the Services page.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={fieldLabel}>Hero Heading</label>
                  <input type="text" value={servicesData.hero_heading} onChange={e => setServicesData({ ...servicesData, hero_heading: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>Hero Subtitle</label>
                  <textarea rows={4} value={servicesData.hero_subtitle} onChange={e => setServicesData({ ...servicesData, hero_subtitle: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
              </div>
            </section>

            {/* ── Category Manager ── */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Category Manager</h2>
              <p style={sectionDesc}>
                Add, rename, reorder, or remove service categories. Category names shown on tabs and gallery carousel.
                <br />
                <span style={{ color: tokens.color.gold, fontWeight: 600 }}>⚠️ Renaming a category automatically updates its price list key.</span>
              </p>

              {/* Category List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                {servicesData.categories.map((cat, idx) => (
                  <div
                    key={cat.key}
                    style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'center', padding: '0.75rem 1rem', background: svcCategory === cat.key ? 'rgba(184,134,11,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${svcCategory === cat.key ? tokens.color.gold : tokens.color.whiteBorder}`, borderRadius: '0.75rem', cursor: 'pointer' }}
                    onClick={() => setSvcCategory(cat.key)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {/* Active dot */}
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: svcCategory === cat.key ? tokens.color.gold : 'rgba(255,255,255,0.2)' }} />

                      {/* Label edit */}
                      <div style={{ flex: 1 }}>
                        <label style={{ ...fieldLabel, fontSize: '0.7rem', marginBottom: '0.2rem', color: tokens.color.whiteDim }}>Category Name</label>
                        <input
                          type="text"
                          value={cat.label}
                          onChange={e => { e.stopPropagation(); updateCategoryLabel(idx, e.target.value); }}
                          onClick={e => e.stopPropagation()}
                          style={{ ...inputStyle, padding: '0.4rem 0.6rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(0,0,0,0.3)' }}
                          placeholder="Category name (e.g. HAIR)"
                        />
                        <p style={{ fontSize: '0.68rem', color: tokens.color.whiteFaint, margin: '0.2rem 0 0' }}>
                          Key: <code style={{ color: tokens.color.gold }}>{cat.key}</code>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                      <button onClick={e => { e.stopPropagation(); moveCategoryItem(idx, -1); }} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1 }} title="Move up">↑</button>
                      <button onClick={e => { e.stopPropagation(); moveCategoryItem(idx,  1); }} disabled={idx === servicesData.categories.length - 1} style={{ ...smallIconBtn, opacity: idx === servicesData.categories.length - 1 ? 0.3 : 1 }} title="Move down">↓</button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (servicesData.categories.length <= 1) { alert('At least 1 category required.'); return; }
                          if (!window.confirm(`Delete "${cat.label}" category and ALL its price items?`)) return;
                          removeCategory(idx);
                        }}
                        style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}
                        title="Delete category"
                      >🗑️</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Category */}
              <button
                onClick={addCategory}
                style={{ width: '100%', background: 'rgba(184,134,11,0.12)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.75rem 1rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                + Add New Category
              </button>
            </section>

            {/* ── Price List Editor ── */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Price List Editor</h2>
              <p style={sectionDesc}>Select gender and category to edit price items. Changes affect the live services page immediately after save.</p>

              {/* Gender Tabs */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ ...fieldLabel, marginBottom: '0.75rem' }}>Gender</label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {GENDERS.map(g => (
                    <button
                      key={g}
                      onClick={() => setSvcGender(g)}
                      style={{ padding: '0.6rem 1.5rem', borderRadius: '0.75rem', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', background: svcGender === g ? tokens.color.gold : 'rgba(255,255,255,0.08)', color: svcGender === g ? '#fff' : tokens.color.whiteMuted, transition: 'all 0.2s' }}
                    >
                      {g === 'her' ? '👩 Her Sanctuary' : '👨 His Retreat'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Tabs — dynamic from DB */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ ...fieldLabel, marginBottom: '0.75rem' }}>Category</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {servicesData.categories.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => setSvcCategory(cat.key)}
                      style={{ padding: '0.5rem 1.1rem', borderRadius: '0.6rem', border: `1px solid ${svcCategory === cat.key ? tokens.color.gold : tokens.color.whiteBorder}`, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', background: svcCategory === cat.key ? 'rgba(184,134,11,0.25)' : 'rgba(255,255,255,0.04)', color: svcCategory === cat.key ? tokens.color.gold : tokens.color.whiteMuted, transition: 'all 0.2s' }}
                    >
                      {cat.label}
                    </button>
                  ))}
                  {servicesData.categories.length === 0 && (
                    <p style={{ color: tokens.color.whiteFaint, fontSize: '0.82rem' }}>No categories yet. Add one above.</p>
                  )}
                </div>
              </div>

              {/* Price Items Table */}
              {svcCategory ? (
                <>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '1rem', border: `1px solid ${tokens.color.whiteBorder}`, overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px 110px', gap: '0.5rem', padding: '0.8rem 1.25rem', background: 'rgba(184,134,11,0.15)', borderBottom: `1px solid ${tokens.color.whiteBorder}`, fontWeight: 600, fontSize: '0.78rem', color: tokens.color.gold, textTransform: 'uppercase', letterSpacing: '0.05em', alignItems: 'center' }}>
                      <div>Service Name</div><div>Price 1</div><div>Price 2 (opt)</div><div style={{ textAlign: 'center' }}>Actions</div>
                    </div>

                    {/* Rows */}
                    {getPriceItems().map((item, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px 110px', gap: '0.5rem', alignItems: 'center', padding: '0.6rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                        <input type="text" value={item.name}      onChange={e => updatePriceItem(idx, 'name',   e.target.value)} style={{ ...inputStyle, padding: '0.45rem 0.6rem', fontSize: '0.85rem' }} />
                        <input type="text" value={item.price1}    onChange={e => updatePriceItem(idx, 'price1', e.target.value)} style={{ ...inputStyle, padding: '0.45rem 0.6rem', fontSize: '0.85rem' }} placeholder="e.g. 2,500.00" />
                        <input type="text" value={item.price2 || ''} onChange={e => updatePriceItem(idx, 'price2', e.target.value)} style={{ ...inputStyle, padding: '0.45rem 0.6rem', fontSize: '0.85rem' }} placeholder="Optional" />
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
                          <button onClick={() => movePriceItem(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1, padding: '0.3rem 0.45rem' }}>↑</button>
                          <button onClick={() => movePriceItem(idx,  1)} disabled={idx === getPriceItems().length - 1} style={{ ...smallIconBtn, opacity: idx === getPriceItems().length - 1 ? 0.3 : 1, padding: '0.3rem 0.45rem' }}>↓</button>
                          <button onClick={() => removePriceItem(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.45rem', cursor: 'pointer', fontSize: '0.75rem' }}>🗑️</button>
                        </div>
                      </div>
                    ))}

                    {getPriceItems().length === 0 && (
                      <div style={{ padding: '2rem', textAlign: 'center', color: tokens.color.whiteFaint, fontSize: '0.85rem' }}>
                        No services yet for this category. Add one below.
                      </div>
                    )}

                    {/* Add row */}
                    <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                      <button onClick={addPriceItem} style={{ background: 'rgba(184,134,11,0.2)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.55rem 1.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                        + Add Service Item
                      </button>
                    </div>
                  </div>

                  {/* Info bar */}
                  <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(184,134,11,0.08)', borderRadius: '0.5rem', border: `1px solid ${tokens.color.goldBorder}`, fontSize: '0.78rem', color: tokens.color.whiteDim }}>
                    ℹ️ Editing: <strong style={{ color: tokens.color.gold }}>{svcGender === 'her' ? 'Her Sanctuary' : 'His Retreat'}</strong> → <strong style={{ color: tokens.color.gold }}>{servicesData.categories.find(c => c.key === svcCategory)?.label ?? svcCategory}</strong> · {getPriceItems().length} items · Price 2 is optional (used for discounted/alternate price)
                  </div>
                </>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: tokens.color.whiteFaint, fontSize: '0.85rem', border: `1px dashed ${tokens.color.whiteBorder}`, borderRadius: '1rem' }}>
                  Select a category above to edit its price list.
                </div>
              )}
            </section>

            <SaveButton section="services" />
          </div>
        )}

        {/* ════════════════════════════════
            CONTACT TAB
        ════════════════════════════════ */}
        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Hero */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Contact Page — Hero Section</h2>
              <p style={sectionDesc}>Eyebrow, heading, subtitle, and CTA button texts shown at the top of the Contact page.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={fieldLabel}>Eyebrow Text</label>
                  <input type="text" value={contactData.hero_eyebrow} onChange={e => setContactData({ ...contactData, hero_eyebrow: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>Main Heading</label>
                  <input type="text" value={contactData.hero_heading} onChange={e => setContactData({ ...contactData, hero_heading: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>Subtitle</label>
                  <textarea rows={4} value={contactData.hero_subtitle} onChange={e => setContactData({ ...contactData, hero_subtitle: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={fieldLabel}>Primary CTA Text (Send Inquiry)</label>
                    <input type="text" value={contactData.cta_primary_text} onChange={e => setContactData({ ...contactData, cta_primary_text: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={fieldLabel}>Secondary CTA Text (Call Us Now)</label>
                    <input type="text" value={contactData.cta_secondary_text} onChange={e => setContactData({ ...contactData, cta_secondary_text: e.target.value })} style={inputStyle} />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Contact Info &amp; Social Links</h2>
              <p style={sectionDesc}>Phone/email shown in "Call Us Now" button and contact info card. Social links shown in "Follow Us".</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={fieldLabel}>Phone Number</label>
                  <input type="text" value={contactData.phone_number} onChange={e => setContactData({ ...contactData, phone_number: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>Email Address</label>
                  <input type="text" value={contactData.email_address} onChange={e => setContactData({ ...contactData, email_address: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: '📸 Instagram URL', key: 'social_instagram' },
                  { label: '📘 Facebook URL',  key: 'social_facebook'  },
                  { label: '💬 WhatsApp URL',  key: 'social_whatsapp'  },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={fieldLabel}>{label}</label>
                    <input type="text" value={(contactData as Record<string, string>)[key]} onChange={e => setContactData({ ...contactData, [key]: e.target.value })} style={inputStyle} placeholder="https://..." />
                  </div>
                ))}
              </div>
            </section>

            {/* Stats */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Hero Stat Pills</h2>
              <p style={sectionDesc}>The 3 floating stat pills below the hero CTA buttons (e.g. "3 Locations").</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <label style={{ ...fieldLabel, fontSize: '0.9rem', color: tokens.color.gold }}>Stats ({contactData.stats.length})</label>
                <button onClick={addStat} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>+ Add Stat</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {contactData.stats.map((stat, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="text" value={stat.value} onChange={e => updateStat(idx, 'value', e.target.value)} style={{ ...inputStyle, padding: '0.55rem 0.75rem' }} placeholder="e.g. 3" />
                    <input type="text" value={stat.label} onChange={e => updateStat(idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.55rem 0.75rem' }} placeholder="e.g. Locations" />
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button onClick={() => moveStat(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                      <button onClick={() => moveStat(idx,  1)} disabled={idx === contactData.stats.length - 1} style={{ ...smallIconBtn, opacity: idx === contactData.stats.length - 1 ? 0.3 : 1 }}>↓</button>
                      <button onClick={() => removeStat(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: 'none', padding: '0 0.6rem', borderRadius: '0.4rem', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                {contactData.stats.length === 0 && <div style={{ textAlign: 'center', padding: '1.5rem', color: tokens.color.whiteFaint }}>No stats yet.</div>}
              </div>
            </section>

            {/* Map */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Map Section</h2>
              <p style={sectionDesc}>Google Maps embed URL, displayed address, and "View on Map" link (head office map card).</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={fieldLabel}>Google Maps Embed URL (iframe src)</label>
                  <textarea rows={3} value={contactData.map_embed_src} onChange={e => setContactData({ ...contactData, map_embed_src: e.target.value })} style={{ ...inputStyle, resize: 'vertical', fontSize: '0.78rem' }} />
                </div>
                <div>
                  <label style={fieldLabel}>Displayed Address</label>
                  <input type="text" value={contactData.map_address} onChange={e => setContactData({ ...contactData, map_address: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>"View on Map" Link URL</label>
                  <input type="text" value={contactData.map_open_href} onChange={e => setContactData({ ...contactData, map_open_href: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </section>

            {/* Branches */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Branch Locations</h2>
              <p style={sectionDesc}>Branch cards shown in "Our Locations" section. Mark one branch as Head Office.</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <label style={{ ...fieldLabel, fontSize: '0.9rem', color: tokens.color.gold }}>Branches ({contactData.branches.length})</label>
                <button onClick={addBranch} style={{ background: tokens.color.gold, border: 'none', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>+ Add Branch</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {contactData.branches.map((branch, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${branch.isHead ? tokens.color.goldBorder : tokens.color.whiteBorder}`, borderRadius: '1rem', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ color: tokens.color.gold, fontWeight: 600, fontSize: '0.9rem' }}>
                        Branch #{idx + 1} {branch.isHead && <span style={{ background: 'rgba(184,134,11,0.2)', color: tokens.color.gold, fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '0.3rem', marginLeft: '0.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>★ HEAD OFFICE</span>}
                      </span>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button onClick={() => moveBranch(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                        <button onClick={() => moveBranch(idx,  1)} disabled={idx === contactData.branches.length - 1} style={{ ...smallIconBtn, opacity: idx === contactData.branches.length - 1 ? 0.3 : 1 }}>↓</button>
                        <button
                          onClick={() => {
                            if (contactData.branches.length <= 1) { alert('At least 1 branch required.'); return; }
                            if (!window.confirm(`Delete "${branch.name}" branch?`)) return;
                            removeBranch(idx);
                          }}
                          style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.4)', borderRadius: '0.4rem', padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem' }}
                        >🗑️</button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div>
                        <label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Branch Name</label>
                        <input type="text" value={branch.name} onChange={e => updateBranch(idx, 'name', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                      </div>
                      <div>
                        <label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Phone</label>
                        <input type="text" value={branch.phone} onChange={e => updateBranch(idx, 'phone', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                      </div>
                      <div>
                        <label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Email</label>
                        <input type="text" value={branch.email} onChange={e => updateBranch(idx, 'email', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Address</label>
                      <input type="text" value={branch.address} onChange={e => updateBranch(idx, 'address', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} />
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ ...fieldLabel, fontSize: '0.72rem' }}>Google Maps Link (View on Map)</label>
                      <input type="text" value={branch.mapHref} onChange={e => updateBranch(idx, 'mapHref', e.target.value)} style={{ ...inputStyle, padding: '0.5rem 0.75rem' }} placeholder="https://maps.google.com/?q=..." />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: tokens.color.whiteMuted, fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={branch.isHead}
                        onChange={e => {
                          // Only one branch can be Head Office
                          const checked = e.target.checked;
                          const updated = contactData.branches.map((b, i) => ({
                            ...b,
                            isHead: i === idx ? checked : (checked ? false : b.isHead),
                          }));
                          setContactData({ ...contactData, branches: updated });
                        }}
                        style={{ width: '16px', height: '16px', accentColor: tokens.color.gold, cursor: 'pointer' }}
                      />
                      Mark as Head Office
                    </label>
                  </div>
                ))}
                {contactData.branches.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: tokens.color.whiteFaint }}>No branches yet.</div>}
              </div>
            </section>

            <SaveButton section="contact" />
          </div>
        )}

        {/* ════════════════════════════════
            FOOTER TAB
        ════════════════════════════════ */}
        {activeTab === 'footer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Brand & Contact */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Brand &amp; Contact Info</h2>
              <p style={sectionDesc}>Appears across all page footers site-wide.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {[
                  { label: 'Brand Name',      key: 'brand_name'      },
                  { label: 'Brand Tagline',   key: 'brand_tagline'   },
                  { label: 'Contact Phone',   key: 'contact_phone'   },
                  { label: 'Contact Email',   key: 'contact_email'   },
                  { label: 'Contact Address', key: 'contact_address' },
                  { label: 'Copyright Text',  key: 'copyright_text'  },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={fieldLabel}>{label}</label>
                    <input type="text" value={(footerData as Record<string, string>)[key]} onChange={e => setFooterData({ ...footerData, [key]: e.target.value })} style={inputStyle} />
                  </div>
                ))}
              </div>
            </section>

            {/* Social Media */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Social Media Links</h2>
              <p style={sectionDesc}>Full URLs — e.g. https://wa.me/94771234567</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: '💬 WhatsApp URL',  key: 'social_whatsapp'  },
                  { label: '📘 Facebook URL',  key: 'social_facebook'  },
                  { label: '📸 Instagram URL', key: 'social_instagram' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={fieldLabel}>{label}</label>
                    <input type="text" value={(footerData as Record<string, string>)[key]} onChange={e => setFooterData({ ...footerData, [key]: e.target.value })} style={inputStyle} placeholder="https://..." />
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Links */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Quick Links ({footerData.quick_links.length})</h2>
              <p style={sectionDesc}>Footer navigation links shown on all pages.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.5rem' }}>
                {footerData.quick_links.map((link, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="text" value={link.label} onChange={e => updateQuickLink(idx, 'label', e.target.value)} style={{ ...inputStyle, padding: '0.55rem 0.75rem' }} />
                    <input type="text" value={link.href}  onChange={e => updateQuickLink(idx, 'href',  e.target.value)} style={{ ...inputStyle, padding: '0.55rem 0.75rem' }} />
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button onClick={() => moveQuickLink(idx, -1)} disabled={idx === 0} style={{ ...smallIconBtn, opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                      <button onClick={() => moveQuickLink(idx,  1)} disabled={idx === footerData.quick_links.length - 1} style={{ ...smallIconBtn, opacity: idx === footerData.quick_links.length - 1 ? 0.3 : 1 }}>↓</button>
                      <button onClick={() => removeQuickLink(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: 'none', padding: '0 0.6rem', borderRadius: '0.4rem', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <button onClick={addQuickLink} style={{ background: 'rgba(184,134,11,0.18)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', marginTop: '0.4rem' }}>
                  + Add Quick Link
                </button>
              </div>
            </section>

            {/* Locations */}
            <section style={sectionCard}>
              <h2 style={sectionTitle}>Locations ({footerData.locations.length})</h2>
              <p style={sectionDesc}>Branch locations shown in the footer.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {footerData.locations.map((loc, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" value={loc} onChange={e => updateLocation(idx, e.target.value)} style={inputStyle} />
                    <button onClick={() => removeLocation(idx)} style={{ background: 'rgba(229,62,62,0.2)', color: '#fc8181', border: 'none', padding: '0 0.8rem', borderRadius: '0.5rem', cursor: 'pointer' }}>🗑️</button>
                  </div>
                ))}
                <button onClick={addLocation} style={{ background: 'rgba(184,134,11,0.18)', border: `1px dashed ${tokens.color.gold}`, color: tokens.color.gold, padding: '0.6rem 1rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', marginTop: '0.4rem' }}>
                  + Add Location
                </button>
              </div>
            </section>

            <SaveButton section="footer" />
          </div>
        )}

      </main>
    </div>
  );
}