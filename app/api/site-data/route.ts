import { NextRequest, NextResponse } from 'next/server';
import { localPrisma, cloudPrisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

/* ─────────────────────────────────────────
   DEFAULTS
───────────────────────────────────────── */
const NAV_DEFAULTS = {
  logo_text: 'SAYO',
  contact_btn_text: 'CONTACT US',
  contact_btn_link: '/contact',
  nav_items: [
    { label: 'HOME', href: '/' },
    { label: 'OUR STORY', href: '/about' },
    { label: 'SERVICES', href: '/services' },
    { label: 'PRODUCTS', href: '/products' },
    { label: 'REVIEWS', href: '/reviews' },
  ],
};

const HOME_DEFAULTS = {
  hero_eyebrow: 'Experienced hair stylists',
  hero_heading: 'Enjoy Professional Beauty Services!',
  hero_body: 'Providing expert skin care advice & beauty services using natural products to cater for any skin.',
  hero_cta_text: 'Reserve Experience',
  hero_cta_link: '/contact',
};

const FOOTER_DEFAULTS = {
  brand_name: 'SAYO',
  brand_tagline: 'We are experienced in making you more beautiful',
  contact_phone: '+94 77 233 6233',
  contact_email: 'hello@sayobeauty.com',
  contact_address: '123 Galle Road, Colombo, Sri Lanka',
  copyright_text: '© 2025 SAYO Beauty. All rights reserved.',
  locations: ['Colombo', 'Negombo', 'Kiribathgoda'],
  quick_links: [
    { label: 'Home', href: '/' },
    { label: 'Our Story', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
    { label: 'Reviews', href: '/reviews' },
  ],
  social_whatsapp: '',
  social_facebook: '',
  social_instagram: '',
};

const ABOUT_DEFAULTS = {
  hero_eyebrow: 'OUR STORY',
  hero_heading: 'We are experience in making you more beautiful',
  hero_body: 'We will make your skin better and also more glowing skin. And we provide to treatment spa and face with best service our employees,',
  team_section_title: 'Meet the Visionaries',
  staff: [
    {
      name: 'Hiruni Perera',
      role: 'Lead Stylist & Founder',
      experience: '12+ Years',
      bio: 'Train-certified in London and Singapore, Hiruni founded the salon with a vision to revolutionize modern hair styling in Sri Lanka.',
      specialties: 'Precision Haircuts, Balayage & Highlights, Advanced Hair Treatments',
    },
    {
      name: 'Aruna Ratnayake',
      role: 'Grooming Specialist',
      experience: '10+ Years',
      bio: "Bringing a sharp eye for detail and modern barbering techniques, Aruna specializes in tailored men's styling and beard architecture.",
      specialties: "Precision Beard Sculpting, Classic & Modern Men's Haircuts, Groom's Styling Package",
    },
  ],
  gallery_section_title: 'Transformations & Artistry',
  gallery_description: 'Explore our latest work, behind-the-scenes moments, and client transformations.',
  review_section_title: 'What Our Clients Say',
  reviews: [
    { quote: '"Choosing SAYO for my Kandyan bridal dressing was the best decision I made."', author: 'Nimesha D.' },
    { quote: '"I\'ve tried many salons across Colombo, but SAYO stands apart."', author: 'Sanduni R.' },
    { quote: '"Aruna\'s attention to detail with my beard and fade was exceptional."', author: 'Kasun P.' },
    { quote: '"From the moment you walk in, you feel looked after."', author: 'Dilani W.' },
  ],
};

const SERVICES_CATEGORIES_DEFAULT = [
  { key: 'WAX', label: 'WAX', image: '/cat-wax.jpg' },
  { key: 'HAIR', label: 'HAIR', image: '/cat-hair.jpg' },
  { key: 'SKIN', label: 'SKIN', image: '/cat-skin.jpg' },
  { key: 'NAIL', label: 'NAIL', image: '/cat-nail.jpg' },
  { key: 'BODY', label: 'BODY', image: '/cat-body.jpg' },
  { key: 'BRIDAL', label: 'BRIDAL', image: '/cat-bridal.jpg' },
];

const SERVICES_PRICE_LIST_DEFAULT = {
  her: {
    WAX: [
      { name: 'Full Arms Wax', price1: '2,500.00' },
      { name: 'Full Legs Wax', price1: '3,500.00' },
      { name: 'Underarm Wax', price1: '1,200.00' },
      { name: 'Eyebrow Threading', price1: '800.00' },
      { name: 'Full Body Wax', price1: '7,500.00', price2: '6,800.00' },
    ],
    HAIR: [
      { name: 'Cut & Re-Style (Advance)', price1: '4,200.00', price2: '3,600.00' },
      { name: 'Fringe Cut', price1: '1,500.00' },
      { name: 'Trim', price1: '1,500.00' },
      { name: 'Blow Dry - Short', price1: '2,500.00', price2: '2,200.00' },
      { name: 'Hair Wash & Blast Dry', price1: '2,100.00', price2: '1,800.00' },
    ],
    SKIN: [
      { name: 'Classic Facial', price1: '3,000.00' },
      { name: 'Gold Facial', price1: '6,500.00' },
      { name: 'Skin Brightening', price1: '5,200.00' },
      { name: 'Acne Treatment', price1: '4,800.00' },
      { name: 'Anti-Aging Facial', price1: '7,200.00', price2: '6,500.00' },
    ],
    NAIL: [
      { name: 'Classic Manicure', price1: '1,800.00' },
      { name: 'Gel Manicure', price1: '3,200.00' },
      { name: 'Classic Pedicure', price1: '2,200.00' },
      { name: 'Gel Pedicure', price1: '3,800.00' },
      { name: 'Nail Art (Per Set)', price1: '1,500.00' },
    ],
    BODY: [
      { name: 'Full Body Massage', price1: '5,500.00' },
      { name: 'Body Scrub', price1: '4,200.00' },
      { name: 'Body Wrap', price1: '6,000.00' },
      { name: 'Aromatherapy Massage', price1: '6,800.00', price2: '5,900.00' },
      { name: 'Hot Stone Massage', price1: '7,500.00' },
    ],
    BRIDAL: [
      { name: 'Bridal Package - Full', price1: '45,000.00' },
      { name: 'Bridal Hair & Makeup', price1: '18,000.00' },
      { name: 'Pre-Bridal Package', price1: '22,000.00' },
      { name: 'Trial Makeup', price1: '6,500.00' },
      { name: 'Bridal Draping', price1: '5,000.00' },
    ],
  },
  his: {
    WAX: [
      { name: 'Half Arms Wax', price1: '2,000.00' },
      { name: 'Chest Wax', price1: '3,200.00' },
      { name: 'Back Wax', price1: '3,600.00' },
      { name: 'Full Legs Wax', price1: '4,000.00' },
      { name: 'Beard Shaping', price1: '1,000.00' },
    ],
    HAIR: [
      { name: 'Haircut - Classic', price1: '1,800.00' },
      { name: 'Beard Trim', price1: '900.00' },
      { name: 'Hair Wash', price1: '700.00' },
      { name: 'Head Massage', price1: '1,500.00', price2: '1,200.00' },
      { name: 'Hair Color', price1: '3,500.00' },
    ],
    SKIN: [
      { name: 'Deep Cleansing Facial', price1: '3,500.00' },
      { name: 'Skin Polishing', price1: '4,000.00' },
      { name: 'Beard Care Facial', price1: '3,200.00' },
      { name: 'Whitening Facial', price1: '4,800.00' },
      { name: 'Detox Facial', price1: '5,500.00', price2: '4,900.00' },
    ],
    NAIL: [
      { name: 'Basic Manicure', price1: '1,200.00' },
      { name: 'Basic Pedicure', price1: '1,500.00' },
      { name: 'Nail Trim & Buff', price1: '800.00' },
      { name: 'Callus Removal', price1: '1,000.00' },
      { name: 'Hand Spa', price1: '2,200.00' },
    ],
    BODY: [
      { name: 'Deep Tissue Massage', price1: '6,000.00' },
      { name: 'Body Scrub', price1: '4,000.00' },
      { name: 'Sports Massage', price1: '6,500.00' },
      { name: 'Back Massage', price1: '3,500.00' },
      { name: 'Head & Shoulder Massage', price1: '2,800.00' },
    ],
    BRIDAL: [
      { name: 'Groom Package', price1: '25,000.00' },
      { name: 'Groom Hair & Makeup', price1: '10,000.00' },
      { name: 'Pre-Groom Package', price1: '14,000.00' },
      { name: 'Groom Facial', price1: '4,500.00' },
      { name: 'Groom Grooming', price1: '3,500.00' },
    ],
  },
};

const SERVICES_DEFAULTS = {
  hero_heading: 'Tailored Treatments for Your Unique Glow',
  hero_subtitle: "Experience a symphony of precision and luxury. Our services are tailored to the individual, utilizing the world's most exclusive botanical formulas and advanced styling techniques.",
  categories: SERVICES_CATEGORIES_DEFAULT,
  price_list: SERVICES_PRICE_LIST_DEFAULT,
};

const CONTACT_DEFAULTS = {
  hero_eyebrow: 'Luxury Concierge Experience',
  hero_heading: 'GET IN TOUCH',
  hero_subtitle: 'Experience personalized luxury tailored specifically for your needs. Our dedicated concierge team in Colombo is here to orchestrate your journey into refined elegance.',
  cta_primary_text: 'Send an Inquiry',
  cta_secondary_text: 'Call Us Now',
  phone_number: '0772336233',
  email_address: 'info@sayobeauty.com',
  stats: [
    { value: '3', label: 'Locations' },
    { value: '10+', label: 'Years of Excellence' },
    { value: '5K+', label: 'Happy Clients' },
  ],
  map_embed_src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0558055526335!2d79.85803897585825!3d6.883918893115073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25bc5b891a4b5%3A0xc60aa90940280873!2s45%2C%203%20Galle%20Rd%2C%20Colombo%2000500!5e0!3m2!1sen!2slk!4v1785130068196!5m2!1sen!2slk',
  map_address: 'No. 45, Galle Road, Colombo 03, Sri Lanka',
  map_open_href: 'https://maps.google.com/?q=45+Galle+Rd+Colombo+00500+Sri+Lanka',
  social_instagram: '',
  social_facebook: '',
  social_whatsapp: '',
  branches: [
    {
      name: 'Colombo — Head Office',
      address: 'No. 45, Galle Road, Colombo 03, Sri Lanka',
      phone: '0772336233',
      email: 'info@sayobeauty.com',
      isHead: true,
      mapHref: 'https://maps.google.com/?q=45+Galle+Rd+Colombo+00500+Sri+Lanka',
    },
    {
      name: 'Negombo Branch',
      address: 'No. 12, Poruthota Road, Negombo, Sri Lanka',
      phone: '0772336233',
      email: 'negombo@sayobeauty.com',
      isHead: false,
      mapHref: 'https://maps.google.com/?q=Poruthota+Road+Negombo+Sri+Lanka',
    },
    {
      name: 'Kiribathgoda Branch',
      address: 'No. 78, Kandy Road, Kiribathgoda, Sri Lanka',
      phone: '0772336233',
      email: 'kiribathgoda@sayobeauty.com',
      isHead: false,
      mapHref: 'https://maps.google.com/?q=Kandy+Road+Kiribathgoda+Sri+Lanka',
    },
  ],
};

// Helper function to extract valid result from Promise.allSettled
function getFulfilledResult<T>(results: PromiseSettledResult<T>[]): T | null {
  for (const res of results) {
    if (res.status === 'fulfilled' && res.value) {
      return res.value;
    }
  }
  return null;
}

/* ─────────────────────────────────────────
   GET (Fetches primarily from Cloud DB, falls back to Local DB)
───────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section');

  try {
    if (section === 'nav') {
      const data = (await cloudPrisma.navConfig.findUnique({ where: { id: 1 } })) ??
                   (await localPrisma.navConfig.findUnique({ where: { id: 1 } }));
      if (!data) return NextResponse.json(NAV_DEFAULTS);
      return NextResponse.json({
        ...data,
        nav_items: Array.isArray(data.nav_items) ? data.nav_items : NAV_DEFAULTS.nav_items,
      });
    }

    if (section === 'home') {
      const data = (await cloudPrisma.homeConfig.findUnique({ where: { id: 1 } })) ??
                   (await localPrisma.homeConfig.findUnique({ where: { id: 1 } }));
      return NextResponse.json(data ?? HOME_DEFAULTS);
    }

    if (section === 'footer') {
      const data = (await cloudPrisma.footerConfig.findUnique({ where: { id: 1 } })) ??
                   (await localPrisma.footerConfig.findUnique({ where: { id: 1 } }));
      if (!data) return NextResponse.json(FOOTER_DEFAULTS);
      return NextResponse.json({
        ...data,
        locations: Array.isArray(data.locations) ? data.locations : FOOTER_DEFAULTS.locations,
        quick_links: Array.isArray(data.quick_links) ? data.quick_links : FOOTER_DEFAULTS.quick_links,
      });
    }

    if (section === 'about') {
      const data = (await cloudPrisma.aboutConfig.findUnique({ where: { id: 1 } })) ??
                   (await localPrisma.aboutConfig.findUnique({ where: { id: 1 } }));
      if (!data) return NextResponse.json(ABOUT_DEFAULTS);
      return NextResponse.json({
        ...data,
        staff: Array.isArray(data.staff) && (data.staff as unknown[]).length > 0 ? data.staff : ABOUT_DEFAULTS.staff,
        reviews: Array.isArray(data.reviews) && (data.reviews as unknown[]).length > 0 ? data.reviews : ABOUT_DEFAULTS.reviews,
      });
    }

    if (section === 'services') {
      const data = (await cloudPrisma.servicesConfig.findUnique({ where: { id: 1 } })) ??
                   (await localPrisma.servicesConfig.findUnique({ where: { id: 1 } }));
      if (!data) return NextResponse.json(SERVICES_DEFAULTS);
      return NextResponse.json({
        hero_heading: data.hero_heading || SERVICES_DEFAULTS.hero_heading,
        hero_subtitle: data.hero_subtitle || SERVICES_DEFAULTS.hero_subtitle,
        categories: Array.isArray(data.categories) && (data.categories as unknown[]).length > 0 ? data.categories : SERVICES_DEFAULTS.categories,
        price_list: data.price_list && typeof data.price_list === 'object' ? data.price_list : SERVICES_DEFAULTS.price_list,
      });
    }

    if (section === 'contact') {
      const data = (await cloudPrisma.contactConfig.findUnique({ where: { id: 1 } })) ??
                   (await localPrisma.contactConfig.findUnique({ where: { id: 1 } }));
      if (!data) return NextResponse.json(CONTACT_DEFAULTS);
      return NextResponse.json({
        ...data,
        stats: Array.isArray(data.stats) && (data.stats as unknown[]).length > 0 ? data.stats : CONTACT_DEFAULTS.stats,
        branches: Array.isArray(data.branches) && (data.branches as unknown[]).length > 0 ? data.branches : CONTACT_DEFAULTS.branches,
      });
    }

    // All sections fallback fetch
    const [nav, home, footer, about, services, contact] = await Promise.all([
      cloudPrisma.navConfig.findUnique({ where: { id: 1 } }).catch(() => localPrisma.navConfig.findUnique({ where: { id: 1 } })),
      cloudPrisma.homeConfig.findUnique({ where: { id: 1 } }).catch(() => localPrisma.homeConfig.findUnique({ where: { id: 1 } })),
      cloudPrisma.footerConfig.findUnique({ where: { id: 1 } }).catch(() => localPrisma.footerConfig.findUnique({ where: { id: 1 } })),
      cloudPrisma.aboutConfig.findUnique({ where: { id: 1 } }).catch(() => localPrisma.aboutConfig.findUnique({ where: { id: 1 } })),
      cloudPrisma.servicesConfig.findUnique({ where: { id: 1 } }).catch(() => localPrisma.servicesConfig.findUnique({ where: { id: 1 } })),
      cloudPrisma.contactConfig.findUnique({ where: { id: 1 } }).catch(() => localPrisma.contactConfig.findUnique({ where: { id: 1 } })),
    ]);

    return NextResponse.json({
      nav: nav ? { ...nav, nav_items: Array.isArray(nav.nav_items) ? nav.nav_items : NAV_DEFAULTS.nav_items } : NAV_DEFAULTS,
      home: home ?? HOME_DEFAULTS,
      footer: footer ? { ...footer, locations: Array.isArray(footer.locations) ? footer.locations : FOOTER_DEFAULTS.locations, quick_links: Array.isArray(footer.quick_links) ? footer.quick_links : FOOTER_DEFAULTS.quick_links } : FOOTER_DEFAULTS,
      about: about ? { ...about, staff: Array.isArray(about.staff) && (about.staff as unknown[]).length > 0 ? about.staff : ABOUT_DEFAULTS.staff, reviews: Array.isArray(about.reviews) && (about.reviews as unknown[]).length > 0 ? about.reviews : ABOUT_DEFAULTS.reviews } : ABOUT_DEFAULTS,
      services: services ? { hero_heading: services.hero_heading || SERVICES_DEFAULTS.hero_heading, hero_subtitle: services.hero_subtitle || SERVICES_DEFAULTS.hero_subtitle, categories: Array.isArray(services.categories) && (services.categories as unknown[]).length > 0 ? services.categories : SERVICES_DEFAULTS.categories, price_list: services.price_list && typeof services.price_list === 'object' ? services.price_list : SERVICES_DEFAULTS.price_list } : SERVICES_DEFAULTS,
      contact: contact ? { ...contact, stats: Array.isArray(contact.stats) && (contact.stats as unknown[]).length > 0 ? contact.stats : CONTACT_DEFAULTS.stats, branches: Array.isArray(contact.branches) && (contact.branches as unknown[]).length > 0 ? contact.branches : CONTACT_DEFAULTS.branches } : CONTACT_DEFAULTS,
    });

  } catch (err) {
    console.error('[site-data GET]', err);
    return NextResponse.json({ nav: NAV_DEFAULTS, home: HOME_DEFAULTS, footer: FOOTER_DEFAULTS, about: ABOUT_DEFAULTS, services: SERVICES_DEFAULTS, contact: CONTACT_DEFAULTS });
  }
}

/* ─────────────────────────────────────────
   POST (Dual-Writes to both Local and Cloud DB)
───────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const section = req.nextUrl.searchParams.get('section');

  try {
    const body = await req.json();

    // ── nav ──
    if (section === 'nav') {
      const navPayload = {
        where: { id: 1 },
        update: {
          logo_text: body.logo_text ?? NAV_DEFAULTS.logo_text,
          contact_btn_text: body.contact_btn_text ?? NAV_DEFAULTS.contact_btn_text,
          contact_btn_link: body.contact_btn_link ?? NAV_DEFAULTS.contact_btn_link,
          nav_items: body.nav_items ?? NAV_DEFAULTS.nav_items,
          updated_by: 'admin',
        },
        create: {
          id: 1,
          logo_text: body.logo_text ?? NAV_DEFAULTS.logo_text,
          contact_btn_text: body.contact_btn_text ?? NAV_DEFAULTS.contact_btn_text,
          contact_btn_link: body.contact_btn_link ?? NAV_DEFAULTS.contact_btn_link,
          nav_items: body.nav_items ?? NAV_DEFAULTS.nav_items,
          updated_by: 'admin',
        },
      };

      const results = await Promise.allSettled([
        localPrisma.navConfig.upsert(navPayload),
        cloudPrisma.navConfig.upsert(navPayload),
      ]);

      const data = getFulfilledResult(results);
      return NextResponse.json(data ?? { success: true });
    }

    // ── home ──
    if (section === 'home') {
      const homePayload = {
        where: { id: 1 },
        update: {
          hero_eyebrow: body.hero_eyebrow ?? HOME_DEFAULTS.hero_eyebrow,
          hero_heading: body.hero_heading ?? HOME_DEFAULTS.hero_heading,
          hero_body: body.hero_body ?? HOME_DEFAULTS.hero_body,
          hero_cta_text: body.hero_cta_text ?? HOME_DEFAULTS.hero_cta_text,
          hero_cta_link: body.hero_cta_link ?? HOME_DEFAULTS.hero_cta_link,
          updated_by: 'admin',
        },
        create: {
          id: 1,
          hero_eyebrow: body.hero_eyebrow ?? HOME_DEFAULTS.hero_eyebrow,
          hero_heading: body.hero_heading ?? HOME_DEFAULTS.hero_heading,
          hero_body: body.hero_body ?? HOME_DEFAULTS.hero_body,
          hero_cta_text: body.hero_cta_text ?? HOME_DEFAULTS.hero_cta_text,
          hero_cta_link: body.hero_cta_link ?? HOME_DEFAULTS.hero_cta_link,
          updated_by: 'admin',
        },
      };

      const results = await Promise.allSettled([
        localPrisma.homeConfig.upsert(homePayload),
        cloudPrisma.homeConfig.upsert(homePayload),
      ]);

      const data = getFulfilledResult(results);
      return NextResponse.json(data ?? { success: true });
    }

    // ── footer ──
    if (section === 'footer') {
      const footerPayload = {
        where: { id: 1 },
        update: {
          brand_name: body.brand_name ?? FOOTER_DEFAULTS.brand_name,
          brand_tagline: body.brand_tagline ?? FOOTER_DEFAULTS.brand_tagline,
          contact_phone: body.contact_phone ?? FOOTER_DEFAULTS.contact_phone,
          contact_email: body.contact_email ?? FOOTER_DEFAULTS.contact_email,
          contact_address: body.contact_address ?? FOOTER_DEFAULTS.contact_address,
          copyright_text: body.copyright_text ?? FOOTER_DEFAULTS.copyright_text,
          locations: body.locations ?? FOOTER_DEFAULTS.locations,
          quick_links: body.quick_links ?? FOOTER_DEFAULTS.quick_links,
          social_whatsapp: body.social_whatsapp ?? '',
          social_facebook: body.social_facebook ?? '',
          social_instagram: body.social_instagram ?? '',
          updated_by: 'admin',
        },
        create: {
          id: 1,
          brand_name: body.brand_name ?? FOOTER_DEFAULTS.brand_name,
          brand_tagline: body.brand_tagline ?? FOOTER_DEFAULTS.brand_tagline,
          contact_phone: body.contact_phone ?? FOOTER_DEFAULTS.contact_phone,
          contact_email: body.contact_email ?? FOOTER_DEFAULTS.contact_email,
          contact_address: body.contact_address ?? FOOTER_DEFAULTS.contact_address,
          copyright_text: body.copyright_text ?? FOOTER_DEFAULTS.copyright_text,
          locations: body.locations ?? FOOTER_DEFAULTS.locations,
          quick_links: body.quick_links ?? FOOTER_DEFAULTS.quick_links,
          social_whatsapp: body.social_whatsapp ?? '',
          social_facebook: body.social_facebook ?? '',
          social_instagram: body.social_instagram ?? '',
          updated_by: 'admin',
        },
      };

      const results = await Promise.allSettled([
        localPrisma.footerConfig.upsert(footerPayload),
        cloudPrisma.footerConfig.upsert(footerPayload),
      ]);

      const data = getFulfilledResult(results);
      return NextResponse.json(data ?? { success: true });
    }

    // ── about ──
    if (section === 'about') {
      const aboutPayload = {
        where: { id: 1 },
        update: {
          hero_eyebrow: body.hero_eyebrow ?? ABOUT_DEFAULTS.hero_eyebrow,
          hero_heading: body.hero_heading ?? ABOUT_DEFAULTS.hero_heading,
          hero_body: body.hero_body ?? ABOUT_DEFAULTS.hero_body,
          team_section_title: body.team_section_title ?? ABOUT_DEFAULTS.team_section_title,
          staff: body.staff ?? ABOUT_DEFAULTS.staff,
          gallery_section_title: body.gallery_section_title ?? ABOUT_DEFAULTS.gallery_section_title,
          gallery_description: body.gallery_description ?? ABOUT_DEFAULTS.gallery_description,
          review_section_title: body.review_section_title ?? ABOUT_DEFAULTS.review_section_title,
          reviews: body.reviews ?? ABOUT_DEFAULTS.reviews,
          updated_by: 'admin',
        },
        create: {
          id: 1,
          hero_eyebrow: body.hero_eyebrow ?? ABOUT_DEFAULTS.hero_eyebrow,
          hero_heading: body.hero_heading ?? ABOUT_DEFAULTS.hero_heading,
          hero_body: body.hero_body ?? ABOUT_DEFAULTS.hero_body,
          team_section_title: body.team_section_title ?? ABOUT_DEFAULTS.team_section_title,
          staff: body.staff ?? ABOUT_DEFAULTS.staff,
          gallery_section_title: body.gallery_section_title ?? ABOUT_DEFAULTS.gallery_section_title,
          gallery_description: body.gallery_description ?? ABOUT_DEFAULTS.gallery_description,
          review_section_title: body.review_section_title ?? ABOUT_DEFAULTS.review_section_title,
          reviews: body.reviews ?? ABOUT_DEFAULTS.reviews,
          updated_by: 'admin',
        },
      };

      const results = await Promise.allSettled([
        localPrisma.aboutConfig.upsert(aboutPayload),
        cloudPrisma.aboutConfig.upsert(aboutPayload),
      ]);

      const data = getFulfilledResult(results);
      return NextResponse.json(data ?? { success: true });
    }

    // ── services ──
    if (section === 'services') {
      const servicesPayload = {
        where: { id: 1 },
        update: {
          hero_heading: body.hero_heading ?? SERVICES_DEFAULTS.hero_heading,
          hero_subtitle: body.hero_subtitle ?? SERVICES_DEFAULTS.hero_subtitle,
          categories: body.categories ?? SERVICES_DEFAULTS.categories,
          price_list: body.price_list ?? SERVICES_DEFAULTS.price_list,
          updated_by: 'admin',
        },
        create: {
          id: 1,
          hero_heading: body.hero_heading ?? SERVICES_DEFAULTS.hero_heading,
          hero_subtitle: body.hero_subtitle ?? SERVICES_DEFAULTS.hero_subtitle,
          categories: body.categories ?? SERVICES_DEFAULTS.categories,
          price_list: body.price_list ?? SERVICES_DEFAULTS.price_list,
          updated_by: 'admin',
        },
      };

      const results = await Promise.allSettled([
        localPrisma.servicesConfig.upsert(servicesPayload),
        cloudPrisma.servicesConfig.upsert(servicesPayload),
      ]);

      const data = getFulfilledResult(results);
      return NextResponse.json(data ?? { success: true });
    }

    // ── contact ──
    if (section === 'contact') {
      const contactPayload = {
        where: { id: 1 },
        update: {
          hero_eyebrow: body.hero_eyebrow ?? CONTACT_DEFAULTS.hero_eyebrow,
          hero_heading: body.hero_heading ?? CONTACT_DEFAULTS.hero_heading,
          hero_subtitle: body.hero_subtitle ?? CONTACT_DEFAULTS.hero_subtitle,
          cta_primary_text: body.cta_primary_text ?? CONTACT_DEFAULTS.cta_primary_text,
          cta_secondary_text: body.cta_secondary_text ?? CONTACT_DEFAULTS.cta_secondary_text,
          phone_number: body.phone_number ?? CONTACT_DEFAULTS.phone_number,
          email_address: body.email_address ?? CONTACT_DEFAULTS.email_address,
          stats: body.stats ?? CONTACT_DEFAULTS.stats,
          map_embed_src: body.map_embed_src ?? CONTACT_DEFAULTS.map_embed_src,
          map_address: body.map_address ?? CONTACT_DEFAULTS.map_address,
          map_open_href: body.map_open_href ?? CONTACT_DEFAULTS.map_open_href,
          social_instagram: body.social_instagram ?? '',
          social_facebook: body.social_facebook ?? '',
          social_whatsapp: body.social_whatsapp ?? '',
          branches: body.branches ?? CONTACT_DEFAULTS.branches,
          updated_by: 'admin',
        },
        create: {
          id: 1,
          hero_eyebrow: body.hero_eyebrow ?? CONTACT_DEFAULTS.hero_eyebrow,
          hero_heading: body.hero_heading ?? CONTACT_DEFAULTS.hero_heading,
          hero_subtitle: body.hero_subtitle ?? CONTACT_DEFAULTS.hero_subtitle,
          cta_primary_text: body.cta_primary_text ?? CONTACT_DEFAULTS.cta_primary_text,
          cta_secondary_text: body.cta_secondary_text ?? CONTACT_DEFAULTS.cta_secondary_text,
          phone_number: body.phone_number ?? CONTACT_DEFAULTS.phone_number,
          email_address: body.email_address ?? CONTACT_DEFAULTS.email_address,
          stats: body.stats ?? CONTACT_DEFAULTS.stats,
          map_embed_src: body.map_embed_src ?? CONTACT_DEFAULTS.map_embed_src,
          map_address: body.map_address ?? CONTACT_DEFAULTS.map_address,
          map_open_href: body.map_open_href ?? CONTACT_DEFAULTS.map_open_href,
          social_instagram: body.social_instagram ?? '',
          social_facebook: body.social_facebook ?? '',
          social_whatsapp: body.social_whatsapp ?? '',
          branches: body.branches ?? CONTACT_DEFAULTS.branches,
          updated_by: 'admin',
        },
      };

      const results = await Promise.allSettled([
        localPrisma.contactConfig.upsert(contactPayload),
        cloudPrisma.contactConfig.upsert(contactPayload),
      ]);

      const data = getFulfilledResult(results);
      return NextResponse.json(data ?? { success: true });
    }

    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });

  } catch (err) {
    console.error('[site-data POST]', err);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}